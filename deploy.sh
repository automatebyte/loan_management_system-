#!/bin/bash

set -e

echo "========================================="
echo "KreditAI Role Migration Deployment"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if running in production
if [ "$ENVIRONMENT" = "production" ]; then
    echo -e "${YELLOW}Running in PRODUCTION mode${NC}"
    read -p "Are you sure you want to continue? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        echo "Deployment cancelled"
        exit 1
    fi
fi

# Step 1: Backup
echo -e "\n${GREEN}Step 1: Creating backup...${NC}"
cd backend
python manage.py dumpdata > ../backup_$(date +%Y%m%d_%H%M%S).json
echo "Backup created successfully"

# Step 2: Run migrations
echo -e "\n${GREEN}Step 2: Running migrations...${NC}"
python manage.py makemigrations accounts --name update_user_roles
python manage.py makemigrations loans --name add_expense_and_schedule
python manage.py migrate

# Step 3: Update existing roles
echo -e "\n${GREEN}Step 3: Updating existing roles...${NC}"
python manage.py shell << EOF
from apps.accounts.models import User
count = User.objects.filter(role='loan_officer').update(role='field_officer')
print(f"Updated {count} loan_officer records to field_officer")
EOF

# Step 4: Collect static files
echo -e "\n${GREEN}Step 4: Collecting static files...${NC}"
python manage.py collectstatic --noinput

# Step 5: Build frontend
echo -e "\n${GREEN}Step 5: Building frontend...${NC}"
cd ../frontend
npm install
npm run build

# Step 6: Run tests (optional)
if [ "$RUN_TESTS" = "true" ]; then
    echo -e "\n${GREEN}Step 6: Running tests...${NC}"
    cd ../backend
    python manage.py test
fi

echo -e "\n${GREEN}=========================================${NC}"
echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "Next steps:"
echo "1. Restart your application server"
echo "2. Verify all services are running"
echo "3. Test login with different roles"
echo "4. Monitor logs for any errors"
echo ""
echo "Rollback command (if needed):"
echo "python manage.py loaddata backup_YYYYMMDD_HHMMSS.json"
