#!/usr/bin/env python
"""
Debug script to investigate company registration issues
"""
import os
import sys
import django

# Setup Django
sys.path.append('/home/autobyte/Development/Portfolio/loan_management_system/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from apps.companies.models import Company
from apps.accounts.models import User
from django.contrib.auth import get_user_model

def debug_registration_flow():
    print("=== COMPANY REGISTRATION DEBUG REPORT ===\n")
    
    # 1. Check all companies
    print("1. ALL COMPANIES IN DATABASE:")
    companies = Company.objects.all()
    if not companies:
        print("   ❌ NO COMPANIES FOUND IN DATABASE")
        return
    
    for company in companies:
        print(f"   Company: {company.name}")
        print(f"   Status: {company.subscription_status}")
        print(f"   Admin Email: {company.admin_email}")
        print(f"   Created: {company.created_at}")
        print(f"   Active: {company.is_active}")
        print("   ---")
    
    # 2. Check users for each company
    print("\n2. USERS FOR EACH COMPANY:")
    for company in companies:
        users = User.objects.filter(company=company)
        print(f"   Company: {company.name}")
        if users:
            for user in users:
                print(f"     ✅ User: {user.username} ({user.email}) - Role: {user.role}")
                print(f"        Active: {user.is_active}, Last Login: {user.last_login}")
        else:
            print(f"     ❌ NO USERS FOUND FOR {company.name}")
        print("   ---")
    
    # 3. Check approved companies without users
    print("\n3. APPROVED COMPANIES WITHOUT ADMIN USERS:")
    approved_companies = Company.objects.filter(subscription_status__in=['active', 'trial'])
    orphaned_companies = []
    
    for company in approved_companies:
        admin_users = User.objects.filter(company=company, role='company_admin')
        if not admin_users:
            orphaned_companies.append(company)
            print(f"   ❌ {company.name} - APPROVED BUT NO ADMIN USER")
    
    if not orphaned_companies:
        print("   ✅ All approved companies have admin users")
    
    # 4. Check pending companies
    print("\n4. PENDING APPROVAL COMPANIES:")
    pending_companies = Company.objects.filter(subscription_status='pending_approval')
    if pending_companies:
        for company in pending_companies:
            print(f"   📋 {company.name} - Waiting for approval")
    else:
        print("   ✅ No companies pending approval")
    
    # 5. Check email configuration
    print("\n5. EMAIL CONFIGURATION CHECK:")
    from django.conf import settings
    print(f"   Email Backend: {settings.EMAIL_BACKEND}")
    print(f"   Email Host: {settings.EMAIL_HOST}")
    print(f"   Email Port: {settings.EMAIL_PORT}")
    print(f"   Email User: {settings.EMAIL_HOST_USER}")
    print(f"   Default From: {settings.DEFAULT_FROM_EMAIL}")
    
    if not settings.EMAIL_HOST_USER:
        print("   ❌ EMAIL_HOST_USER not configured - emails won't send")
    else:
        print("   ✅ Email appears configured")
    
    # 6. Test credential generation
    print("\n6. TESTING CREDENTIAL GENERATION:")
    try:
        from apps.common.utils import generate_secure_password, generate_username
        test_password = generate_secure_password()
        test_username = generate_username("test@example.com", 1)
        print(f"   ✅ Password generation works: {test_password}")
        print(f"   ✅ Username generation works: {test_username}")
    except Exception as e:
        print(f"   ❌ Credential generation failed: {e}")
    
    # 7. Summary and recommendations
    print("\n=== SUMMARY & RECOMMENDATIONS ===")
    
    total_companies = companies.count()
    approved_companies_count = Company.objects.filter(subscription_status__in=['active', 'trial']).count()
    orphaned_count = len(orphaned_companies)
    
    print(f"Total Companies: {total_companies}")
    print(f"Approved Companies: {approved_companies_count}")
    print(f"Companies Missing Admin Users: {orphaned_count}")
    
    if orphaned_count > 0:
        print("\n🚨 CRITICAL ISSUE: Approved companies without admin users")
        print("   SOLUTION: Run fix_company_credentials.py to create missing users")
    
    if not settings.EMAIL_HOST_USER:
        print("\n⚠️  WARNING: Email not configured")
        print("   SOLUTION: Set EMAIL_HOST_USER and EMAIL_HOST_PASSWORD in environment")
    
    print("\n=== END DEBUG REPORT ===")

if __name__ == "__main__":
    debug_registration_flow()