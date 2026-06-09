import os

app_path = "src/App.jsx"
with open(app_path, "r", encoding="utf-8") as f:
    app_content = f.read()

storage_effect = """  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "nsg_hr_db" && e.newValue) {
        setDb(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);
"""
if "window.addEventListener(\"storage\"" not in app_content and "window.addEventListener('storage'" not in app_content:
    app_content = app_content.replace("const [db, setDb] = useState(() => loadDbSync());", "const [db, setDb] = useState(() => loadDbSync());\n" + storage_effect)
    with open(app_path, "w", encoding="utf-8") as f:
        f.write(app_content)
    print("Updated App.jsx")

for path in ["src/components/employee/Messaging.jsx", "src/components/ceo/pages/Messaging.jsx", "src/components/tl/Messaging & Meet/messages.module.index.jsx"]:
    if not os.path.exists(path): continue
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    sync_effect = """  useEffect(() => {
    if (db?.chatChannels) {
      setDbChannels(db.chatChannels);
    }
  }, [db?.chatChannels]);
"""
    if "setDbChannels(db.chatChannels)" not in content:
        content = content.replace("const [dbChannels, setDbChannels] = useState([]);", "const [dbChannels, setDbChannels] = useState([]);\n" + sync_effect)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated " + path)
