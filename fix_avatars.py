import re

def fix_avatars(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    avatar_map = {
        'contact.avatar': 'contact.name',
        'selectedContact?.avatar': 'selectedContact?.name',
        'msg.avatar': 'msg.sender',
        'member.avatar': 'member.name',
        'spotlight.avatar': 'spotlight.name',
        'p.avatar': 'p.name',
        'user.avatar': 'user.name',
        'dmEmployee?.avatar': 'dmEmployee?.name',
        'emp.avatar': 'emp.name'
    }

    for avatar_var, name_var in avatar_map.items():
        pattern = r'<img\s+src=\{(' + re.escape(avatar_var) + r')\}'
        replacement = r'<img src={getAvatarUrl(\1, ' + name_var + r')} onError={(e) => { e.target.onerror = null; e.target.src = getAvatarUrl(null, ' + name_var + r'); }}'
        content = re.sub(pattern, replacement, content)
        
        # Multiline src
        pattern_ml = r'<img\s*\n\s*src=\{(' + re.escape(avatar_var) + r')\}'
        replacement_ml = r'<img \n                      src={getAvatarUrl(\1, ' + name_var + r')} \n                      onError={(e) => { e.target.onerror = null; e.target.src = getAvatarUrl(null, ' + name_var + r'); }}'
        content = re.sub(pattern_ml, replacement_ml, content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_avatars('src/components/employee/Messaging.jsx')
fix_avatars('src/components/tl/Messaging & Meet/messages.module.index.jsx')
