# KreditAI Complete User Workflows

## **BUSINESS PROCESS OVERVIEW**

### **1. COMPANY ONBOARDING WORKFLOW**

```
Step 1: Public Registration
├── URL: /register
├── Form: 3-step wizard (Company → Admin → Subscription)
├── Status: pending_approval
└── Notification: Super admin notified

Step 2: Super Admin Approval
├── Dashboard: /super-admin
├── Action: Review & approve company
├── Result: Company admin account created
└── Email: Welcome email with credentials

Step 3: Company Admin Setup
├── Login: same URL for all users
├── Credentials: email + KreditAI{ID}!
├── Dashboard: /company-admin
└── Actions: Add loan officers, configure system

Step 4: Loan Officer Management
├── Interface: Company admin dashboard
├── Process: Create officer accounts
├── Credentials: Email sent automatically
└── Access: Officers can login immediately
```

### **2. USER AUTHENTICATION MATRIX**

| User Type | Login URL | Username | Password | Dashboard |
|-----------|-----------|----------|----------|-----------|
| Super Admin | /login | DonMeli | Don#Meli10. | /super-admin |
| Company Admin | /login | their-email@company.com | KreditAI{ID}! | /company-admin |
| Loan Officer | /login | officer@email.com | defaultpass123 | /loan-officer |
| Client | /login | client@email.com | generated | /client-portal |

### **3. ROLE-BASED PERMISSIONS**

**Super Admin:**
- [ALLOWED] Company management (approve/reject/suspend)
- [ALLOWED] Subscription management
- [ALLOWED] System-wide analytics
- [RESTRICTED] NO access to loan data (by design)

**Company Admin:**
- [ALLOWED] Loan officer management
- [ALLOWED] Company settings
- [ALLOWED] Company-wide reports
- [RESTRICTED] NO direct loan access

**Loan Officer:**
- [ALLOWED] Client management
- [ALLOWED] Loan processing
- [ALLOWED] Payment recording
- [RESTRICTED] Only their assigned clients

### **4. EMAIL NOTIFICATIONS**

**Company Approval:**
```
To: company-admin@email.com
Subject: Welcome to KreditAI - Your Account is Ready!
Content: Login credentials + setup instructions
```

**Loan Officer Creation:**
```
To: officer@email.com  
Subject: Your KreditAI Account - {Company Name}
Content: Login credentials + role information
```

### **5. COMPLETE BUSINESS LOGIC FLOW**

```
Registration -> Approval -> Account Creation -> Email -> Login -> Setup -> Operation
     [DONE]      [DONE]     [DONE]            [DONE]   [DONE]   [DONE]    [DONE]

Company Registration:
├── Public form submission
├── Data validation & storage
├── Super admin notification
└── Status: pending_approval

Super Admin Approval:
├── Review company details
├── Approve/reject decision
├── Auto-create company admin user
├── Send welcome email with credentials
└── Status: trial (14 days)

Company Admin Login:
├── Receive email with credentials
├── Login at main URL
├── Auto-routed to company dashboard
└── Begin loan officer setup

Loan Officer Management:
├── Company admin creates officers
├── System generates accounts
├── Email sent with credentials
├── Officers can login immediately
└── Begin client/loan management
```

### **6. TROUBLESHOOTING GUIDE**

**Company Admin Can't Login:**
1. Check email for credentials
2. Verify password format: KreditAI{ID}!
3. Ensure company was approved
4. Contact super admin if needed

**Loan Officer Can't Login:**
1. Check email for credentials
2. Verify company admin created account
3. Check account is active
4. Contact company admin

**Missing Emails:**
1. Check spam/junk folders
2. Verify email service is configured
3. Check Celery worker is running
4. Manual credential sharing as backup

### **7. SYSTEM REQUIREMENTS**

**For Full Functionality:**
- [COMPLETE] Django backend with user management
- [COMPLETE] React frontend with role-based routing
- [COMPLETE] Email service (SMTP configured)
- [COMPLETE] Celery for background tasks
- [COMPLETE] JWT authentication
- [COMPLETE] Multi-tenant database design

**Current Status:**
- [COMPLETE] All core workflows implemented
- [COMPLETE] Email templates created
- [COMPLETE] Role-based dashboards working
- [WARNING] Email service needs verification
- [WARNING] Password reset flow missing