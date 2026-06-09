"""
Seed channel members in the backend SQLite DB.
Maps the frontend employee names to backend User IDs and saves them to the ChatChannel table.

Backend User IDs:
ID=1 CEO (John Doe)
ID=2 HR (Sophia Reed)
ID=3 TL (Marcus Vance)
ID=4 Jane Smith (employee)
ID=5 Amit Sharma (employee)
ID=6 Priya Patel (employee)
ID=7 Rahul Roy (employee)
ID=9 Hemanth (employee)
"""
import sys, json
sys.path.insert(0, 'app')
from app import database, models

db = database.SessionLocal()

# All employee IDs (not HR/CEO) for general channel
all_employee_ids = ["1", "2", "3", "4", "5", "6", "7", "9"]  # all users

channel_members = {
    "general-channel": all_employee_ids,  # everyone is in general
    "team-room": ["2", "3", "4", "5", "6", "7", "9"],  # employees + HR + TL
    "grievance-room": ["2", "4"],  # HR + Jane Smith
    "ceo-channel": ["1", "2"],  # CEO + HR
    "tl-channel": ["2", "3", "4", "5", "6", "7", "9"],  # TL + employees + HR
}

channels = db.query(models.ChatChannel).all()
for ch in channels:
    if ch.id in channel_members:
        ch.members = json.dumps(channel_members[ch.id])
        print(f"Updated {ch.id} with members {channel_members[ch.id]}")
    else:
        print(f"Skipping channel {ch.id}")

db.commit()
print("Done! Re-reading channels:")

channels = db.query(models.ChatChannel).all()
for c in channels:
    print(f"  {c.id}: {c.members}")

db.close()
