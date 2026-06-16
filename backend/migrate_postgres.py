from sqlalchemy import create_engine, text

database_url = "postgresql+psycopg2://postgres.orameusjachckqygskce:Hemanth%402820@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"
engine = create_engine(database_url)

with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE tasks ADD COLUMN milestone_id INTEGER;"))
        conn.commit()
        print("SUCCESS: Added milestone_id column to tasks table in PostgreSQL!")
    except Exception as e:
        print("ERROR/ALREADY EXISTS:", e)
