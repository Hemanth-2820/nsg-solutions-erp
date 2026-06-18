import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "sql_app.db")

def migrate():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    try:
        cursor.execute("ALTER TABLE projects ADD COLUMN department VARCHAR")
        print("Column 'department' added to 'projects' table successfully.")
    except sqlite3.OperationalError as e:
        print(f"Error (may already exist): {e}")
    conn.commit()
    conn.close()

if __name__ == "__main__":
    migrate()
