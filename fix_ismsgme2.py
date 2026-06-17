import os

files_and_names = [
    (r'c:\Users\DELL\Desktop\NSG-ERP\src\components\employee\Messaging.jsx', 'empName', 'Employee'),
    (r"c:\Users\DELL\Desktop\NSG-ERP\src\components\tl\Messaging & Meet\messages.module.index.jsx", 'tlName', 'TL'),
]

for f, name_var, role_keyword in files_and_names:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        changed = False

        old_ismsgme = f"isMsgMe = msg.isMe || (msg.sender && (msg.sender.includes('{role_keyword}')));"
        new_ismsgme = f"isMsgMe = msg.isMe || (msg.sender && (msg.sender === {name_var} || msg.sender.includes('CEO') || msg.sender.includes('HR') || msg.sender.toLowerCase() === 'hr' || msg.sender.includes('TL') || msg.sender.toLowerCase() === 'tl' || msg.sender.includes('{role_keyword}')));"

        if old_ismsgme in content:
            content = content.replace(old_ismsgme, new_ismsgme)
            changed = True
            print(f'Fixed isMsgMe in {os.path.basename(f)}')
        else:
            print(f'Pattern not found in {os.path.basename(f)}')

        if changed:
            with open(f, 'w', encoding='utf-8') as fw:
                fw.write(content)

    except Exception as e:
        print(f'Error in {os.path.basename(f)}: {e}')
