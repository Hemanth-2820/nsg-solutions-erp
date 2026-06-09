import os, re

path = "src/components/employee/Messaging.jsx"
if os.path.exists(path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    new_content = content.replace(
        "String(currentUser?.id)", 
        "String(db?.employees?.find(e => e.email === currentUser?.email)?.id || currentUser?.id)"
    )

    if new_content != content:
        with open(path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print("Updated Employee Messaging.jsx")
    else:
        print("No changes made.")
