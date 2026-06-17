import os, re

files = [
    r'c:\Users\DELL\Desktop\NSG-ERP\src\components\ceo\pages\Messaging.jsx',
    r'c:\Users\DELL\Desktop\NSG-ERP\src\components\employee\Messaging.jsx',
    r'c:\Users\DELL\Desktop\NSG-ERP\src\components\hr\modules\messaging\HrMessagingView.jsx',
    r'c:\Users\DELL\Desktop\NSG-ERP\src\components\tl\Messaging & Meet\messages.module.index.jsx'
]

for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()

        changed = False

        # 1. Ensure Pin icon is imported from lucide-react
        if 'Pin,' not in content and ' Pin ' not in content:
            content = re.sub(r'(import {[^}]*?)(} from \'lucide-react\';)', r'\1, Pin \2', content)
            changed = True

        # 2. Add message_pinned websocket handler
        if 'message_pinned' not in content:
            ws_handler = '''
        if (eventType === 'typing_stop') {
           setTypingUsers(prev => ({ ...prev, [payload.channel_id]: (prev[payload.channel_id] || []).filter(u => u !== payload.user) }));
           return;
        }

        if (eventType === 'message_pinned') {
          fetchChannelsAndMessages();
          return;
        }'''
            content = re.sub(r'if \(eventType === \'typing_stop\'\)[^{]*\{[^}]*\}\s*return;\s*\}', ws_handler, content)
            changed = True

        # 3. Inject Pinned Messages Banner with scroll functionality
        banner_code = '''{/* Pinned Messages Banner */}
        {(() => {
          const pinnedMsgs = (messages[selectedChannel] || []).filter(m => m.is_pinned);
          if (pinnedMsgs.length === 0) return null;
          return (
            <div style={{ background: '#FEF3C7', borderBottom: '1px solid #FDE68A', padding: '10px 24px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Pin size={16} color="#D97706" style={{ marginTop: '2px' }} />
              <div style={{ flex: 1 }}>
                 <div style={{ fontSize: '11px', fontWeight: 800, color: '#D97706', textTransform: 'uppercase', marginBottom: '2px' }}>Pinned Messages ({pinnedMsgs.length})</div>
                 <div style={{ fontSize: '13px', color: '#92400E', maxHeight: '40px', overflowY: 'auto' }}>
                    {pinnedMsgs.map(pm => (
                       <div 
                         key={pm.id} 
                         onClick={() => {
                           const el = document.getElementById(`msg-${pm.id}`);
                           if(el) {
                             el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                             el.style.backgroundColor = '#FEF3C7';
                             setTimeout(() => el.style.backgroundColor = '', 2000);
                           }
                         }}
                         style={{ display: 'flex', gap: '8px', marginBottom: '4px', cursor: 'pointer', transition: 'background-color 0.3s', padding: '2px 4px', borderRadius: '4px' }}
                         onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(217, 119, 6, 0.1)'}
                         onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                       >
                          <strong>{pm.sender}:</strong>
                          <span>{renderMessageText(pm.text)}</span>
                       </div>
                    ))}
                 </div>
              </div>
            </div>
          );
        })()}'''
        
        # Replace existing banner or insert it
        if 'Pinned Messages Banner' in content:
            # We need to replace the old banner code
            content = re.sub(r'\{\/\* Pinned Messages Banner \*\/\}[\s\S]*?\}\)\(\)\}', banner_code, content)
            changed = True
        else:
            # Insert before {/* Offline Banner */}
            if '{/* Offline Banner */}' in content:
                content = content.replace('{/* Offline Banner */}', banner_code + '\n\n        {/* Offline Banner */}')
                changed = True

        # 4. Inject Pin Message context menu button
        if '<Pin size={16}' not in content and 'pin_message' not in content[content.rfind('CONTEXT MENU'):]:
            context_btn = '''<button 
              onClick={() => {
                if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                  socketRef.current.send(JSON.stringify({ type: 'pin_message', msg_id: contextMenu.msg.id, channel_id: selectedChannel, is_pinned: !contextMenu.msg.is_pinned }));
                }
                closeContextMenu();
              }} 
              style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'transparent', border: 'none', borderBottom: '1px solid var(--ceo-divider)', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: 'var(--ceo-text-primary)' }}
            >
              <Pin size={16} /> {contextMenu.msg.is_pinned ? 'Unpin Message' : 'Pin Message'}
            </button>'''
            
            # insert before React button
            react_btn_regex = r'<button[^>]*>\s*<Smile size=\{16\} \/> React\s*<\/button>'
            if re.search(react_btn_regex, content):
                content = re.sub(react_btn_regex, context_btn + r'\n\n            \g<0>', content)
                changed = True

        # 5. Add id={`msg-${msg.id}`} to the message row so we can scroll to it
        if 'className=\"message-row\"' in content and 'id={`msg-${msg.id}`}' not in content:
            content = content.replace('className=\"message-row\"', 'className=\"message-row\" id={`msg-${msg.id}`}')
            changed = True

        if changed:
            with open(f, 'w', encoding='utf-8') as fw:
                fw.write(content)
            print(f'Successfully updated Pin logic in {f}')
        else:
            print(f'No changes needed in {f}')

    except Exception as e:
        print(f'Error reading {f}: {e}')
