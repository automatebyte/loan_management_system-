from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.companies.models import Company
from apps.common.utils import create_company_admin
from apps.common.email_service import send_welcome_email

User = get_user_model()

class Command(BaseCommand):
    help = 'Fix credentials for existing approved companies'
    
    def add_arguments(self, parser):
        parser.add_argument('--create-missing', action='store_true', help='Create missing admin users')
        parser.add_argument('--send-emails', action='store_true', help='Send credential emails')
        parser.add_argument('--company-id', type=int, help='Fix specific company by ID')
    
    def handle(self, *args, **options):
        self.stdout.write('=== FIXING COMPANY CREDENTIALS ===\n')
        
        # Get companies that need fixing
        if options['company_id']:
            companies = Company.objects.filter(id=options['company_id'])
        else:
            companies = Company.objects.filter(
                subscription_status__in=['active', 'trial'],
                is_active=True
            )
        
        for company in companies:
            self.stdout.write(f'Processing: {company.name}')
            
            # Check if admin user exists
            admin_user = User.objects.filter(
                company=company,
                role='company_admin'
            ).first()
            
            if not admin_user and options['create_missing']:
                self.stdout.write('  Creating admin user...')
                admin_user, password = create_company_admin(company)
                
                self.stdout.write(f'  [CREATED] Admin user:')
                self.stdout.write(f'     Username: {admin_user.username}')
                self.stdout.write(f'     Email: {admin_user.email}')
                self.stdout.write(f'     Password: {password}')
                
                if options['send_emails']:
                    send_welcome_email.delay(
                        user_email=admin_user.email,
                        user_name=company.admin_name,
                        company_name=company.name,
                        temp_password=password
                    )
                    self.stdout.write('  [EMAIL] Welcome email sent')
                    
            elif admin_user:
                self.stdout.write(f'  [EXISTS] Admin user: {admin_user.username}')
                
                if options['send_emails']:
                    # Reset password and send email
                    from apps.common.utils import generate_secure_password
                    new_password = generate_secure_password()
                    admin_user.set_password(new_password)
                    admin_user.save()
                    
                    send_welcome_email.delay(
                        user_email=admin_user.email,
                        user_name=company.admin_name,
                        company_name=company.name,
                        temp_password=new_password
                    )
                    self.stdout.write(f'  [RESET] Password reset and email sent')
                    self.stdout.write(f'     New Password: {new_password}')
            else:
                self.stdout.write('  [ERROR] No admin user (use --create-missing to fix)')
            
            self.stdout.write('')
        
        self.stdout.write('=== SUMMARY ===')
        self.stdout.write('Login URL: https://kreditai1.onrender.com/')
        self.stdout.write('All company admins use the same login page')
        self.stdout.write('They will be auto-routed to their dashboard after login')