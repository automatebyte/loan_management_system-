import secrets
import string
from django.contrib.auth import get_user_model

User = get_user_model()

def generate_secure_password(length=12):
    """Generate a secure password with mixed case, numbers, and symbols"""
    # Ensure at least one of each type
    lowercase = string.ascii_lowercase
    uppercase = string.ascii_uppercase
    digits = string.digits
    symbols = "!@#$%&*"
    
    # Start with one of each required type
    password = [
        secrets.choice(uppercase),
        secrets.choice(lowercase), 
        secrets.choice(digits),
        secrets.choice(symbols)
    ]
    
    # Fill the rest randomly
    all_chars = lowercase + uppercase + digits + symbols
    for _ in range(length - 4):
        password.append(secrets.choice(all_chars))
    
    # Shuffle the password
    secrets.SystemRandom().shuffle(password)
    return ''.join(password)

def generate_username(email, company_id):
    """Generate username from email or company info"""
    # Try email prefix first
    if '@' in email:
        username = email.split('@')[0]
    else:
        username = f'company_{company_id}_admin'
    
    # Ensure uniqueness
    base_username = username
    counter = 1
    while User.objects.filter(username=username).exists():
        username = f'{base_username}_{counter}'
        counter += 1
    
    return username

def create_company_admin(company):
    """Create company admin user with secure credentials"""
    username = generate_username(company.admin_email, company.id)
    password = generate_secure_password()
    
    admin_user = User.objects.create_user(
        username=username,
        email=company.admin_email,
        first_name=company.admin_name.split()[0] if company.admin_name else 'Admin',
        last_name=' '.join(company.admin_name.split()[1:]) if len(company.admin_name.split()) > 1 else '',
        role='company_admin',
        company=company,
        is_active=True
    )
    admin_user.set_password(password)
    admin_user.save()
    
    return admin_user, password