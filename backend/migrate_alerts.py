import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), "nsg_erp.db")

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    cursor.execute("ALTER TABLE attendance ADD COLUMN late_alert_dismissed BOOLEAN DEFAULT 0")
    print("Added late_alert_dismissed")
except sqlite3.OperationalError as e:
    print(f"Column might already exist: {e}")

try:
    cursor.execute("ALTER TABLE attendance ADD COLUMN missed_punch_alert_dismissed BOOLEAN DEFAULT 0")
    print("Added missed_punch_alert_dismissed")
except sqlite3.OperationalError as e:
    print(f"Column might already exist: {e}")

conn.commit()
conn.close()
print("Migration completed.")
