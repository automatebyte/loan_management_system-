# Quick Start: Deploy Role Changes

## For Development (Local)

```bash
# 1. Navigate to project
cd /home/autobyte/Development/Portfolio/loan_management_system

# 2. Run deployment script
./deploy.sh

# 3. Restart Docker containers
docker-compose down
docker-compose up --build
```

## For Production (Render/Heroku/AWS)

```bash
# 1. Set environment
export ENVIRONMENT=production

# 2. Run deployment
./deploy.sh

# 3. Push to git (triggers auto-deploy)
git add .
git commit -m "feat: implement field_officer and clerk roles"
git push origin main
```

## Manual Steps (If Script Fails)

### Backend
```bash
cd backend

# Create migrations
python manage.py makemigrations accounts
python manage.py makemigrations loans

# Apply migrations
python manage.py migrate

# Update roles
python manage.py shell
>>> from apps.accounts.models import User
>>> User.objects.filter(role='loan_officer').update(role='field_officer')
>>> exit()
```

### Frontend
```bash
cd frontend
npm install
npm run build
```

## Verify Deployment

### 1. Check Backend
```bash
curl http://localhost:8000/api/accounts/admin/staff/
```

### 2. Check Frontend
Open browser: `http://localhost:3000`

### 3. Test Login
- Admin: Should see admin dashboard
- Field Officer: Should see field officer dashboard
- Clerk: Should see clerk dashboard

## Create Test Users

```bash
python manage.py shell
```

```python
from apps.accounts.models import User

# Create admin
admin = User.objects.create_user(
    username='admin',
    password='admin123',
    role='admin',
    email='admin@test.com',
    first_name='Admin',
    last_name='User'
)

# Create field officer
fo = User.objects.create_user(
    username='field_officer',
    password='fo123',
    role='field_officer',
    email='fo@test.com',
    first_name='Field',
    last_name='Officer'
)

# Create clerk
clerk = User.objects.create_user(
    username='clerk',
    password='clerk123',
    role='clerk',
    email='clerk@test.com',
    first_name='Clerk',
    last_name='User'
)

print("Test users created!")
```

## Troubleshooting

### Issue: Migration fails
```bash
# Check migration status
python manage.py showmigrations

# If stuck, fake the migration
python manage.py migrate --fake accounts
python manage.py migrate --fake loans
```

### Issue: Frontend won't build
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: Docker won't start
```bash
docker-compose down -v
docker-compose up --build
```

## Rollback

```bash
# Restore from backup
python manage.py loaddata backup_YYYYMMDD_HHMMSS.json

# Or revert git
git revert HEAD
git push
```

## Success Indicators

✅ No errors in migration output
✅ All services start successfully
✅ Can login with all role types
✅ Dashboards load correctly
✅ API endpoints respond

## Need Help?

Check these files:
- `IMPLEMENTATION_SUMMARY.md` - Full details
- `SAFE_DEPLOYMENT_GUIDE.md` - Detailed steps
- `FEATURE_VERIFICATION_REPORT.md` - What was implemented

## Time Estimate

- Development: 5-10 minutes
- Production: 15-20 minutes (with testing)
