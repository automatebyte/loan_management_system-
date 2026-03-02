#!/bin/bash
set -e

echo "========================================="
echo "KreditAI Quick Fix & Deploy"
echo "========================================="

cd /home/autobyte/Development/Portfolio/loan_management_system

echo "Step 1: Stopping containers..."
docker-compose down -v

echo "Step 2: Cleaning old migrations..."
find backend/apps/*/migrations -name '*.py' ! -name '__init__.py' -delete

echo "Step 3: Fixing serializers..."
sed -i "s/, 'company'//" backend/apps/accounts/serializers.py

echo "Step 4: Starting database..."
docker-compose up -d db redis
sleep 10

echo "Step 5: Creating migrations..."
docker-compose run --rm backend python manage.py makemigrations

echo "Step 6: Applying migrations..."
docker-compose run --rm backend python manage.py migrate

echo "Step 7: Creating admin user..."
docker-compose run --rm backend python manage.py shell << 'EOF'
from apps.accounts.models import User
try:
    User.objects.create_superuser(
        username='admin',
        email='admin@test.com',
        password='admin123',
        role='admin'
    )
    print("✅ Admin created: username=admin, password=admin123")
except:
    print("⚠️  Admin already exists")
EOF

echo "Step 8: Creating test users..."
docker-compose run --rm backend python manage.py shell << 'EOF'
from apps.accounts.models import User
try:
    User.objects.create_user(
        username='field_officer',
        password='fo123',
        role='field_officer',
        email='fo@test.com',
        first_name='Field',
        last_name='Officer'
    )
    print("✅ Field Officer created: username=field_officer, password=fo123")
except:
    print("⚠️  Field Officer already exists")

try:
    User.objects.create_user(
        username='clerk',
        password='clerk123',
        role='clerk',
        email='clerk@test.com',
        first_name='Clerk',
        last_name='User'
    )
    print("✅ Clerk created: username=clerk, password=clerk123")
except:
    print("⚠️  Clerk already exists")
EOF

echo "Step 9: Starting all services..."
docker-compose up -d

echo ""
echo "========================================="
echo "✅ Deployment Complete!"
echo "========================================="
echo ""
echo "Access your system:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8000/api"
echo "  Admin:    http://localhost:8000/admin"
echo ""
echo "Login Credentials:"
echo "  Admin:         username=admin, password=admin123"
echo "  Field Officer: username=field_officer, password=fo123"
echo "  Clerk:         username=clerk, password=clerk123"
echo ""
echo "Checking services..."
sleep 5
docker-compose ps
echo ""
echo "View logs: docker-compose logs -f"
