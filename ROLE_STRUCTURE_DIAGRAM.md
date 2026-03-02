# KreditAI Role Structure & Feature Map

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    KreditAI System                          │
│                Multi-Tenant Loan Management                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ├─────────────────────────────────┐
                              │                                 │
                    ┌─────────▼─────────┐          ┌───────────▼──────────┐
                    │   Authentication   │          │   Multi-Tenancy      │
                    │   (JWT Tokens)     │          │   (Company Isolation)│
                    └─────────┬─────────┘          └──────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
        ┌───────▼──────┐ ┌───▼────┐ ┌─────▼──────┐
        │   ADMIN      │ │ FIELD  │ │   CLERK    │
        │   (Role 1)   │ │OFFICER │ │  (Role 3)  │
        │              │ │(Role 2)│ │            │
        └──────────────┘ └────────┘ └────────────┘
```

---

## Role Hierarchy & Permissions

```
┌──────────────────────────────────────────────────────────────────┐
│                         ADMIN (Role 1)                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ FULL SYSTEM ACCESS                                         │ │
│  │ • Manage all staff (Field Officers & Clerks)               │ │
│  │ • View all data across the company                         │ │
│  │ • Set targets and monitor performance                      │ │
│  │ • Generate company-wide reports                            │ │
│  │ • Configure system settings                                │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
┌───────────────▼──────────────┐  ┌────────▼─────────────────────┐
│  FIELD OFFICER (Role 2)      │  │     CLERK (Role 3)           │
│  ┌──────────────────────────┐│  │  ┌──────────────────────────┐│
│  │ CLIENT & LOAN MANAGEMENT ││  │  │ OPERATIONS & COLLECTIONS ││
│  │ • Add/manage clients     ││  │  │ • Track daily dues       ││
│  │ • View assigned loans    ││  │  │ • Record expenses        ││
│  │ • Generate own reports   ││  │  │ • Analyze debt status    ││
│  │ • Track own targets      ││  │  │ • Process payments       ││
│  └──────────────────────────┘│  │  └──────────────────────────┘│
└───────────────────────────────┘  └──────────────────────────────┘
```

---

## Feature Matrix by Role

### 1. ADMIN Features

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ Staff Management │  │ Performance      │               │
│  │                  │  │ Monitoring       │               │
│  │ • Add Field      │  │                  │               │
│  │   Officers       │  │ • Field Officer  │               │
│  │ • Add Clerks     │  │   Metrics        │               │
│  │ • Remove Staff   │  │ • Clerk Metrics  │               │
│  │ • View All Staff │  │ • Comparisons    │               │
│  └──────────────────┘  └──────────────────┘               │
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ Target           │  │ Company          │               │
│  │ Management       │  │ Reports          │               │
│  │                  │  │                  │               │
│  │ • Set Targets    │  │ • Financial      │               │
│  │ • View Progress  │  │ • Portfolio      │               │
│  │ • Modify Targets │  │ • Staff Summary  │               │
│  │ • Track Goals    │  │ • Export (PDF)   │               │
│  └──────────────────┘  └──────────────────┘               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**API Endpoints:**
```
POST   /api/admin/staff/field-officers/
POST   /api/admin/staff/clerks/
DELETE /api/admin/staff/{id}/
GET    /api/admin/staff/
GET    /api/admin/performance/
POST   /api/admin/targets/
GET    /api/admin/targets/
PUT    /api/admin/targets/{id}/
GET    /api/admin/reports/company/
GET    /api/admin/reports/export/
```

---

### 2. FIELD OFFICER Features

```
┌─────────────────────────────────────────────────────────────┐
│              FIELD OFFICER DASHBOARD                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ Client           │  │ Loan             │               │
│  │ Management       │  │ Portfolio        │               │
│  │                  │  │                  │               │
│  │ • Add Client     │  │ • Active Loans   │               │
│  │ • Update Info    │  │ • Inactive Loans │               │
│  │ • View Clients   │  │ • Loan Details   │               │
│  │ • Client Form:   │  │ • Payment        │               │
│  │   - Username     │  │   History        │               │
│  │   - Email        │  │                  │               │
│  │   - Name         │  │                  │               │
│  │   - DOB          │  │                  │               │
│  │   - National ID  │  │                  │               │
│  │   - Address      │  │                  │               │
│  │   - Income       │  │                  │               │
│  │   - Employment   │  │                  │               │
│  │   - ID Picture   │  │                  │               │
│  └──────────────────┘  └──────────────────┘               │
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ My Performance   │  │ My Targets       │               │
│  │                  │  │                  │               │
│  │ • Client Count   │  │ • Current Target │               │
│  │ • Loans Issued   │  │ • Achievement %  │               │
│  │ • Conversion     │  │ • Time Remaining │               │
│  │ • My Reports     │  │                  │               │
│  └──────────────────┘  └──────────────────┘               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**API Endpoints:**
```
POST   /api/field-officer/clients/
GET    /api/field-officer/clients/
PUT    /api/field-officer/clients/{id}/
GET    /api/field-officer/loans/active/
GET    /api/field-officer/loans/inactive/
GET    /api/field-officer/loans/{id}/
GET    /api/field-officer/reports/
GET    /api/field-officer/targets/
```

---

### 3. CLERK Features

```
┌─────────────────────────────────────────────────────────────┐
│                   CLERK DASHBOARD                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ Daily Dues       │  │ Expense          │               │
│  │ Tracking         │  │ Management       │               │
│  │                  │  │                  │               │
│  │ • Today's Dues   │  │ • Record Expense │               │
│  │ • Due Amount     │  │ • Expense Form:  │               │
│  │ • Client List    │  │   - Date         │               │
│  │ • Payment Status │  │   - Category     │               │
│  │ • Date Filter    │  │   - Amount       │               │
│  │ • Generate       │  │   - Description  │               │
│  │   Report         │  │   - Receipt      │               │
│  │                  │  │ • View History   │               │
│  │                  │  │ • Edit Expenses  │               │
│  └──────────────────┘  └──────────────────┘               │
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ Debt Analysis    │  │ Collections      │               │
│  │                  │  │ Summary          │               │
│  │ • Unpaid Debts   │  │                  │               │
│  │ • Paid Debts     │  │ • Total Due      │               │
│  │ • Overdue Loans  │  │ • Collected      │               │
│  │ • Status Filter  │  │ • Outstanding    │               │
│  │ • Analysis       │  │ • Collection %   │               │
│  │   Report         │  │                  │               │
│  └──────────────────┘  └──────────────────┘               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**API Endpoints:**
```
GET    /api/clerk/dues/
GET    /api/clerk/dues/daily/?date=YYYY-MM-DD
POST   /api/clerk/expenses/
GET    /api/clerk/expenses/
PUT    /api/clerk/expenses/{id}/
GET    /api/clerk/debt-analysis/unpaid/
GET    /api/clerk/debt-analysis/paid/
GET    /api/clerk/debt-analysis/report/
```

---

## Data Flow Diagrams

### Client Registration Flow (Field Officer)

```
┌──────────────┐
│ Field Officer│
│   Logs In    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Clicks "Add  │
│   Client"    │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────┐
│  Fills Client Form:          │
│  • Username                  │
│  • Email                     │
│  • First Name, Last Name     │
│  • Date of Birth             │
│  • National ID               │
│  • Address                   │
│  • Monthly Income            │
│  • Employment Status         │
│  • ID Picture Upload         │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────┐
│   Submits    │
│    Form      │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────┐
│  Backend Creates:            │
│  1. User Account (role:      │
│     client)                  │
│  2. Client Profile           │
│  3. Assigns to Field Officer │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────┐
│   Success!   │
│ Client Added │
└──────────────┘
```

### Daily Dues Tracking Flow (Clerk)

```
┌──────────────┐
│    Clerk     │
│   Logs In    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Views "Daily │
│    Dues"     │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────┐
│  System Calculates:          │
│  • All loans with payments   │
│    due today                 │
│  • Amount due per client     │
│  • Payment status            │
│  • Overdue amounts           │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Clerk Sees:                 │
│  ┌────────────────────────┐  │
│  │ Client A - $500 (Due)  │  │
│  │ Client B - $300 (Paid) │  │
│  │ Client C - $450 (Over) │  │
│  └────────────────────────┘  │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────┐
│ Can Filter   │
│  by Date     │
└──────────────┘
```

### Target Setting Flow (Admin)

```
┌──────────────┐
│    Admin     │
│   Logs In    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Navigates to │
│  "Targets"   │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────┐
│  Selects Field Officer       │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Sets Target:                │
│  • Type (Loans/Amount/       │
│    Clients)                  │
│  • Target Value              │
│  • Period (Start/End Date)   │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────┐
│   Submits    │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────┐
│  Target Saved                │
│  Field Officer Can Now View  │
└──────────────────────────────┘
```

---

## Database Schema Overview

### Core Tables

```
┌─────────────────────────────────────────────────────────────┐
│                         User                                │
├─────────────────────────────────────────────────────────────┤
│ id (PK)                                                     │
│ username                                                    │
│ email                                                       │
│ role (admin | field_officer | clerk | client)              │
│ company_id (FK)                                             │
│ is_active                                                   │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
┌───────────────▼──────┐ ┌───▼────┐ ┌─────▼──────┐
│      Client          │ │  Loan  │ │   Target   │
├──────────────────────┤ ├────────┤ ├────────────┤
│ id (PK)              │ │ id (PK)│ │ id (PK)    │
│ user_id (FK)         │ │ client │ │ field_off  │
│ client_id            │ │ amount │ │ target_type│
│ date_of_birth        │ │ status │ │ target_val │
│ national_id          │ │ balance│ │ achieved   │
│ address              │ └────┬───┘ │ period     │
│ monthly_income       │      │     └────────────┘
│ employment_status    │      │
│ identification_pic   │      │
│ loan_officer_id (FK) │      │
└──────────────────────┘      │
                              │
                ┌─────────────┼─────────────┐
                │             │             │
┌───────────────▼──────┐ ┌───▼────────┐ ┌──▼──────────┐
│  PaymentSchedule     │ │Transaction │ │   Expense   │
├──────────────────────┤ ├────────────┤ ├─────────────┤
│ id (PK)              │ │ id (PK)    │ │ id (PK)     │
│ loan_id (FK)         │ │ loan_id    │ │ date        │
│ due_date             │ │ amount     │ │ category    │
│ amount_due           │ │ type       │ │ amount      │
│ amount_paid          │ │ date       │ │ description │
│ status               │ └────────────┘ │ receipt     │
└──────────────────────┘                │ recorded_by │
                                        └─────────────┘
```

---

## Implementation Status Legend

```
✅ COMPLETE     - Feature fully implemented and tested
⚠️  PARTIAL     - Feature partially implemented, needs work
❌ MISSING      - Feature not implemented
🔄 IN PROGRESS  - Currently being developed
📋 PLANNED      - Scheduled for future development
```

---

## Quick Reference: What Each Role Can Do

### ADMIN
```
✅ Login and authenticate
⚠️  Add field officers (role name mismatch)
❌ Add clerks
⚠️  View staff list
❌ Set targets
❌ View performance dashboards
⚠️  Generate basic reports
❌ Export reports
```

### FIELD OFFICER
```
✅ Login and authenticate
✅ Add clients with full form
⚠️  View assigned clients
⚠️  View loans (needs filtering)
❌ Filter active/inactive loans
❌ Generate individual reports
❌ View own targets
```

### CLERK
```
❌ Login (role doesn't exist)
❌ View daily dues
❌ Record expenses
❌ View expense history
❌ Analyze unpaid debts
❌ Analyze paid debts
❌ Generate debt reports
```

---

## Next Steps Visualization

```
Phase 1: Fix Roles (Week 1)
├── Update role choices
├── Create clerk role
└── Fix naming throughout

Phase 2: Core Models (Week 2)
├── Target model
├── Expense model
├── PaymentSchedule model
└── Run migrations

Phase 3: Admin Features (Week 3)
├── Staff management
├── Target management
└── Performance dashboards

Phase 4: Clerk Features (Week 3-4)
├── Dues tracking
├── Expense management
└── Debt analysis

Phase 5: Testing & Polish (Week 4)
├── Integration tests
├── UI improvements
└── Documentation
```

---

**Document Version:** 1.0  
**Last Updated:** $(date)  
**Related Documents:** 
- FEATURE_VERIFICATION_REPORT.md
- IMPLEMENTATION_CHECKLIST.md
- EXECUTIVE_SUMMARY.md
