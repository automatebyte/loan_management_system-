from django.core.management.base import BaseCommand
from apps.companies.models import Company
from apps.accounts.models import User
from django.conf import settings

class Command(BaseCommand):
    help = 'Debug company registration flow'

    def handle(self, *args, **options):
        self.stdout.write("=== COMPANY REGISTRATION DEBUG REPORT ===\n")
        
        # 1. Check all companies
        self.stdout.write("1. ALL COMPANIES IN DATABASE:")
        companies = Company.objects.all()
        if not companies:
            self.stdout.write("   [ERROR] NO COMPANIES FOUND IN DATABASE")
            return
        
        for company in companies:
            self.stdout.write(f"   Company: {company.name}")
            self.stdout.write(f"   Status: {company.subscription_status}")
            self.stdout.write(f"   Admin Email: {company.admin_email}")
            self.stdout.write(f"   Created: {company.created_at}")
            self.stdout.write(f"   Active: {company.is_active}")
            self.stdout.write("   ---")
        
        # 2. Check users for each company
        self.stdout.write("\n2. USERS FOR EACH COMPANY:")
        for company in companies:
            users = User.objects.filter(company=company)
            self.stdout.write(f"   Company: {company.name}")
            if users:
                for user in users:
                    self.stdout.write(f"     [OK] User: {user.username} ({user.email}) - Role: {user.role}")
                    self.stdout.write(f"        Active: {user.is_active}, Last Login: {user.last_login}")
            else:
                self.stdout.write(f"     [ERROR] NO USERS FOUND FOR {company.name}")
            self.stdout.write("   ---")
        
        # 3. Check approved companies without users
        self.stdout.write("\n3. APPROVED COMPANIES WITHOUT ADMIN USERS:")
        approved_companies = Company.objects.filter(subscription_status__in=['active', 'trial'])
        orphaned_companies = []
        
        for company in approved_companies:
            admin_users = User.objects.filter(company=company, role='company_admin')
            if not admin_users:
                orphaned_companies.append(company)
                self.stdout.write(f"   [ERROR] {company.name} - APPROVED BUT NO ADMIN USER")
        
        if not orphaned_companies:
            self.stdout.write("   [OK] All approved companies have admin users")
        
        # 4. Check pending companies
        self.stdout.write("\n4. PENDING APPROVAL COMPANIES:")
        pending_companies = Company.objects.filter(subscription_status='pending_approval')
        if pending_companies:
            for company in pending_companies:
                self.stdout.write(f"   [PENDING] {company.name} - Waiting for approval")
        else:
            self.stdout.write("   [OK] No companies pending approval")
        
        # 5. Check email configuration
        self.stdout.write("\n5. EMAIL CONFIGURATION CHECK:")
        self.stdout.write(f"   Email Backend: {settings.EMAIL_BACKEND}")
        self.stdout.write(f"   Email Host: {settings.EMAIL_HOST}")
        self.stdout.write(f"   Email Port: {settings.EMAIL_PORT}")
        self.stdout.write(f"   Email User: {settings.EMAIL_HOST_USER}")
        self.stdout.write(f"   Default From: {settings.DEFAULT_FROM_EMAIL}")
        
        if not settings.EMAIL_HOST_USER:
            self.stdout.write("   [ERROR] EMAIL_HOST_USER not configured - emails won't send")
        else:
            self.stdout.write("   [OK] Email appears configured")
        
        # 6. Test credential generation
        self.stdout.write("\n6. TESTING CREDENTIAL GENERATION:")
        try:
            from apps.common.utils import generate_secure_password, generate_username
            test_password = generate_secure_password()
            test_username = generate_username("test@example.com", 1)
            self.stdout.write(f"   [OK] Password generation works: {test_password}")
            self.stdout.write(f"   [OK] Username generation works: {test_username}")
        except Exception as e:
            self.stdout.write(f"   [ERROR] Credential generation failed: {e}")
        
        # 7. Summary and recommendations
        self.stdout.write("\n=== SUMMARY & RECOMMENDATIONS ===")
        
        total_companies = companies.count()
        approved_companies_count = Company.objects.filter(subscription_status__in=['active', 'trial']).count()
        orphaned_count = len(orphaned_companies)
        
        self.stdout.write(f"Total Companies: {total_companies}")
        self.stdout.write(f"Approved Companies: {approved_companies_count}")
        self.stdout.write(f"Companies Missing Admin Users: {orphaned_count}")
        
        if orphaned_count > 0:
            self.stdout.write("\n[CRITICAL] ISSUE: Approved companies without admin users")
            self.stdout.write("   SOLUTION: Run fix_company_credentials command to create missing users")
        
        if not settings.EMAIL_HOST_USER:
            self.stdout.write("\n[WARNING] Email not configured")
            self.stdout.write("   SOLUTION: Set EMAIL_HOST_USER and EMAIL_HOST_PASSWORD in environment")
        
        self.stdout.write("\n=== END DEBUG REPORT ===")