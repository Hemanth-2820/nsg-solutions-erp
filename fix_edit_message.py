import os

files = [
    r'c:\Users\DELL\Desktop\NSG-ERP\src\components\ceo\pages\Messaging.jsx',
    r'c:\Users\DELL\Desktop\NSG-ERP\src\components\employee\Messaging.jsx',
    r'c:\Users\DELL\Desktop\NSG-ERP\src\components\hr\modules\messaging\HrMessagingView.jsx',
    r"c:\Users\DELL\Desktop\NSG-ERP\src\components\tl\Messaging & Meet\messages.module.index.jsx"
]

for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()

        changed = False

        # Fix 1: Add delete_message and update_message handling in WS
        old_ws = "if (eventType === 'message_delivered' || eventType === 'message_read' || eventType === 'update_message') {\n          fetchChannelsAndMessages();\n          return;\n        }"
        new_ws = "if (eventType === 'message_delivered' || eventType === 'message_read' || eventType === 'update_message' || eventType === 'delete_message') {\n          fetchChannelsAndMessages();\n          return;\n        }"
        if old_ws in content:
            content = content.replace(old_ws, new_ws)
            changed = True
            print(f'Fixed delete_message WS handler in {os.path.basename(f)}')

        # Fix 2: Improve submitEditMessage to show errors
        old_edit = """  const submitEditMessage = async (msgId, newText) => {
    if(!newText.trim()) return;
    try {
      const token = localStorage.getItem('nsg_jwt_token');
      await fetch(`/api/employee-portal/chat/messages/${msgId}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newText.trim() })
      });
      setEditingMessageId(null);
      setEditingText('');
      fetchChannelsAndMessages();
    } catch (err) { console.error(err); }
  };"""

        new_edit = """  const submitEditMessage = async (msgId, newText) => {
    if(!newText.trim()) return;
    try {
      const token = localStorage.getItem('nsg_jwt_token');
      const res = await fetch(`/api/employee-portal/chat/messages/${msgId}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newText.trim() })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('Edit failed:', res.status, err);
        alert('Failed to edit message: ' + (err.detail || res.status));
        return;
      }
      setEditingMessageId(null);
      setEditingText('');
      fetchChannelsAndMessages();
    } catch (err) { console.error(err); }
  };"""

        if old_edit in content:
            content = content.replace(old_edit, new_edit)
            changed = True
            print(f'Improved submitEditMessage in {os.path.basename(f)}')
        else:
            # Try to find and patch it differently (CR/LF endings)
            old_edit_cr = old_edit.replace('\n', '\r\n')
            if old_edit_cr in content:
                new_edit_cr = new_edit.replace('\n', '\r\n')
                content = content.replace(old_edit_cr, new_edit_cr)
                changed = True
                print(f'Improved submitEditMessage (CR LF) in {os.path.basename(f)}')
            else:
                print(f'Could not find submitEditMessage pattern in {os.path.basename(f)}')

        if changed:
            with open(f, 'w', encoding='utf-8') as fw:
                fw.write(content)

    except Exception as e:
        print(f'Error in {os.path.basename(f)}: {e}')
