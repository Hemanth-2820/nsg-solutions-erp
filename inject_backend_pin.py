import os

files = [
    r'c:\Users\DELL\Desktop\NSG-ERP\backend\app\routers\ceo_portal.py',
    r'c:\Users\DELL\Desktop\NSG-ERP\backend\app\routers\hr_portal.py',
    r'c:\Users\DELL\Desktop\NSG-ERP\backend\app\routers\team_lead.py'
]

pin_message_block = '''
                if msg_type == "pin_message":
                    msg_id = msg_data.get("msg_id")
                    is_pinned = msg_data.get("is_pinned", True)
                    db_session = database.SessionLocal()
                    try:
                        try:
                            msg_id_int = int(float(msg_id))
                        except (ValueError, TypeError):
                            msg_id_int = msg_id

                        db_msg = db_session.query(models.ChatMessage).filter(models.ChatMessage.id == msg_id_int).first()
                        if db_msg:
                            db_msg.is_pinned = is_pinned
                            db_session.commit()
                            await manager.broadcast_message({
                                "event_type": "message_pinned",
                                "msg_id": msg_id,
                                "is_pinned": is_pinned,
                                "channel_id": db_msg.channel_id
                            })
                    finally:
                        db_session.close()
                    continue
'''

for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            
        if 'pin_message' not in content:
            typing_block = '                    continue\n'
            
            # Find typing block
            idx = content.find('if msg_type in ["typing_start", "typing_stop"]')
            if idx != -1:
                end_idx = content.find('continue', idx) + 8
                content = content[:end_idx] + '\n' + pin_message_block + content[end_idx:]
                
                with open(f, 'w', encoding='utf-8') as fw:
                    fw.write(content)
                print(f'Successfully added pin_message to {os.path.basename(f)}')
            else:
                print(f'Could not find typing_start in {os.path.basename(f)}')
        else:
            print(f'pin_message already in {os.path.basename(f)}')
            
    except Exception as e:
        print(f'Error reading {f}: {e}')
