import os

files = [
    r'c:\Users\DELL\Desktop\NSG-ERP\src\components\ceo\pages\Messaging.jsx',
    r'c:\Users\DELL\Desktop\NSG-ERP\src\components\employee\Messaging.jsx',
    r'c:\Users\DELL\Desktop\NSG-ERP\src\components\hr\modules\messaging\HrMessagingView.jsx',
    r"c:\Users\DELL\Desktop\NSG-ERP\src\components\tl\Messaging & Meet\messages.module.index.jsx"
]

# Things to fix:
# 1. Add missing is_pinned, parent_id to message mapping
# 2. Make sure edit message works (check isMsgMe evaluation)

for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()

        changed = False

        # Fix: add is_pinned and parent_id to message mapping
        # The mapping has: is_edited, deleted_at, reactions, seen_by, delivered_to
        # We need to add: is_pinned, parent_id
        
        if 'is_edited: m.is_edited,' in content and 'is_pinned: m.is_pinned' not in content:
            content = content.replace(
                'is_edited: m.is_edited,',
                'is_edited: m.is_edited,\n                    is_pinned: m.is_pinned,\n                    parent_id: m.parent_id,'
            )
            changed = True
            print(f'Added is_pinned and parent_id to {os.path.basename(f)}')

        if changed:
            with open(f, 'w', encoding='utf-8') as fw:
                fw.write(content)
        else:
            print(f'No mapping changes needed in {os.path.basename(f)}')

    except Exception as e:
        print(f'Error in {f}: {e}')
