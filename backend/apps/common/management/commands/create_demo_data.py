from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.companies.models import Company
from apps.accounts.models import Client
from apps.loans.models import LoanProduct, Loan
from decimal import Decimal
from datetime import date, timedelta
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Create demo data for presentations'

    def handle(self, *args, **options):
        self.stdout.write('Creating demo data...')
        
        companies_data = [
            {
                'name': 'MicroFinance Plus',
                'admin_name': 'Sarah Johnson',
                'admin_email': 'sarah@microfinanceplus.com',
                'subscription_plan': 'professional',
                'monthly_fee': 299.00,
                'industry': 'microfinance'
            },
            {
                'name': 'Community Credit Union',
                'admin_name': 'Michael Chen',
                'admin_email': 'michael@communitycu.com',
                'subscription_plan': 'enterprise',
                'monthly_fee': 599.00,
                'industry': 'credit_union'
            }
        ]
        
        for company_data in companies_data:
            company, created = Company.objects.get_or_create(
                name=company_data['name'],
                defaults={
                    'admin_name': company_data['admin_name'],
                    'admin_email': company_data['admin_email'],
                    'subscription_plan': company_data['subscription_plan'],
                    'subscription_status': 'active',
                    'monthly_fee': company_data['monthly_fee'],
                    'industry': company_data['industry'],
                    'is_active': True,
                    'subscription_expiry': date.today() + timedelta(days=365)
                }
            )
            
            if created:
                admin_user, _ = User.objects.get_or_create(
                    username=company_data['admin_email'],
                    defaults={
                        'email': company_data['admin_email'],
                        'first_name': company_data['admin_name'].split()[0],
                        'last_name': company_data['admin_name'].split()[-1],
                        'role': 'company_admin',
                        'company': company,
                        'is_active': True
                    }
                )
                admin_user.set_password('demo123')
                admin_user.save()
                
                officer, _ = User.objects.get_or_create(
                    username=f'officer@{company.name.lower().replace(" ", "")}.com',
                    defaults={
                        'email': f'officer@{company.name.lower().replace(" ", "")}.com',
                        'first_name': 'John',
                        'last_name': 'Officer',
                        'role': 'loan_officer',
                        'company': company,
                        'is_active': True
                    }
                )
                officer.set_password('demo123')
                officer.save()
                
                LoanProduct.objects.get_or_create(
                    company=company,
                    name='Personal Loan',
                    defaults={
                        'interest_rate': 12.5,
                        'min_amount': 1000,
                        'max_amount': 50000,
                        'min_term_months': 6,
                        'max_term_months': 60,
                        'penalty_rate': 5.0
                    }
                )
        
        self.stdout.write(self.style.SUCCESS('Demo data created!'))