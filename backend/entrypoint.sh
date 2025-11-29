#!/bin/bash

# Wait for database
echo "Waiting for database..."
while ! nc -z db 5432; do
  sleep 0.1
done
echo "Database started"

# Run migrations
python manage.py migrate

# Create super admin
python manage.py create_superadmin

# Start server
exec "$@"