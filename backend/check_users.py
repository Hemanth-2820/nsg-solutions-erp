import sys
sys.path.insert(0, 'app')
from app import database, models

db = database.SessionLocal()
users = db.query(models.User).all()
for u in users:
    print(f"ID={u.id}, Name={u.name}, Email={u.email}, Role={u.role}")
print("---")
channels = db.query(models.ChatChannel).all()
for c in channels:
    print(f"Channel ID={c.id}, Name={c.name}, Members={c.members}")
db.close()
