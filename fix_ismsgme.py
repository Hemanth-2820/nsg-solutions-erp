import os

files_and_names = [
    (r'c:\Users\DELL\Desktop\NSG-ERP\src\components\ceo\pages\Messaging.jsx', 'ceoName', 'CEO'),
    (r'c:\Users\DELL\Desktop\NSG-ERP\src\components\employee\Messaging.jsx', 'empName', 'Employee'),
    (r'c:\Users\DELL\Desktop\NSG-ERP\src\components\hr\modules\messaging\HrMessagingView.jsx', 'userName', 'HR Manager'),
    (r"c:\Users\DELL\Desktop\NSG-ERP\src\components\tl\Messaging & Meet\messages.module.index.jsx", 'tlName', 'TL'),
]

for f, name_var, role_keyword in files_and_names:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        changed = False

        # Fix isMsgMe: should include userName check, not just CEO
        # The wrong line is: isMsgMe = msg.isMe || (msg.sender && (msg.sender.includes('CEO')));
        # Should be: isMsgMe = msg.isMe || (msg.sender && (msg.sender === userName || msg.sender.includes('CEO') || msg.sender.includes('HR') || msg.sender.toLowerCase() === 'hr'));
        
        old_ismsgme = "isMsgMe = msg.isMe || (msg.sender && (msg.sender.includes('CEO')));"
        new_ismsgme = f"isMsgMe = msg.isMe || (msg.sender && (msg.sender === {name_var} || msg.sender.includes('CEO') || msg.sender.includes('HR') || msg.sender.toLowerCase() === 'hr' || msg.sender.includes('TL') || msg.sender.toLowerCase() === 'tl'));"
        
        if old_ismsgme in content:
            content = content.replace(old_ismsgme, new_ismsgme)
            changed = True
            print(f'Fixed isMsgMe in {os.path.basename(f)}')
        else:
            print(f'isMsgMe pattern not found in {os.path.basename(f)}, checking alternatives...')
            import re
            m = re.search(r'isMsgMe = [^\n;]+;', content)
            if m:
                print(f'  Found: {content[m.start():m.end()]}')

        # Also fix the isMe mapping in fetchChannelsAndMessages - add more name checks
        # Old: isMe: m.sender === ceoName || m.sender === ceoName + ' (CEO)' || m.sender === 'John Doe (CEO)' || m.sender === 'John Doe',
        # This already uses the name_var correctly for CEO, but for HR it may just check 'hr'
        
        if changed:
            with open(f, 'w', encoding='utf-8') as fw:
                fw.write(content)

    except Exception as e:
        print(f'Error in {os.path.basename(f)}: {e}')
