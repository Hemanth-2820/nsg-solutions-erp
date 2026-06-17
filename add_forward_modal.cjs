const fs = require('fs');

const files = [
    'src/components/ceo/pages/Messaging.jsx',
    'src/components/employee/Messaging.jsx',
    'src/components/hr/modules/messaging/HrMessagingView.jsx',
    'src/components/tl/Messaging & Meet/messages.module.index.jsx'
];

const modalCode = `
  const [forwardMessageModal, setForwardMessageModal] = useState(null);

  const executeForwardMessage = (targetChannelId) => {
    let fwdText = "[Forwarded]: " + (forwardMessageModal.text || '');
    const msgPayload = {
      channel_id: targetChannelId,
      text: fwdText,
      sender: typeof currentUser !== 'undefined' && currentUser ? currentUser.name : (typeof ceoName !== 'undefined' ? ceoName : 'Unknown'),
      attachment_url: forwardMessageModal.attachment_url || null,
      attachment_type: forwardMessageModal.attachment_type || null,
      parent_id: null,
      mentions: null
    };

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'new_message', ...msgPayload }));
    } else {
      const queue = JSON.parse(localStorage.getItem('nsg_chat_queue') || '[]');
      queue.push({ type: 'new_message', ...msgPayload });
      localStorage.setItem('nsg_chat_queue', JSON.stringify(queue));
    }

    setForwardMessageModal(null);
    setSelectedChannel(targetChannelId); // Switch to the target channel
  };
`;

const modalUI = `
      {forwardMessageModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#FFF', width: '400px', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Forward Message To...</h3>
            <div style={{ fontSize: '13px', color: 'var(--ceo-text-muted)', background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid var(--ceo-border)', fontStyle: 'italic' }}>
               "{forwardMessageModal.text}"
               {forwardMessageModal.attachment_url && <div style={{marginTop: '4px', color: 'var(--ceo-primary)'}}>[Attachment Included]</div>}
            </div>
            <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '8px' }}>
               <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ceo-text-muted)' }}>CHANNELS</div>
               {(typeof dbChannels !== 'undefined' ? dbChannels : (typeof chatChannels !== 'undefined' ? chatChannels : [])).map(c => (
                  <button key={"fwd-"+c.id} onClick={() => executeForwardMessage(c.id)} style={{ padding: '10px 12px', textAlign: 'left', background: 'transparent', border: '1px solid var(--ceo-border)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--ceo-text-primary)' }}>
                    <Hash size={16} color="var(--ceo-text-muted)"/> {c.name}
                  </button>
               ))}
               <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ceo-text-muted)', marginTop: '8px' }}>DIRECT MESSAGES</div>
               {(typeof employees !== 'undefined' ? employees : []).filter(e => !e.isMe).map(e => (
                  <button key={"fwd-dm-"+e.id} onClick={() => executeForwardMessage("dm-"+e.id)} style={{ padding: '10px 12px', textAlign: 'left', background: 'transparent', border: '1px solid var(--ceo-border)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--ceo-text-primary)' }}>
                    <img src={e.photo ? "http://localhost:8000"+e.photo : (e.avatar || "https://ui-avatars.com/api/?name="+encodeURIComponent(e.name))} alt="" style={{width: '24px', height: '24px', borderRadius: '12px', objectFit: 'cover'}} onError={(ev)=>{ev.target.onerror=null;ev.target.src="https://ui-avatars.com/api/?name="+encodeURIComponent(e.name);}} /> {e.name}
                  </button>
               ))}
            </div>
            <button onClick={() => setForwardMessageModal(null)} style={{ padding: '12px', background: '#E2E8F0', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', color: 'var(--ceo-text-primary)' }}>Cancel</button>
          </div>
        </div>
      )}
`;

for (let file of files) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        // 1. Remove previously injected state if any
        let stateRegex = /const \[forwardMessageModal.*?setSelectedChannel\(targetChannelId\);\s*\};/s;
        content = content.replace(stateRegex, "");
        
        // 2. Remove previously injected UI if any
        let uiRegex = /\{forwardMessageModal && \([\s\S]*?\}\)\}/s;
        let match;
        while ((match = content.match(uiRegex))) {
            content = content.replace(uiRegex, "");
        }

        // 3. Inject state
        content = content.replace(
            "const [showMentionsPopup, setShowMentionsPopup] = useState(false);",
            "const [showMentionsPopup, setShowMentionsPopup] = useState(false);\n" + modalCode
        );
        
        // 4. Inject UI before closing root div
        content = content.replace(
            /(<\/[a-zA-Z]+>\s*)$/,
            modalUI + "\n$1"
        );
        
        // 5. Replace onClick for Forward Message button
        let btnRegex = /<button[^>]*onClick=\{\(\) => \{[^}]*let fwdText =[^}]*\}\}[^>]*>[\s\S]*?<Send size=\{16\} \/> Forward Message\s*<\/button>/m;
        if(content.match(btnRegex)) {
            content = content.replace(btnRegex, "<button onClick={() => { setForwardMessageModal(contextMenu.msg); closeContextMenu(); }} style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'transparent', border: 'none', borderBottom: '1px solid var(--ceo-divider)', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: 'var(--ceo-text-primary)' }}><Send size={16} /> Forward Message</button>");
        }
        
        fs.writeFileSync(file, content, 'utf8');
        console.log("Fixed cleanly: " + file);
    }
}
