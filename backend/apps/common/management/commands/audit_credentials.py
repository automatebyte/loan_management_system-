from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.companies.models import Company

User = get_user_model()

class Command(BaseCommand):
    help = 'Audit existing companies and their admin credentials'
    
    def handle(self, *args, **options):
        self.stdout.write('=== COMPANY CREDENTIAL AUDIT ===\n')
        
        companies = Company.objects.all()
        self.stdout.write(f'Total Companies: {companies.count()}\n')
        
        for company in companies:
            self.stdout.write(f'--- Company: {company.name} ---')
            self.stdout.write(f'ID: {company.id}')
            self.stdout.write(f'Admin Email: {company.admin_email}')
            self.stdout.write(f'Status: {company.subscription_status}')
            self.stdout.write(f'Active: {company.is_active}')
            
            # Check for admin user
            admin_users = User.objects.filter(
                company=company,
                role='company_admin'
            )
            
            if admin_users.exists():
                for admin in admin_users:
                    self.stdout.write(f'✅ Admin User Found:')
                    self.stdout.write(f'   Username: {admin.username}')
                    self.stdout.write(f'   Email: {admin.email}')
                    self.stdout.write(f'   Active: {admin.is_active}')
                    self.stdout.write(f'   Last Login: {admin.last_login}')
            else:
                self.stdout.write('❌ NO ADMIN USER FOUND')
                
            # Check loan officers
            officers = User.objects.filter(
                company=company,
                role='loan_officer'
            )
            self.stdout.write(f'Loan Officers: {officers.count()}')
            
            self.stdout.write('')
        
        # Show all users by role
        self.stdout.write('=== ALL USERS BY ROLE ===')
        for role in ['super_admin', 'company_admin', 'loan_officer', 'client']:
            users = User.objects.filter(role=role)
            self.stdout.write(f'{role.upper()}: {users.count()} users')
            for user in users:
                company_name = user.company.name if user.company else 'No Company'
                self.stdout.write(f'  - {user.username} ({user.email}) - {company_name}')