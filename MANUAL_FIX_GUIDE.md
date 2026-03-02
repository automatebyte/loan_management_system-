# Quick Fix Guide - Run These Commands

## The Issue
Your existing database has migrations that depend on a `companies` app. The new code changes are ready, but we need to fix the migration dependencies.

## Solution: Fresh Start (Recommended for Development)

```bash
# 1. Stop everything
cd /home/autobyte/Development/Portfolio/loan_management_system
docker-compose down -v

# 2. Remove old migration files (keeps __init__.py)
find backend/apps/*/migrations -name '*.py' ! -name '__init__.py' -delete

# 3. Remove company field from serializers
sed -i "s/, 'company'//" backend/apps/accounts/serializers.py

# 4. Start database only
docker-compose up -d db redis

# 5. Wait for database
sleep 5

# 6. Create fresh migrations
docker-compose run --rm backend python manage.py makemigrations

# 7. Apply migrations
docker-compose run --rm backend python manage.py migrate

# 8. Create superuser
docker-compose run --rm backend python manage.py shell << 'EOF'
from apps.accounts.models import User
User.objects.create_superuser(
    username='admin',
    email='admin@test.com',
    password='admin123',
    role='admin'
)
print("Admin created: username=admin, password=admin123")
EOF

# 9. Start all services
docker-compose up -d

# 10. Check logs
docker-compose logs -f backend
```

## Test the System

```bash
# Test login
curl -X POST http://localhost:8000/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Should return token and user with role='admin'
```

## Create Test Users

```bash
docker-compose exec backend python manage.py shell << 'EOF'
from apps.accounts.models import User

# Field Officer
User.objects.create_user(
    username='field_officer',
    password='fo123',
    role='field_officer',
    email='fo@test.com',
    first_name='Field',
    last_name='Officer'
)

# Clerk
User.objects.create_user(
    username='clerk',
    password='clerk123',
    role='clerk',
    email='clerk@test.com',
    first_name='Clerk',
    last_name='User'
)

print("Test users created!")
print("Field Officer: username=field_officer, password=fo123")
print("Clerk: username=clerk, password=clerk123")
EOF
```

## Access the System

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api
- Admin Panel: http://localhost:8000/admin

## Login Credentials

- **Admin:** username=`admin`, password=`admin123`
- **Field Officer:** username=`field_officer`, password=`fo123`
- **Clerk:** username=`clerk`, password=`clerk123`

## What's Been Implemented

✅ Backend:
- Updated User roles (admin, field_officer, clerk, client)
- Added Target, PerformanceMetric, PaymentSchedule, Expense models
- Created admin_views.py for staff management
- Created clerk_views.py for clerk operations
- Added all required API endpoints

✅ Frontend:
- ClerkDashboard component
- FieldOfficerDashboard component
- Updated routing for all roles
- Role-based navigation

## If You Get Errors

**Port 3000 in use:**
```bash
lsof -ti:3000 | xargs kill -9
docker-compose restart frontend
```

**Database issues:**
```bash
docker-compose down -v
# Then start from step 4 above
```

**Import errors:**
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Next Steps After System is Running

1. Login as admin at http://localhost:3000
2. Test adding a field officer via API or admin panel
3. Test adding a clerk
4. Login as field officer and add a client
5. Login as clerk and record an expense

All the code changes are complete and ready to use once migrations are fixed!
