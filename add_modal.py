import os

modal_code = """
      {/* ── View Members Modal ──────────────────────────────────────────────── */}
      {showMembersModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }}>
          <div style={{ width: "400px", maxHeight: "70vh", backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderLeft: "4px solid var(--accent-pink)", padding: "24px", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
              <h3 style={{ margin: 0, color: "var(--accent-pink)" }}>Channel Members</h3>
              <button type="button" style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }} onClick={() => setShowMembersModal(false)}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
              {(() => {
                const membersList = chatChannels.find(c => c.id === activeRoomId)?.members || [];
                const memberDetails = [];
                if (membersList.includes("ceo")) memberDetails.push("John Doe (CEO)");
                if (membersList.includes("hr")) memberDetails.push("Sarah Jenkins (HR)");
                membersList.forEach(mId => {
                  if (mId !== "ceo" && mId !== "hr") {
                    const emp = db.employees?.find(e => String(e.id) === String(mId));
                    if (emp) memberDetails.push(`${emp.name} (${emp.designation})`);
                  }
                });
                if (memberDetails.length === 0) return <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>No members added yet.</div>;
                return memberDetails.map((name, i) => (
                  <div key={i} style={{ padding: "8px 12px", backgroundColor: "var(--bg-primary)", borderRadius: "8px", fontSize: "13px", color: "var(--text-primary)" }}>{name}</div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}
"""

def add_modal(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    if "View Members Modal" in content:
        print("Already in " + filepath)
        return
        
    # Find the last "  );\n}"
    if "  );\n}" in content:
        # replace the LAST occurrence
        parts = content.rsplit("  );\n}", 1)
        if len(parts) == 2:
            new_content = parts[0] + modal_code + "\n  );\n}" + parts[1]
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)
            print("Fixed " + filepath)

add_modal("src/components/employee/Messaging.jsx")
add_modal("src/components/ceo/pages/Messaging.jsx")
add_modal("src/components/tl/Messaging & Meet/messages.module.index.jsx")
