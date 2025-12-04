from django.core.management.base import BaseCommand
from apps.companies.models import Company
from apps.accounts.models import User
from apps.common.utils import create_company_admin

class Command(BaseCommand):
    help = 'Test company approval flow'

    def add_arguments(self, parser):
        parser.add_argument('--create-test', action='store_true', help='Create a test company')
        parser.add_argument('--approve-test', action='store_true', help='Approve test company')

    def handle(self, *args, **options):
        if options['create_test']:
            self.create_test_company()
        elif options['approve_test']:
            self.approve_test_company()
        else:
            self.show_usage()

    def create_test_company(self):
        """Create a test company for approval testing"""
        try:
            company = Company.objects.create(
                name="Test Company Ltd",
                admin_name="John Doe",
                admin_email="test@example.com",
                subscription_plan="professional",
                subscription_status="pending_approval",
                monthly_fee=299.00,
                business_registration="TEST123",
                industry="Technology",
                estimated_loan_volume="1-10M",
                is_active=False
            )
            
            self.stdout.write(f"[CREATED] Test company: {company.name} (ID: {company.id})")
            self.stdout.write(f"   Status: {company.subscription_status}")
            self.stdout.write(f"   Admin Email: {company.admin_email}")
            
        except Exception as e:
            self.stdout.write(f"[ERROR] Failed to create test company: {e}")

    def approve_test_company(self):
        """Test the approval flow"""
        try:
            # Find pending test company
            company = Company.objects.filter(
                name="Test Company Ltd",
                subscription_status="pending_approval"
            ).first()
            
            if not company:
                self.stdout.write("[ERROR] No test company found. Run with --create-test first.")
                return
            
            self.stdout.write(f"[TESTING] Approval for: {company.name}")
            
            # Test credential creation
            admin_user, temp_password = create_company_admin(company)
            
            # Update company status
            from datetime import date, timedelta
            company.subscription_status = 'trial'
            company.is_active = True
            company.subscription_expiry = date.today() + timedelta(days=14)
            company.save()
            
            self.stdout.write("[SUCCESS] APPROVAL TEST SUCCESSFUL!")
            self.stdout.write(f"   Company: {company.name}")
            self.stdout.write(f"   Status: {company.subscription_status}")
            self.stdout.write(f"   Admin Username: {admin_user.username}")
            self.stdout.write(f"   Admin Email: {admin_user.email}")
            self.stdout.write(f"   Admin Password: {temp_password}")
            self.stdout.write(f"   Login URL: https://kreditai.onrender.com/login")
            self.stdout.write(f"   Trial Expires: {company.subscription_expiry}")
            
            # Test email sending
            try:
                from apps.common.email_service import send_welcome_email
                send_welcome_email.delay(
                    user_email=admin_user.email,
                    user_name=company.admin_name,
                    company_name=company.name,
                    temp_password=temp_password
                )
                self.stdout.write("[EMAIL] Task queued successfully")
            except Exception as e:
                self.stdout.write(f"[WARNING] Email task failed: {e}")
            
        except Exception as e:
            self.stdout.write(f"[ERROR] Approval test failed: {e}")

    def show_usage(self):
        self.stdout.write("Usage:")
        self.stdout.write("  python manage.py test_approval --create-test")
        self.stdout.write("  python manage.py test_approval --approve-test")