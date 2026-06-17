import os

files = [
    r'c:\Users\DELL\Desktop\NSG-ERP\src\components\ceo\pages\Messaging.jsx',
    r'c:\Users\DELL\Desktop\NSG-ERP\src\components\employee\Messaging.jsx',
    r'c:\Users\DELL\Desktop\NSG-ERP\src\components\hr\modules\messaging\HrMessagingView.jsx',
    r'c:\Users\DELL\Desktop\NSG-ERP\src\components\tl\Messaging & Meet\messages.module.index.jsx'
]

modal_state_code = '''
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
'''

modal_ui_code = '''
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
                    <img src={e.photo ? "http://localhost:8000"+e.photo : (e.avatar || "https://ui-avatars.com/api/?name="+e.name.replace(' ', '+'))} alt="" style={{width: '24px', height: '24px', borderRadius: '12px', objectFit: 'cover'}} onError={(ev)=>{ev.target.onerror=null;ev.target.src="https://ui-avatars.com/api/?name="+e.name.replace(' ', '+');}} /> {e.name}
                  </button>
               ))}
            </div>
            <button onClick={() => setForwardMessageModal(null)} style={{ padding: '12px', background: '#E2E8F0', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', color: 'var(--ceo-text-primary)' }}>Cancel</button>
          </div>
        </div>
      )}
'''

for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()

        # Check if already applied
        if 'executeForwardMessage' not in content:
            # 1. Inject state right after showMentionsPopup
            content = content.replace(
                'const [showMentionsPopup, setShowMentionsPopup] = useState(false);',
                'const [showMentionsPopup, setShowMentionsPopup] = useState(false);\n' + modal_state_code
            )
        
        if 'Forward Message To...' not in content:
            # 2. Inject UI before the final </div>\n);
            idx = content.rfind('</div>\n);')
            if idx != -1:
                content = content[:idx] + modal_ui_code + '\n    ' + content[idx:]
            else:
                idx = content.rfind('</div>\n  );')
                if idx != -1:
                    content = content[:idx] + modal_ui_code + '\n    ' + content[idx:]

        # 3. Replace the old Forward Message button
        old_btn_start = 'let fwdText = `[Forwarded]: ${contextMenu.msg.text || \'\'}`;'
        if old_btn_start in content:
            # We need to find the entire block to replace
            start_idx = content.find(old_btn_start)
            btn_start_idx = content.rfind('<button', 0, start_idx)
            btn_end_idx = content.find('</button>', start_idx) + 9
            
            if btn_start_idx != -1 and btn_end_idx != -1:
                new_btn = '''<button 
              onClick={() => { 
                setForwardMessageModal(contextMenu.msg);
                closeContextMenu();
              }} 
              style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'transparent', border: 'none', borderBottom: '1px solid var(--ceo-divider)', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: 'var(--ceo-text-primary)' }}
            >
              <Send size={16} /> Forward Message
            </button>'''
                content = content[:btn_start_idx] + new_btn + content[btn_end_idx:]

        with open(f, 'w', encoding='utf-8') as fw:
            fw.write(content)
        print(f'Successfully applied robust fix to {f}')

    except Exception as e:
        print(f'Error reading {f}: {e}')
