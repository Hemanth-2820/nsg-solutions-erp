import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

db_url = os.environ.get("DATABASE_URL")
if not db_url:
    print("DATABASE_URL not found")
    exit(1)

# connect
try:
    conn = psycopg2.connect(db_url)
    conn.autocommit = True
    cursor = conn.cursor()

    try:
        cursor.execute("ALTER TABLE attendance ADD COLUMN late_alert_dismissed BOOLEAN DEFAULT FALSE;")
        print("Added late_alert_dismissed column.")
    except psycopg2.errors.DuplicateColumn:
        print("Column late_alert_dismissed already exists.")

    try:
        cursor.execute("ALTER TABLE attendance ADD COLUMN missed_punch_alert_dismissed BOOLEAN DEFAULT FALSE;")
        print("Added missed_punch_alert_dismissed column.")
    except psycopg2.errors.DuplicateColumn:
        print("Column missed_punch_alert_dismissed already exists.")

    cursor.close()
    conn.close()
    print("Migration successful.")
except Exception as e:
    print(f"Error: {e}")
