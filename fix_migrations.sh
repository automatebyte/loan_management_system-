#!/bin/bash

echo "Fixing company dependencies..."

# Remove company from User serializer
sed -i "s/, 'company'//" backend/apps/accounts/serializers.py

# Start fresh - remove all migrations and recreate
docker-compose run --rm backend bash -c "
find /app/apps/*/migrations -name '*.py' ! -name '__init__.py' -delete
python manage.py makemigrations
python manage.py migrate
"

echo "Done!"
