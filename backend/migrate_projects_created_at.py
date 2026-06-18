from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

def migrate():
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        # Add created_at column
        try:
            conn.execute(text(
                "ALTER TABLE projects ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();"
            ))
            conn.commit()
            print("Migration successful: added created_at column to projects.")
        except Exception as e:
            if "duplicate column" in str(e).lower() or "already exists" in str(e).lower():
                print("Column created_at already exists — skipping.")
            else:
                # PostgreSQL might not support the shorthand; try without timezone
                try:
                    conn.rollback()
                    conn.execute(text(
                        "ALTER TABLE projects ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;"
                    ))
                    conn.commit()
                    print("Migration successful (fallback): added created_at column to projects.")
                except Exception as e2:
                    if "duplicate column" in str(e2).lower() or "already exists" in str(e2).lower():
                        print("Column created_at already exists — skipping.")
                    else:
                        print(f"Error: {e2}")

if __name__ == "__main__":
    migrate()
