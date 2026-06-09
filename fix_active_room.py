import os, re

path = "src/components/employee/Messaging.jsx"
if os.path.exists(path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # We need to make sure myChannels is defined earlier so we can use it.
    # Currently it's inline in the JSX: {(() => { const myChannels = ... })()}
    # Let's extract it.
    
    # 1. Extract myChannels calculation to the top of the component render body
    extract_my_channels = """  const [activeRoomId, setActiveRoomId] = useState('general-channel');
  const [inputText, setInputText] = useState('');
  
  const currentUserIdStr = String(db?.employees?.find(e => e.email === currentUser?.email)?.id || currentUser?.id);
  const myChannels = chatChannels.filter(c => c.members && c.members.includes(currentUserIdStr));
"""
    content = content.replace("  const [activeRoomId, setActiveRoomId] = useState('general-channel');\n  const [inputText, setInputText] = useState('');", extract_my_channels)

    # 2. Update activeRoom calculation to fall back to myChannels[0] if activeRoomId isn't in myChannels
    content = content.replace(
        "const activeRoom = chatChannels.find(c => c.id === activeRoomId) || rooms[activeRoomId] ||",
        "const activeRoom = myChannels.find(c => c.id === activeRoomId) || rooms[activeRoomId] ||"
    )

    # 3. Replace the inline IIFE with myChannels
    content = re.sub(
        r"\{\(\(\) => \{ const myChannels = chatChannels\.filter\(c => c\.members &&\s*c\.members\.includes\(String\(db\?\.employees\?\.find\(e => e\.email === currentUser\?\.email\)\?\.id \|\| currentUser\?\.id\)\)\)\); return myChannels; \}\)\(\)",
        "{myChannels",
        content,
        flags=re.MULTILINE
    )
    
    # 4. Same for the original inline IIFE (in case fix_employee_id.py didn't match perfectly)
    content = re.sub(
        r"\{\(\(\) => \{ const myChannels = chatChannels\.filter\(c => c\.members &&\s*c\.members\.includes\(String\(currentUser\?\.id\)\)\); return myChannels; \}\)\(\)",
        "{myChannels",
        content,
        flags=re.MULTILINE
    )

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Fixed activeRoom in Messaging.jsx")
