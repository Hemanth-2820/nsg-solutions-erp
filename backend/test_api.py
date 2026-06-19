import requests
import json
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

db_url = os.getenv('DATABASE_URL')
if not db_url:
    db_url = 'postgresql+psycopg2://postgres.orameusjachckqygskce:Hemanth%402820@aws-1-ap-south-1.pooler.supabase.com:6543/postgres'
engine = create_engine(db_url)
Session = sessionmaker(bind=engine)

from app import security
token = security.create_access_token({"sub": "1"})
print("Token:", token)
headers = {"Authorization": f"Bearer {token}"}
res = requests.post("http://localhost:8000/api/hr-portal/exits/resignations/12/approve", headers=headers)
print("Response:", res.status_code, res.text)
print("Token:", token)
headers = {"Authorization": f"Bearer {token}"}
res = requests.post("http://localhost:8000/api/hr-portal/exits/resignations/12/approve", headers=headers)
print("Response:", res.status_code, res.text)
