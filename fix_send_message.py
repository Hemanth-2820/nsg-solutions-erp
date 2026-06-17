import os, re

files = [
    r'c:\Users\DELL\Desktop\NSG-ERP\src\components\employee\Messaging.jsx',
    r'c:\Users\DELL\Desktop\NSG-ERP\src\components\hr\modules\messaging\HrMessagingView.jsx',
    r"c:\Users\DELL\Desktop\NSG-ERP\src\components\tl\Messaging & Meet\messages.module.index.jsx"
]

for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Find the broken line
        broken = "const msgPayload = {\\n      type: \\'new_message\\',"
        if broken in content:
            fixed = "const msgPayload = {\n      type: 'new_message',"
            content = content.replace(broken, fixed)
            with open(f, 'w', encoding='utf-8') as fw:
                fw.write(content)
            print(f'Fixed msgPayload in {os.path.basename(f)}')
        else:
            # check if already broken differently
            idx = content.find("const msgPayload = {")
            if idx != -1:
                chunk = content[idx:idx+80]
                print(f'{os.path.basename(f)} chunk: {repr(chunk)}')
            else:
                print(f'No msgPayload in {os.path.basename(f)}')
    except Exception as e:
        print(f'Error: {e}')
