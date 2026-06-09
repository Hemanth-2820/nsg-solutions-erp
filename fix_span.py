import os, re

def add_members_feature(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # The header in Employee Messaging.jsx currently has:
    # <span style={{ fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
    #   {activeRoom.desc || 'Active discussion'}
    # </span>
    
    old_code = """<span style={{ fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {activeRoom.desc || 'Active discussion'}
                    </span>"""

    new_code = """<span style={{ fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {activeRoom.desc || 'Active discussion'}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>•</span>
                    <span 
                      onClick={() => setShowMembersModal(true)}
                      style={{ fontSize: '10px', color: 'var(--accent-pink)', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline' }}>
                      {(() => {
                        const members = chatChannels.find(c => c.id === activeRoomId)?.members;
                        if (!members) return "0 Members";
                        return members.length + " Members";
                      })()}
                    </span>"""

    if old_code in content:
        content = content.replace(old_code, new_code)
        
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print("Fixed " + filepath)

add_members_feature("src/components/employee/Messaging.jsx")
add_members_feature("src/components/ceo/pages/Messaging.jsx")
add_members_feature("src/components/tl/Messaging & Meet/messages.module.index.jsx")
