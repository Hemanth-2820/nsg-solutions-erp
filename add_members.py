import os, re

def add_members_feature(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Add state variable
    if "const [showMembersModal, setShowMembersModal]" not in content:
        content = content.replace("const [activeRoomId, setActiveRoomId] = useState", "const [showMembersModal, setShowMembersModal] = useState(false);\n  const [activeRoomId, setActiveRoomId] = useState")

    # Add text to header
    header_old = """<div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {activeRoomId.startsWith('#') || activeRoomId === 'general-channel' ? 'Active discussion' : 'Direct Message'}
                </div>"""
                
    header_new = """<div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {activeRoomId.startsWith('#') || activeRoomId === 'general-channel' ? (
                    <>
                      <span>Active discussion</span>
                      <span>•</span>
                      <span 
                        onClick={() => setShowMembersModal(true)}
                        style={{ cursor: 'pointer', color: 'var(--accent-pink)', fontWeight: '600', textDecoration: 'underline' }}>
                        {chatChannels.find(c => c.id === activeRoomId)?.members?.length || 0} Members
                      </span>
                    </>
                  ) : 'Direct Message'}
                </div>"""
    
    if header_old in content:
        content = content.replace(header_old, header_new)
    
    # Add modal at the end before final div
    modal_code = """
      {/* ── View Members Modal ──────────────────────────────────────────────── */}
      {showMembersModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
          <div style={{ width: '400px', maxHeight: '70vh', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderLeft: '4px solid var(--accent-pink)', padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, color: 'var(--accent-pink)' }}>Channel Members</h3>
              <button type="button" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setShowMembersModal(false)}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(() => {
                const membersList = chatChannels.find(c => c.id === activeRoomId)?.members || [];
                const memberDetails = [];
                if (membersList.includes('ceo')) memberDetails.push('John Doe (CEO)');
                if (membersList.includes('hr')) memberDetails.push('Sarah Jenkins (HR)');
                membersList.forEach(mId => {
                  if (mId !== 'ceo' && mId !== 'hr') {
                    const emp = db.employees?.find(e => String(e.id) === String(mId));
                    if (emp) memberDetails.push(`${emp.name} (${emp.designation})`);
                  }
                });
                if (memberDetails.length === 0) return <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No members added yet.</div>;
                return memberDetails.map((name, i) => (
                  <div key={i} style={{ padding: '8px 12px', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', fontSize: '13px', color: 'var(--text-primary)' }}>{name}</div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}
    """
    
    if "View Members Modal" not in content:
        # Insert before the last </div>
        # Use regex to find the last </div></div> ending
        content = re.sub(r'(</div>\s*</div>\s*)$', modal_code + r'\1', content)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print("Fixed " + filepath)

add_members_feature("src/components/employee/Messaging.jsx")
