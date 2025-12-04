from django.core.management.base import BaseCommand
from apps.companies.models import Company
from apps.accounts.models import User
from apps.common.utils import create_company_admin

class Command(BaseCommand):
    help = 'Fix missing company admin credentials'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be done without making changes',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        
        if dry_run:
            self.stdout.write("=== DRY RUN MODE - NO CHANGES WILL BE MADE ===\n")
        else:
            self.stdout.write("=== FIXING COMPANY CREDENTIALS ===\n")
        
        # Find approved companies without admin users
        approved_companies = Company.objects.filter(subscription_status__in=['active', 'trial'])
        fixed_count = 0
        
        for company in approved_companies:
            admin_users = User.objects.filter(company=company, role='company_admin')
            
            if not admin_users:
                self.stdout.write(f"[FIXING] Credentials for: {company.name}")
                
                if not dry_run:
                    try:
                        admin_user, temp_password = create_company_admin(company)
                        self.stdout.write(f"   [CREATED] Admin user: {admin_user.username}")
                        self.stdout.write(f"   [PASSWORD] {temp_password}")
                        self.stdout.write(f"   [EMAIL] {admin_user.email}")
                        
                        # Send welcome email
                        from apps.common.email_service import send_welcome_email
                        try:
                            send_welcome_email.delay(
                                user_email=admin_user.email,
                                user_name=company.admin_name,
                                company_name=company.name,
                                temp_password=temp_password
                            )
                            self.stdout.write(f"   [QUEUED] Welcome email")
                        except Exception as e:
                            self.stdout.write(f"   [WARNING] Email failed: {e}")
                        
                        fixed_count += 1
                        
                    except Exception as e:
                        self.stdout.write(f"   [ERROR] Failed to create user: {e}")
                else:
                    self.stdout.write(f"   Would create admin user for {company.admin_email}")
                    fixed_count += 1
                
                self.stdout.write("   ---")
        
        if fixed_count == 0:
            self.stdout.write("[OK] All approved companies already have admin users")
        else:
            if dry_run:
                self.stdout.write(f"\n[DRY-RUN] Would fix {fixed_count} companies")
            else:
                self.stdout.write(f"\n[COMPLETE] Fixed {fixed_count} companies")
        
        # Also check for pending companies
        pending_companies = Company.objects.filter(subscription_status='pending_approval')
        if pending_companies:
            self.stdout.write(f"\n[PENDING] {pending_companies.count()} companies still pending approval:")
            for company in pending_companies:
                self.stdout.write(f"   - {company.name} ({company.admin_email})")
        
        self.stdout.write("\n=== CREDENTIAL FIX COMPLETE ===")