# Company Registration Credential Debug & Solution

## 🚨 CRITICAL ISSUES IDENTIFIED

### 1. **EMAIL SERVICE NOT CONFIGURED**
- Production environment missing email credentials
- Emails are failing silently
- Companies approved but no notification sent

### 2. **CELERY NOT RUNNING**
- Email tasks queued but not processed
- No background task processing in production

### 3. **NO CREDENTIAL VISIBILITY**
- Credentials generated but not displayed to Super Admin
- No way to retrieve credentials after approval

## 🔧 IMMEDIATE SOLUTIONS

### **SOLUTION 1: Check Current Database State**

Run this command to see what's actually in your database:

```bash
# In your deployed backend
python manage.py debug_registration
```

This will show:
- All companies in database
- Which companies have admin users
- Which companies are missing credentials
- Email configuration status

### **SOLUTION 2: Fix Missing Credentials**

```bash
# Fix all approved companies missing admin users
python manage.py fix_credentials

# Dry run to see what would be fixed
python manage.py fix_credentials --dry-run
```

### **SOLUTION 3: Configure Email Service**

Add these environment variables to your Render deployment:

```env
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@kreditai.com
```

### **SOLUTION 4: Manual Credential Retrieval**

For any approved company, you can get credentials via API:

```bash
# Get credentials for company ID 1
curl -H "Authorization: Bearer YOUR_SUPER_ADMIN_TOKEN" \
     https://your-backend.onrender.com/api/companies/1/credentials/
```

## 🔍 DEBUGGING STEPS

### **Step 1: Check Database**
```python
# Run in Django shell
from apps.companies.models import Company
from apps.accounts.models import User

# Check companies
companies = Company.objects.all()
for c in companies:
    print(f"{c.name}: {c.subscription_status}")
    admin = User.objects.filter(company=c, role='company_admin').first()
    print(f"  Admin: {admin.username if admin else 'MISSING'}")
```

### **Step 2: Test Approval Flow**
```python
# Test the approval process
company = Company.objects.filter(subscription_status='pending_approval').first()
if company:
    from apps.common.utils import create_company_admin
    admin_user, password = create_company_admin(company)
    print(f"Created: {admin_user.username} / {password}")
```

### **Step 3: Check Email Configuration**
```python
from django.core.mail import send_mail
from django.conf import settings

print(f"Email Host: {settings.EMAIL_HOST}")
print(f"Email User: {settings.EMAIL_HOST_USER}")

# Test email sending
try:
    send_mail(
        'Test Email',
        'This is a test',
        settings.DEFAULT_FROM_EMAIL,
        ['test@example.com'],
        fail_silently=False
    )
    print("Email sent successfully")
except Exception as e:
    print(f"Email failed: {e}")
```

## 📋 CURRENT CREDENTIAL LOCATIONS

### **For Approved Companies:**
1. **Database**: `accounts_customuser` table
2. **API Endpoint**: `/api/companies/{id}/credentials/`
3. **Super Admin Dashboard**: "View Credentials" button
4. **Management Command**: `python manage.py fix_credentials`

### **Login Process:**
1. **URL**: https://kreditai.onrender.com/login
2. **Username**: Company admin email
3. **Password**: Generated 12-character secure password
4. **Role**: Automatically routed to Company Admin Dashboard

## 🚀 IMMEDIATE ACTION PLAN

### **RIGHT NOW - Get Your Credentials:**

1. **SSH into your Render deployment**
2. **Run the debug command:**
   ```bash
   python manage.py debug_registration
   ```
3. **Fix missing credentials:**
   ```bash
   python manage.py fix_credentials
   ```
4. **Check the output for usernames and passwords**

### **For Future Registrations:**

1. **Configure email service** (add environment variables)
2. **Set up Celery worker** for background tasks
3. **Monitor the credentials modal** in Super Admin dashboard

## 📧 EMAIL CONFIGURATION

### **Gmail Setup:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-gmail@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@kreditai.com
```

### **SendGrid Setup:**
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=your-sendgrid-api-key
DEFAULT_FROM_EMAIL=noreply@kreditai.com
```

## 🔐 CREDENTIAL MANAGEMENT

### **View Credentials:**
- Super Admin Dashboard → Company Management → "View Credentials" button
- API: `GET /api/companies/{id}/credentials/`

### **Reset Password:**
- API: `POST /api/companies/{id}/reset_password/`
- Returns new password and sends email

### **Manual User Creation:**
```python
from apps.common.utils import create_company_admin
from apps.companies.models import Company

company = Company.objects.get(id=YOUR_COMPANY_ID)
admin_user, password = create_company_admin(company)
print(f"Username: {admin_user.username}")
print(f"Password: {password}")
print(f"Email: {admin_user.email}")
```

## ✅ VERIFICATION CHECKLIST

- [ ] Database contains companies
- [ ] Approved companies have admin users
- [ ] Email service is configured
- [ ] Credentials are accessible via dashboard
- [ ] Login process works end-to-end
- [ ] Welcome emails are being sent

## 🆘 EMERGENCY ACCESS

If you need immediate access to approved company credentials:

1. **Use the management commands** (fastest)
2. **Check the API endpoints** directly
3. **Query the database** manually
4. **Use the Super Admin dashboard** credentials modal

The credentials ARE being generated - they're just not visible due to email/display issues.