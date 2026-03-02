# Migration Guide: Multi-Tenant to Single-Tenant (Eagle Trend)

## Overview
This guide outlines the conversion from a multi-tenant loan management system to a single-tenant application branded as "Eagle Trend".

## Changes Made

### 1. Removed Multi-Tenant Infrastructure
- **Deleted**: `MultiTenantMiddleware` from `apps/common/middleware.py`
- **Removed**: `apps.companies` app from `INSTALLED_APPS`
- **Removed**: Company registration and management endpoints

### 2. Database Model Changes

#### User Model (`apps/accounts/models.py`)
- **Removed**: `company` foreign key
- **Updated**: Role choices from `['super_admin', 'company_admin', 'loan_officer', 'client']` to `['admin', 'loan_officer', 'client']`

#### Client Model (`apps/accounts/models.py`)
- **Removed**: `company` foreign key

#### Loan Models (`apps/loans/models.py`)
- **Removed**: `company` foreign key from `LoanProduct` and `Loan` models

### 3. Permission Changes (`apps/accounts/permissions.py`)
- **Removed**: `IsSuperAdmin`, `IsCompanyAdmin`, `IsSameCompany`, `TenantIsolationMixin`
- **Added**: `IsAdmin` (simplified admin permission)
- **Updated**: `IsLoanOfficer` to check for `['admin', 'loan_officer']` roles

### 4. View Changes (`apps/accounts/views.py`)
- **Removed**: Company-based filtering and authentication
- **Simplified**: Login endpoint (no company context)
- **Updated**: Profile endpoint (no company information)
- **Simplified**: Loan officer creation (no company assignment)

### 5. URL Configuration (`backend/urls.py`)
- **Removed**: `/api/companies/` endpoints
- **Removed**: `/api/verify-super-admin/` endpoint

### 6. Settings (`backend/settings.py`)
- **Removed**: `apps.companies` from `LOCAL_APPS`
- **Removed**: `MultiTenantMiddleware` from `MIDDLEWARE`
- **Updated**: `DEFAULT_FROM_EMAIL` to `noreply@eagletrend.com`
- **Added**: Eagle Trend branding configuration

## Migration Steps

### Step 1: Backup Database
```bash
python manage.py dumpdata > backup.json
```

### Step 2: Create New Migrations
```bash
# Remove old migrations (optional, for clean slate)
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc" -delete

# Create fresh migrations
python manage.py makemigrations
```

### Step 3: Migrate Database
```bash
# For fresh database
python manage.py migrate

# For existing database with data
# You'll need to create custom migration to:
# 1. Remove company_id columns
# 2. Update user roles (super_admin -> admin, company_admin -> admin)
```

### Step 4: Create Admin User
```bash
python manage.py createsuperuser
# Username: admin
# Email: admin@eagletrend.com
# Password: [secure password]
```

### Step 5: Update Frontend
- Remove company selection/registration flows
- Update branding to "Eagle Trend"
- Remove multi-tenant UI elements
- Update API endpoints (remove /api/companies/)

## Data Migration Script

If you have existing data, create a custom migration:

```python
# apps/accounts/migrations/0003_convert_to_single_tenant.py
from django.db import migrations

def convert_roles(apps, schema_editor):
    User = apps.get_model('accounts', 'User')
    # Convert super_admin and company_admin to admin
    User.objects.filter(role__in=['super_admin', 'company_admin']).update(role='admin')

class Migration(migrations.Migration):
    dependencies = [
        ('accounts', '0002_previous_migration'),
    ]
    
    operations = [
        migrations.RunPython(convert_roles),
    ]
```

## Testing Checklist

- [ ] User authentication works without company context
- [ ] Admin can create loan officers
- [ ] Loan officers can manage loans
- [ ] Clients can view their loans
- [ ] All API endpoints work without company filtering
- [ ] Database queries don't reference company fields

## Rollback Plan

If you need to rollback:
1. Restore from backup: `python manage.py loaddata backup.json`
2. Revert code changes using git: `git revert <commit-hash>`
3. Run old migrations: `python manage.py migrate`

## Notes

- The companies app folder still exists but is not used
- You can safely delete `apps/companies/` directory after successful migration
- Update environment variables to remove company-related configs
- Update documentation to reflect single-tenant architecture
