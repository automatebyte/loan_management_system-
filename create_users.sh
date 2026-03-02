#!/bin/bash
# Create test users for KreditAI

echo "Creating test users..."

docker-compose exec -T backend python manage.py shell << 'EOF'
from apps.accounts.models import User

# Delete existing test users
User.objects.filter(username__in=['admin', 'field_officer', 'clerk']).delete()

# Create admin
admin = User.objects.create_superuser(
    username='admin',
    email='admin@test.com',
    password='admin123',
    role='admin'
)
print(f"✅ Admin: username=admin, password=admin123")

# Create field officer
fo = User.objects.create_user(
    username='field_officer',
    email='fo@test.com',
    password='fo123',
    role='field_officer',
    first_name='Field',
    last_name='Officer'
)
print(f"✅ Field Officer: username=field_officer, password=fo123")

# Create clerk
clerk = User.objects.create_user(
    username='clerk',
    email='clerk@test.com',
    password='clerk123',
    role='clerk',
    first_name='Clerk',
    last_name='User'
)
print(f"✅ Clerk: username=clerk, password=clerk123")
EOF

echo ""
echo "Done! You can now login with:"
echo "  Admin: admin / admin123"
echo "  Field Officer: field_officer / fo123"
echo "  Clerk: clerk / clerk123"
