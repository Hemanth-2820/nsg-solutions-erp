import sqlite3
import os

db_files = ["sql_app.db", "nsg_erp.db", "nsgerp.db"]

for db_file in db_files:
    if os.path.exists(db_file):
        try:
            conn = sqlite3.connect(db_file)
            cursor = conn.cursor()
            # Check if column already exists
            cursor.execute("PRAGMA table_info(tasks);")
            columns = [col[1] for col in cursor.fetchall()]
            if "milestone_id" not in columns:
                cursor.execute("ALTER TABLE tasks ADD COLUMN milestone_id INTEGER;")
                conn.commit()
                print(f"SUCCESS: Added milestone_id column to tasks in {db_file}")
            else:
                print(f"INFO: Column milestone_id already exists in {db_file}")
            conn.close()
        except Exception as e:
            print(f"ERROR altering {db_file}: {e}")
    else:
        print(f"INFO: Database file {db_file} not found, skipping.")
