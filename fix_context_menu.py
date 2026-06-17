import os, re

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

        # The context menu shows edit/delete only for own messages
        # Old: contextMenu.msg.isMe || (contextMenu.msg.sender && contextMenu.msg.sender.includes('CEO'))
        # New: contextMenu.msg.isMe || (contextMenu.msg.sender && (contextMenu.msg.sender === ceoName || contextMenu.msg.sender.includes('CEO') || ...))
        
        old_condition = "(contextMenu.msg.isMe || (contextMenu.msg.sender && contextMenu.msg.sender.includes('CEO')))"
        new_condition = f"(contextMenu.msg.isMe || (contextMenu.msg.sender && (contextMenu.msg.sender === {name_var} || contextMenu.msg.sender.includes('CEO') || contextMenu.msg.sender.toLowerCase() === 'ceo' || contextMenu.msg.sender.includes('HR') || contextMenu.msg.sender.toLowerCase() === 'hr' || contextMenu.msg.sender.includes('TL') || contextMenu.msg.sender.toLowerCase() === 'tl')))"

        if old_condition in content:
            content = content.replace(old_condition, new_condition)
            changed = True
            print(f'Fixed context menu condition in {os.path.basename(f)}')
        else:
            # Find what pattern it uses
            m = re.search(r'\(contextMenu\.msg\.isMe[^\)]+\)', content)
            if m:
                print(f'{os.path.basename(f)}: Found alt pattern: {content[m.start():m.end()]}')
            else:
                print(f'{os.path.basename(f)}: No context menu condition found')

        if changed:
            with open(f, 'w', encoding='utf-8') as fw:
                fw.write(content)

    except Exception as e:
        print(f'Error in {os.path.basename(f)}: {e}')
