import sys
sys.path.append(r'c:\Users\DELL\Desktop\NSG-ERP\backend')
from app.database import SessionLocal
from sqlalchemy import text

db = SessionLocal()
res = db.execute(text('SELECT MAX(id) FROM chat_messages'))
max_id = res.scalar() or 0
print(f'Max ID in chat_messages: {max_id}')
db.execute(text(f"SELECT setval('chat_messages_id_seq', {max_id})"))
db.commit()
print('Sequence updated successfully!')
