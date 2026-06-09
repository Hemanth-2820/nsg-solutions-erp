import os, re

def fix(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    new_content = re.sub(r'chatChannels\.filter\(\s*([a-zA-Z0-9_]+)\s*=>\s*\1\.members\s*&&\s*\1\.members\.includes\(([^)]+)\)\s*\)',
                         r'chatChannels.filter(\1 => \1.id === "general-channel" || (\1.members && \1.members.includes(\2)))', 
                         content)

    if new_content != content:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print("Fixed " + filepath)

fix("src/components/employee/Messaging.jsx")
fix("src/components/ceo/pages/Messaging.jsx")
fix("src/components/tl/Messaging & Meet/messages.module.index.jsx")
