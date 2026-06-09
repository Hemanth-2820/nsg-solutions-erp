import os

modal_marker = "{/* ── View Members Modal"

def fix(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    if modal_marker in content:
        # We need to remove the injected modal
        start_idx = content.rfind(modal_marker)
        # Find the end of the modal which is "      )}\n"
        end_idx = content.find("      )}\n", start_idx) + len("      )}\n")
        
        # Remove it
        cleaned_content = content[:start_idx].rstrip() + "\n" + content[end_idx:].lstrip()
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(cleaned_content)
        print("Cleaned " + filepath)

fix("src/components/employee/Messaging.jsx")
fix("src/components/ceo/pages/Messaging.jsx")
fix("src/components/tl/Messaging & Meet/messages.module.index.jsx")
