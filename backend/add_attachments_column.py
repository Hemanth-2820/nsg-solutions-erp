from app.database import engine
from sqlalchemy import text

def main():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE projects ADD COLUMN attachments TEXT;"))
            conn.commit()
            print("Successfully added attachments column to projects table.")
        except Exception as e:
            if "already exists" in str(e).lower() or "duplicate column" in str(e).lower():
                print("Column already exists.")
            else:
                print(f"Error: {e}")

if __name__ == "__main__":
    main()
