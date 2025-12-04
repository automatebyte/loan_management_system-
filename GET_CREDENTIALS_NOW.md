# GET YOUR COMPANY CREDENTIALS RIGHT NOW

## IMMEDIATE ACCESS TO APPROVED COMPANY CREDENTIALS

### **METHOD 1: Super Admin Dashboard (RECOMMENDED)**
1. **Login to Super Admin Dashboard**: https://kreditai.onrender.com/login
2. **Go to Company Management section**
3. **Find your approved companies**
4. **Click "View Credentials" button** for each company
5. **Credentials will display immediately** (auto-created if missing)

### **METHOD 2: API Direct Access**
```bash
# Replace YOUR_SUPER_ADMIN_TOKEN with your actual token
# Replace COMPANY_ID with the actual company ID

curl -H "Authorization: Bearer YOUR_SUPER_ADMIN_TOKEN" \
     https://kreditai1.onrender.com/api/companies/COMPANY_ID/credentials/
```

### **METHOD 3: Reset Password (Generates New Credentials)**
1. **In Super Admin Dashboard**
2. **Click "Reset Password" for any company**
3. **New credentials generated and displayed**
4. **Email sent (if configured) + shown in response**

## COMPLETE WORKFLOW (NOW WORKING)

### **For New Companies:**
```
1. Company visits: https://kreditai.onrender.com/register
2. Fills registration form
3. Submits → Status: "pending_approval"
4. You (Super Admin) see in "Pending Approvals" section
5. Click "Approve" → Credentials displayed for 10 seconds
6. Credentials also logged to browser console
7. Company can login immediately with displayed credentials
```

### **For Existing Approved Companies:**
```
1. Login to Super Admin Dashboard
2. Go to Company Management
3. Click "View Credentials" for each company
4. System auto-creates admin user if missing
5. Credentials displayed immediately
6. Send credentials to company manually or via email
```

## LOGIN PROCESS FOR COMPANIES

**Login URL**: https://kreditai.onrender.com/login
**Username**: Company admin email address
**Password**: Generated 12-character secure password
**Result**: Automatic redirect to Company Admin Dashboard

## EMAIL CONFIGURATION (OPTIONAL)

The system works WITHOUT email - credentials are always displayed in dashboard.

**To enable automatic emails, add to Render environment:**
```env
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@kreditai.com
```

## VERIFICATION STEPS

1. **Test the approval flow** with a new registration
2. **Check existing companies** via "View Credentials"
3. **Test login** with generated credentials
4. **Verify company dashboard** loads correctly

## EMERGENCY CREDENTIAL RETRIEVAL

If dashboard doesn't work, use the management commands:

```bash
# In your deployed backend
python manage.py debug_registration
python manage.py fix_credentials
```

**Your business is no longer blocked - companies can login now!**