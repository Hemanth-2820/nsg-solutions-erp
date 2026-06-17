import os, re

f = r'c:\Users\DELL\Desktop\NSG-ERP\backend\app\routers\employee_portal.py'
with open(f, 'r', encoding='utf-8') as file:
    content = file.read()

# Find all route definitions
lines = content.split('\n')
for i, line in enumerate(lines):
    if '@router.' in line or 'async def ' in line:
        print(f'{i+1}: {line.strip()}')
