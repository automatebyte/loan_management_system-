# KreditAI Feature Testing Plan

**Version:** 1.0  
**Date:** $(date)  
**Purpose:** Comprehensive testing plan for role-based features

---

## Test Environment Setup

### Prerequisites
```bash
# 1. Database with test data
python manage.py migrate
python manage.py loaddata test_fixtures

# 2. Create test users
python manage.py shell
>>> from apps.accounts.models import User
>>> admin = User.objects.create_user(username='admin_test', role='admin', password='Test123!')
>>> field_officer = User.objects.create_user(username='fo_test', role='field_officer', password='Test123!')
>>> clerk = User.objects.create_user(username='clerk_test', role='clerk', password='Test123!')

# 3. Start servers
docker-compose up
# Backend: http://localhost:8000
# Frontend: http://localhost:3000
```

---

## Test Suite 1: ADMIN Role

### 1.1 User Management - Add Field Officer

**Test ID:** ADMIN-001  
**Priority:** HIGH  
**Status:** ☐ Not Tested | ☐ Pass | ☐ Fail

**Steps:**
1. Login as admin (username: admin_test, password: Test123!)
2. Navigate to Staff Management
3. Click "Add Field Officer"
4. Fill form:
   - First Name: John
   - Last Name: Doe
   - Email: john.doe@test.com
   - Phone: +1234567890
5. Submit form

**Expected Result:**
- ✅ Field officer created successfully
- ✅ Credentials displayed (username: john_doe, password: auto-generated)
- ✅ Field officer appears in staff list
- ✅ Field officer can login with provided credentials

**Actual Result:** _________________

**Notes:** _________________

---

### 1.2 User Management - Add Clerk

**Test ID:** ADMIN-002  
**Priority:** CRITICAL  
**Status:** ☐ Not Tested | ☐ Pass | ☐ Fail

**Steps:**
1. Login as admin
2. Navigate to Staff Management
3. Click "Add Clerk"
4. Fill form:
   - First Name: Jane
   - Last Name: Smith
   - Email: jane.smith@test.com
   - Phone: +1234567891
5. Submit form

**Expected Result:**
- ✅ Clerk created successfully
- ✅ Credentials displayed
- ✅ Clerk appears in staff list
- ✅ Clerk can login

**Actual Result:** _________________

---

### 1.3 User Management - Remove Staff

**Test ID:** ADMIN-003  
**Priority:** HIGH  
**Status:** ☐ Not Tested | ☐ Pass | ☐ Fail

**Steps:**
1. Login as admin
2. Navigate to Staff Management
3. Find field officer "John Doe"
4. Click "Deactivate" or "Remove"
5. Confirm action

**Expected Result:**
- ✅ Staff member deactivated
- ✅ Staff member cannot login
- ✅ Staff member marked as inactive in list
- ✅ Confirmation message displayed

**Actual Result:** _________________

---

### 1.4 Target Management - Set Target

**Test ID:** ADMIN-004  
**Priority:** HIGH  
**Status:** ☐ Not Tested | ☐ Pass | ☐ Fail

**Steps:**
1. Login as admin
2. Navigate to Target Management
3. Click "Set New Target"
4. Fill form:
   - Field Officer: John Doe
   - Target Type: Loan Count
   - Target Value: 20
   - Period: Current Month
5. Submit

**Expected Result:**
- ✅ Target created successfully
- ✅ Target appears in target list
- ✅ Field officer can see target in their dashboard
- ✅ Progress shows 0/20 (0%)

**Actual Result:** _________________

---

### 1.5 Target Management - Modify Target

**Test ID:** ADMIN-005  
**Priority:** MEDIUM  
**Status:** ☐ Not Tested | ☐ Pass | ☐ Fail

**Steps:**
1. Login as admin
2. Navigate to Target Management
3. Find existing target for John Doe
4. Click "Edit"
5. Change target value from 20 to 25
6. Save

**Expected Result:**
- ✅ Target updated successfully
- ✅ New value reflected in list
- ✅ Field officer sees updated target

**Actual Result:** _________________

---

### 1.6 Performance Monitoring - View Field Officer Performance

**Test ID:** ADMIN-006  
**Priority:** HIGH  
**Status:** ☐ Not Tested | ☐ Pass | ☐ Fail

**Steps:**
1. Login as admin
2. Navigate to Performance Dashboard
3. Select Field Officer: John Doe
4. View performance metrics

**Expected Result:**
- ✅ Displays loans processed count
- ✅ Displays conversion rate
- ✅ Displays client acquisition count
- ✅ Displays target achievement percentage
- ✅ Shows comparison with other field officers

**Actual Result:** _________________

---

### 1.7 Performance Monitoring - View Clerk Performance

**Test ID:** ADMIN-007  
**Priority:** HIGH  
**Status:** ☐ Not Tested | ☐ Pass | ☐ Fail

**Steps:**
1. Login as admin
2. Navigate to Performance Dashboard
3. Select Clerk: Jane Smith
4. View performance metrics

**Expected Result:**
- ✅ Displays daily collections count
- ✅ Displays payment processing efficiency
- ✅ Displays expenses recorded
- ✅ Shows comparison with other clerks

**Actual Result:** _________________

---

### 1.8 Reporting - Generate Company Report

**Test ID:** ADMIN-008  
**Priority:** MEDIUM  
**Status:** ☐ Not Tested | ☐ Pass | ☐ Fail

**Steps:**
1. Login as admin
2. Navigate to Reports
3. Select "Company-wide Financial Report"
4. Choose date range: Last 30 days
5. Click "Generate"

**Expected Result:**
- ✅ Report generated successfully
- ✅ Shows total loans disbursed
- ✅ Shows total collections
- ✅ Shows outstanding balance
- ✅ Shows staff performance summary

**Actual Result:** _________________

---

### 1.9 Reporting - Export Report

**Test ID:** ADMIN-009  
**Priority:** MEDIUM  
**Status:** ☐ Not Tested | ☐ Pass | ☐ Fail

**Steps:**
1. Login as admin
2. Generate any report
3. Click "Export as PDF"
4. Click "Export as Excel"
5. Click "Export as CSV"

**Expected Result:**
- ✅ PDF downloads successfully
- ✅ Excel file downloads successfully
- ✅ CSV file downloads successfully
- ✅ All formats contain correct data

**Actual Result:** _________________

---

## Test Suite 2: FIELD OFFICER Role

### 2.1 Client Management - Add Client

**Test ID:** FO-001  
**Priority:** CRITICAL  
**Status:** ☐ Not Tested | ☐ Pass | ☐ Fail

**Steps:**
1. Login as field officer (username: fo_test)
2. Navigate to Clients
3. Click "Add New Client"
4. Fill complete form:
   - Username: client_test_001
   - Email: client001@test.com
   - First Name: Michael
   - Last Name: Johnson
   - Date of Birth: 1990-01-15
   - National ID: ID123456789
   - Address: 123 Test Street, Test City
   - Monthly Income: 5000.00
   - Employment Status: Employed
   - Upload ID Picture: test_id.jpg
5. Submit

**Expected Result:**
- ✅ Client created successfully
- ✅ Client appears in "My Clients" list
- ✅ Client assigned to logged-in field officer
- ✅ Client can login with provided credentials
- ✅ All form fields saved correctly

**Actual Result:** _________________

---

### 2.2 Client Management - Update Client

**Test ID:** FO-002  
**Priority:** MEDIUM  
**Status:** ☐ Not Tested | ☐ Pass | ☐ Fail

**Steps:**
1. Login as field officer
2. Navigate to "My Clients"
3. Find client "Michael Johnson"
4. Click "Edit"
5. Update Monthly Income to 5500.00
6. Save

**Expected Result:**
- ✅ Client updated successfully
- ✅ New income reflected in client details
- ✅ Update timestamp recorded

**Actual Result:** _________________

---

### 2.3 Client Management - View Assigned Clients Only

**Test ID:** FO-003  
**Priority:** HIGH  
**Status:** ☐ Not Tested | ☐ Pass | ☐ Fail

**Steps:**
1. Login as field officer (fo_test)
2. Navigate to "My Clients"
3. Note the clients displayed
4. Login as different field officer
5. Navigate to "My Clients"

**Expected Result:**
- ✅ Each field officer sees only their assigned clients
- ✅ Cannot see other field officers' clients
- ✅ Client count matches assignments

**Actual Result:** _________________

---

### 2.4 Loan Management - View Active Loans

**Test ID:** FO-004  
**Priority:** HIGH  
**Status:** ☐ Not Tested | ☐ Pass | ☐ Fail

**Steps:**
1. Login as field officer
2. Navigate to Loans
3. Click "Active Loans" filter

**Expected Result:**
- ✅ Displays only active loans
- ✅ Shows loans with status: active, disbursed
- ✅ Displays loan details: amount, client, balance
- ✅ Can click to view full loan details

**Actual Result:** _________________

---

### 2.5 Loan Management - View Inactive Loans

**Test ID:** FO-005  
**Priority:** HIGH  
**Status:** ☐ Not Tested | ☐ Pass | ☐ Fail

**Steps:**
1. Login as field officer
2. Navigate to Loans
3. Click "Inactive Loans" filter

**Expected Result:**
- ✅ Displays only inactive loans
- ✅ Shows loans with status: completed, defaulted
- ✅ Displays loan details
- ✅ Can view payment history

**Actual Result:** _________________

---

### 2.6 Loan Management - View Loan Details

**Test ID:** FO-006  
**Priority:** MEDIUM  
**Status:** ☐ Not Tested | ☐ Pass | ☐ Fail

**Steps:**
1. Login as field officer
2. Navigate to Loans
3. Click on any loan
4. View loan details page

**Expected Result:**
- ✅ Displays complete loan information
- ✅ Shows payment history
- ✅ Shows outstanding balance
- ✅ Shows payment schedule
- ✅ Shows client information

**Actual Result:** _________________

---

### 2.7 Reporting - Generate Individual Report

**Test ID:** FO-007  
**Priority:** MEDIUM  
**Status:** ☐ Not Tested | ☐ Pass | ☐ Fail

**Steps:**
1. Login as field officer
2. Navigate to "My Reports"
3. Select "Performance Report"
4. Choose date range: Last 30 days
5. Generate

**Expected Result:**
- ✅ Report shows own performance only
- ✅ Displays client acquisition count
- ✅ Displays loans disbursed
- ✅ Displays target achievement
- ✅ Cannot see other field officers' data

**Actual Result:** _________________

---

### 2.8 Target Tracking - View Own Target

**Test ID:** FO-008  
**Priority:** MEDIUM  
**Status:** ☐ Not Tested | ☐ Pass | ☐ Fail

**Steps:**
1. Admin sets target for field officer (20 loans)
2. Login as field officer
3. View dashboard or targets section

**Expected Result:**
- ✅ Displays current target (20 loans)
- ✅ Shows achievement progress (e.g., 5/20 = 25%)
- ✅ Shows time remaining in period
- ✅ Updates in real-time as loans are added

**Actual Result:** _________________

---

## Test Suite 3: CLERK Role

### 3.1 Daily Dues - View Today's Dues

**Test ID:** CLERK-001  
**Priority:** CRITICAL  
**Status:** ☐ Not Tested | ☐ Pass | ☐ Fail

**Steps:**
1. Login as clerk (username: clerk_test)
2. Navigate to "Daily Dues"
3. View today's dues list

**Expected Result:**
- ✅ Displays all payments due today
- ✅ Shows client name, loan ID, amount due
- ✅ Shows payment status (pending/paid/overdue)
- ✅ Displays total amount due for the day
- ✅ Updates when payments are recorded

**Actual Result:** _________________

---

### 3.2 Daily Dues - Filter by Date

**Test ID:** CLERK-002  
**Priority:** HIGH  
**Status:** ☐ Not Tested | ☐ Pass | ☐ Fail

**Steps:**
1. Login as clerk
2. Navigate to "Daily Dues"
3. Select date: Tomorrow
4. View dues list
5. Select date: Yesterday
6. View dues list

**Expected Result:**
- ✅ Displays dues for selected date
- ✅ Date picker works correctly
- ✅ Can view past and future dues
- ✅ Total amount updates per date

**Actual Result:** _________________

---

### 3.3 Daily Dues - Generate Dues Report

**Test ID:** CLERK-003  
**Priority:** MEDIUM  
**Status:** ☐ Not Tested | ☐ Pass | ☐ Fail

**Steps:**
1. Login as clerk
2. Navigate to "Daily Dues"
3. Select date range: Last 7 days
4. Click "Generate Report"

**Expected Result:**
- ✅ Report generated successfully
- ✅ Shows dues for each day in range
- ✅ Shows collection summary
- ✅ Shows pending vs collected amounts

**Actual Result:** _________________

---

### 3.4 Expense Management - Record Expense

**Test ID:** CLERK-004  
**Priority:** CRITICAL  
**Status:** ☐ Not Tested | ☐ Pass | ☐ Fail

**Steps:**
1. Login as clerk
2. Navigate to "Expenses"
3. Click "Record New Expense"
4. Fill form:
   - Date: Today
   - Category: Office Supplies
   - Amount: 150.00
   - Description: Printer paper and pens
   - Upload Receipt: receipt.jpg
5. Submit

**Expected Result:**
- ✅ Expense recorded successfully
- ✅ Expense appears in expense history
- ✅ Receipt uploaded and viewable
- ✅ Recorded by clerk's name shown

**Actual Result:** _________________

---

### 3.5 Expense Management - View Expense History

**Test ID:** CLERK-005  
**Priority:** MEDIUM  
**Status:** ☐ Not Tested | ☐ Pass | ☐ Fail

**Steps:**
1. Login as clerk
2. Navigate to "Expenses"
3. View expense history list

**Expected Result:**
- ✅ Displays all recorded expenses
- ✅ Shows date, category, amount, description
- ✅ Can filter by date range
- ✅ Can filter by category
- ✅ Shows total expenses

**Actual Result:** _________________

---

### 3.6 Expense Management - Edit Expense

**Test ID:** CLERK-006  
**Priority:** MEDIUM  
**Status:** ☐ Not Tested | ☐ Pass | ☐ Fail

**Steps:**
1. Login as clerk
2. Navigate to "Expenses"
3. Find expense "Office Supplies - 150.00"
4. Click "Edit"
5. Change amount to 175.00
6. Update description
7. Save

**Expected Result:**
- ✅ Expense updated successfully
- ✅ New values reflected in list
- ✅ Edit history tracked (optional)

**Actual Result:** _________________

---

### 3.7 Debt Analysis - View Unpaid Debts

**Test ID:** CLERK-007  
**Priority:** HIGH  
**Status:** ☐ Not Tested | ☐ Pass | ☐ Fail

**Steps:**
1. Login as clerk
2. Navigate to "Debt Analysis"
3. Click "Unpaid Debts" tab

**Expected Result:**
- ✅ Displays all loans with outstanding balance > 0
- ✅ Shows client name, loan ID, outstanding amount
- ✅ Shows days overdue (if applicable)
- ✅ Can sort by amount or date
- ✅ Shows total unpaid debt

**Actual Result:** _________________

---

### 3.8 Debt Analysis - View Paid Debts

**Test ID:** CLERK-008  
**Priority:** HIGH  
**Status:** ☐ Not Tested | ☐ Pass | ☐ Fail

**Steps:**
1. Login as clerk
2. Navigate to "Debt Analysis"
3. Click "Paid Debts" tab

**Expected Result:**
- ✅ Displays all completed loans (balance = 0)
- ✅ Shows client name, loan ID, total paid
- ✅ Shows completion date
- ✅ Can filter by date range

**Actual Result:** _________________

---

### 3.9 Debt Analysis - Generate Analysis Report

**Test ID:** CLERK-009  
**Priority:** MEDIUM  
**Status:** ☐ Not Tested | ☐ Pass | ☐ Fail

**Steps:**
1. Login as clerk
2. Navigate to "Debt Analysis"
3. Click "Generate Analysis Report"
4. Select date range: Last 30 days

**Expected Result:**
- ✅ Report shows total outstanding debt
- ✅ Shows collection rate percentage
- ✅ Shows overdue amounts
- ✅ Shows paid vs unpaid breakdown
- ✅ Includes charts/visualizations

**Actual Result:** _________________

---

### 3.10 Debt Analysis - Filter by Status

**Test ID:** CLERK-010  
**Priority:** MEDIUM  
**Status:** ☐ Not Tested | ☐ Pass | ☐ Fail

**Steps:**
1. Login as clerk
2. Navigate to "Debt Analysis"
3. Apply filter: Status = Overdue
4. View results
5. Apply filter: Status = Paid
6. View results

**Expected Result:**
- ✅ Filters work correctly
- ✅ Can filter by: paid, unpaid, overdue, partial
- ✅ Can combine filters (date + status)
- ✅ Results update immediately

**Actual Result:** _________________

---

## Test Suite 4: Permission & Security Tests

### 4.1 Role-Based Access Control

**Test ID:** SEC-001  
**Priority:** CRITICAL  
**Status:** ☐ Not Tested | ☐ Pass | ☐ Fail

**Steps:**
1. Login as clerk
2. Try to access admin endpoints:
   - /api/admin/staff/
   - /api/admin/targets/
3. Try to access field officer endpoints:
   - /api/field-officer/clients/

**Expected Result:**
- ✅ All requests return 403 Forbidden
- ✅ Clerk cannot access admin features
- ✅ Clerk cannot access field officer features

**Actual Result:** _________________

---

### 4.2 Data Isolation - Field Officer

**Test ID:** SEC-002  
**Priority:** CRITICAL  
**Status:** ☐ Not Tested | ☐ Pass | ☐ Fail

**Steps:**
1. Create two field officers: FO1 and FO2
2. FO1 creates client C1
3. FO2 creates client C2
4. Login as FO1
5. Try to view/edit client C2

**Expected Result:**
- ✅ FO1 cannot see client C2
- ✅ FO1 can only see client C1
- ✅ API returns 404 or 403 when accessing C2

**Actual Result:** _________________

---

### 4.3 Multi-Tenant Isolation

**Test ID:** SEC-003  
**Priority:** CRITICAL  
**Status:** ☐ Not Tested | ☐ Pass | ☐ Fail

**Steps:**
1. Create two companies: Company A and Company B
2. Create users in each company
3. Login as Company A user
4. Try to access Company B data

**Expected Result:**
- ✅ Cannot see Company B data
- ✅ All queries filtered by company
- ✅ API enforces company isolation

**Actual Result:** _________________

---

## Test Suite 5: Integration Tests

### 5.1 End-to-End: Admin → Field Officer → Client

**Test ID:** INT-001  
**Priority:** HIGH  
**Status:** ☐ Not Tested | ☐ Pass | ☐ Fail

**Steps:**
1. Admin creates field officer
2. Field officer logs in
3. Field officer creates client
4. Client appears in system
5. Admin can see client in reports

**Expected Result:**
- ✅ Complete workflow works
- ✅ Data flows correctly between roles
- ✅ All relationships maintained

**Actual Result:** _________________

---

### 5.2 End-to-End: Target Setting → Achievement

**Test ID:** INT-002  
**Priority:** HIGH  
**Status:** ☐ Not Tested | ☐ Pass | ☐ Fail

**Steps:**
1. Admin sets target: 10 loans for FO1
2. FO1 logs in and sees target (0/10)
3. FO1 creates 5 loans
4. FO1 sees updated progress (5/10)
5. Admin sees FO1 at 50% achievement

**Expected Result:**
- ✅ Target visible to field officer
- ✅ Progress updates automatically
- ✅ Admin sees accurate achievement

**Actual Result:** _________________

---

### 5.3 End-to-End: Expense Recording → Report

**Test ID:** INT-003  
**Priority:** MEDIUM  
**Status:** ☐ Not Tested | ☐ Pass | ☐ Fail

**Steps:**
1. Clerk records 3 expenses
2. Clerk generates expense report
3. Admin views company expense report

**Expected Result:**
- ✅ All expenses appear in clerk report
- ✅ All expenses appear in admin report
- ✅ Totals calculated correctly

**Actual Result:** _________________

---

## Test Summary Template

```
┌─────────────────────────────────────────────────────────────┐
│                    TEST EXECUTION SUMMARY                   │
├─────────────────────────────────────────────────────────────┤
│ Date: _______________                                       │
│ Tester: _____________                                       │
│ Environment: _________                                      │
│                                                             │
│ Total Tests: ____                                           │
│ Passed: ____                                                │
│ Failed: ____                                                │
│ Not Tested: ____                                            │
│                                                             │
│ Pass Rate: ____%                                            │
│                                                             │
│ Critical Issues: ____                                       │
│ High Issues: ____                                           │
│ Medium Issues: ____                                         │
│ Low Issues: ____                                            │
│                                                             │
│ Ready for Production: ☐ Yes  ☐ No                          │
│                                                             │
│ Notes:                                                      │
│ _________________________________________________________   │
│ _________________________________________________________   │
│ _________________________________________________________   │
└─────────────────────────────────────────────────────────────┘
```

---

## Bug Report Template

```
Bug ID: ___________
Test ID: ___________
Severity: ☐ Critical  ☐ High  ☐ Medium  ☐ Low

Title: _______________________________

Description:
_________________________________________
_________________________________________

Steps to Reproduce:
1. _____________________________________
2. _____________________________________
3. _____________________________________

Expected Result:
_________________________________________

Actual Result:
_________________________________________

Screenshots/Logs:
_________________________________________

Environment:
- Browser: ___________
- OS: ___________
- Backend Version: ___________

Assigned To: ___________
Status: ☐ Open  ☐ In Progress  ☐ Fixed  ☐ Closed
```

---

## Automated Test Commands

```bash
# Run all backend tests
python manage.py test

# Run specific app tests
python manage.py test apps.accounts
python manage.py test apps.loans

# Run with coverage
coverage run --source='.' manage.py test
coverage report

# Run frontend tests
cd frontend
npm test

# Run E2E tests
npm run test:e2e

# API endpoint tests with curl
./scripts/test_api_endpoints.sh
```

---

**Test Plan Version:** 1.0  
**Last Updated:** $(date)  
**Next Review:** After implementation completion
