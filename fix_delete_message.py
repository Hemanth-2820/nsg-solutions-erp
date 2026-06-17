import os

files = [
    r'c:\Users\DELL\Desktop\NSG-ERP\src\components\employee\Messaging.jsx',
    r'c:\Users\DELL\Desktop\NSG-ERP\src\components\hr\modules\messaging\HrMessagingView.jsx',
    r"c:\Users\DELL\Desktop\NSG-ERP\src\components\tl\Messaging & Meet\messages.module.index.jsx"
]

old_delete = """  const handleDeleteMessage = async (msgId) => {
    if(!window.confirm("Delete this message?")) return;
    try {
      const token = localStorage.getItem('nsg_jwt_token');
      await fetch(`/api/employee-portal/chat/messages/${msgId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) { console.error(err); }
  };"""

new_delete = """  const handleDeleteMessage = async (msgId) => {
    if(!window.confirm("Delete this message?")) return;
    try {
      const token = localStorage.getItem('nsg_jwt_token');
      const res = await fetch(`/api/employee-portal/chat/messages/${msgId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert('Failed to delete: ' + (err.detail || res.status));
        return;
      }
      fetchChannelsAndMessages();
    } catch (err) { console.error(err); }
  };"""

for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()

        if old_delete in content:
            content = content.replace(old_delete, new_delete)
            with open(f, 'w', encoding='utf-8') as fw:
                fw.write(content)
            print(f'Fixed handleDeleteMessage in {os.path.basename(f)}')
        elif old_delete.replace('\n', '\r\n') in content:
            content = content.replace(old_delete.replace('\n', '\r\n'), new_delete.replace('\n', '\r\n'))
            with open(f, 'w', encoding='utf-8') as fw:
                fw.write(content)
            print(f'Fixed handleDeleteMessage (CRLF) in {os.path.basename(f)}')
        else:
            print(f'Pattern not found in {os.path.basename(f)}')
    except Exception as e:
        print(f'Error in {os.path.basename(f)}: {e}')
