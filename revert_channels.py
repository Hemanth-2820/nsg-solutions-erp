import os, re

def revert(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # We want to change:
    # c.id === 'general-channel' || (c.members && c.members.includes(String(currentUser?.id)))
    # back to:
    # c.members && c.members.includes(String(currentUser?.id))
    
    new_content = re.sub(r"c\.id === 'general-channel' \|\| \((c\.members && c\.members\.includes\(String\(currentUser\?\.id\)\))\)",
                         r"\1",
                         content)

    new_content = re.sub(r'c\.id === "general-channel" \|\| \((c\.members && c\.members\.includes\(String\(currentUser\?\.id\)\))\)',
                         r'\1',
                         new_content)

    if new_content != content:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print("Reverted " + filepath)
    else:
        print("No change " + filepath)

revert("src/components/employee/Messaging.jsx")
revert("src/components/ceo/pages/Messaging.jsx")
revert("src/components/tl/Messaging & Meet/messages.module.index.jsx")
