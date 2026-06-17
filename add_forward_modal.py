import os

files = [
    r'c:\Users\DELL\Desktop\NSG-ERP\src\components\ceo\pages\Messaging.jsx',
    r'c:\Users\DELL\Desktop\NSG-ERP\src\components\employee\Messaging.jsx',
    r'c:\Users\DELL\Desktop\NSG-ERP\src\components\hr\modules\messaging\HrMessagingView.jsx',
    r'c:\Users\DELL\Desktop\NSG-ERP\src\components\tl\Messaging & Meet\messages.module.index.jsx'
]

modal_code = '''  const [forwardMessageModal, setForwardMessageModal] = useState(null);

  const executeForwardMessage = (targetChannelId) => {
    let fwdText = [Forwarded]: \;
    const msgPayload = {
      channel_id: targetChannelId,
      text: fwdText,
      sender: ceoName,
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
  };'''

modal_ui = '''      {forwardMessageModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#FFF', width: '400px', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Forward Message To...</h3>
            <div style={{ fontSize: '13px', color: 'var(--ceo-text-muted)', background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid var(--ceo-border)', fontStyle: 'italic' }}>
               "{forwardMessageModal.text}"
               {forwardMessageModal.attachment_url && <div style={{marginTop: '4px', color: 'var(--ceo-primary)'}}>[Attachment Included]</div>}
            </div>
            <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '8px' }}>
               <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ceo-text-muted)' }}>CHANNELS</div>
               {chatChannels.map(c => (
                  <button key={wd-\} onClick={() => executeForwardMessage(c.id)} style={{ padding: '10px 12px', textAlign: 'left', background: 'transparent', border: '1px solid var(--ceo-border)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--ceo-text-primary)' }}>
                    <Hash size={16} color="var(--ceo-text-muted)"/> {c.name}
                  </button>
               ))}
               <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ceo-text-muted)', marginTop: '8px' }}>DIRECT MESSAGES</div>
               {employees.filter(e => !e.isMe).map(e => (
                  <button key={wd-dm-\} onClick={() => executeForwardMessage(dm-\)} style={{ padding: '10px 12px', textAlign: 'left', background: 'transparent', border: '1px solid var(--ceo-border)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--ceo-text-primary)' }}>
                    <img src={e.photo ? http://localhost:8000\ : (e.avatar || https://ui-avatars.com/api/?name=\)} alt="" style={{width: '24px', height: '24px', borderRadius: '12px', objectFit: 'cover'}} onError={(ev)=>{ev.target.onerror=null;ev.target.src=https://ui-avatars.com/api/?name=\;}} /> {e.name}
                  </button>
               ))}
            </div>
            <button onClick={() => setForwardMessageModal(null)} style={{ padding: '12px', background: '#E2E8F0', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', color: 'var(--ceo-text-primary)' }}>Cancel</button>
          </div>
        </div>
      )}'''

for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            
        if 'const [forwardMessageModal' not in content:
            # Inject state and function
            content = content.replace(
                "const [showMentionsPopup, setShowMentionsPopup] = useState(false);",
                "const [showMentionsPopup, setShowMentionsPopup] = useState(false);\n" + modal_code
            )
            
            # Inject UI
            content = content.replace(
                "{/* === CONTEXT MENU === */}",
                modal_ui + "\n      {/* === CONTEXT MENU === */}"
            )
            
            # Change context menu button action
            content = content.replace(
                '''            <button 
              onClick={() => { 
                let fwdText = [Forwarded]: \;
                if (contextMenu.msg.attachment_url) fwdText +=  (Attachment: http://localhost:8000\);
                setInputVal(fwdText.trim());
                closeContextMenu();
              }}''',
                '''            <button 
              onClick={() => { 
                setForwardMessageModal(contextMenu.msg);
                closeContextMenu();
              }}'''
            )
            
            with open(f, 'w', encoding='utf-8') as file:
                file.write(content)
                
            print('Fixed forward logic in:', f)
    except Exception as e:
        print('Error in', f, e)
