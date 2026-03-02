# Safe Deployment Guide for Role Migration

## Pre-Deployment Checklist

### 1. Backup Current Database
```bash
# On production server
python manage.py dumpdata > backup_$(date +%Y%m%d_%H%M%S).json
```

### 2. Test Migrations Locally First
```bash
# In development
python manage.py makemigrations --dry-run
python manage.py migrate --plan
```

## Deployment Steps (Zero Downtime)

### Step 1: Deploy Backend Changes
```bash
cd backend

# Make migrations
python manage.py makemigrations accounts
python manage.py makemigrations loans

# Apply migrations
python manage.py migrate

# Update existing roles (backward compatible)
python manage.py shell << EOF
from apps.accounts.models import User
# Update loan_officer to field_officer
User.objects.filter(role='loan_officer').update(role='field_officer')
print("Roles updated successfully")
EOF
```

### Step 2: Restart Backend Services
```bash
# For Docker
docker-compose restart backend

# For systemd
sudo systemctl restart gunicorn
sudo systemctl restart celery
```

### Step 3: Deploy Frontend Changes
```bash
cd frontend

# Build production bundle
npm run build

# Deploy to hosting (Render/Netlify/Vercel)
# The build will include new components
```

### Step 4: Verify Deployment
```bash
# Test endpoints
curl -X POST https://your-domain.com/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'

# Check health
curl https://your-domain.com/api/health/
```

## Backward Compatibility Features

### 1. Role Mapping
- `loan_officer` → automatically treated as `field_officer`
- Old URLs `/loan-officer` → redirect to `/field-officer`
- API accepts both role names during transition

### 2. Database Migration
- Adds new roles without removing old data
- Updates existing `loan_officer` records to `field_officer`
- No data loss

### 3. Frontend Routing
- Both `/loan-officer` and `/field-officer` routes work
- Automatic redirect based on user role
- No broken links

## Rollback Plan

If issues occur:

```bash
# Restore database
python manage.py loaddata backup_YYYYMMDD_HHMMSS.json

# Revert migrations
python manage.py migrate accounts <previous_migration_name>
python manage.py migrate loans <previous_migration_name>

# Restart services
docker-compose restart
```

## Environment Variables

No new environment variables required. Existing configuration works.

## Monitoring

After deployment, monitor:
- Login success rate
- API error rates
- User role distribution
- Database query performance

## Testing Checklist

- [ ] Admin can login
- [ ] Field officers can login (both old and new accounts)
- [ ] Clerks can login (new accounts)
- [ ] Clients can login
- [ ] All dashboards load correctly
- [ ] API endpoints respond correctly
- [ ] No 500 errors in logs

## Support

If issues arise:
1. Check application logs
2. Verify database migrations completed
3. Ensure all services restarted
4. Test with different user roles
5. Check browser console for frontend errors
