#!/bin/bash

echo "Starting KreditAI role migration..."

# Backup database first
echo "Creating database backup..."
python manage.py dumpdata > backup_before_migration.json

# Create migrations
echo "Creating migrations..."
python manage.py makemigrations accounts --name update_user_roles
python manage.py makemigrations loans --name add_expense_and_schedule

# Apply migrations
echo "Applying migrations..."
python manage.py migrate

# Update existing loan_officer roles to field_officer
echo "Updating existing roles..."
python manage.py shell << EOF
from apps.accounts.models import User
User.objects.filter(role='loan_officer').update(role='field_officer')
print("Updated loan_officer roles to field_officer")
EOF

echo "Migration complete!"
echo "Backup saved to: backup_before_migration.json"
