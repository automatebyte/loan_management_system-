from rest_framework import serializers
from django.utils.text import slugify
from .models import Company
from apps.accounts.models import User

class CompanySerializer(serializers.ModelSerializer):
    user_count = serializers.SerializerMethodField()
    loan_count = serializers.SerializerMethodField()
    active_loans = serializers.SerializerMethodField()
    total_disbursed = serializers.SerializerMethodField()
    payment_status = serializers.SerializerMethodField()
    
    class Meta:
        model = Company
        fields = ['id', 'name', 'slug', 'email', 'phone', 'address', 'logo', 
                 'max_users', 'max_loans', 'subscription_plan', 'subscription_status',
                 'monthly_fee', 'subscription_expiry', 'last_payment_date', 'next_payment_date',
                 'admin_email', 'admin_name', 'last_login', 'is_active', 'created_at', 
                 'user_count', 'loan_count', 'active_loans', 'total_disbursed', 'payment_status']
        read_only_fields = ['id', 'slug', 'created_at', 'user_count', 'loan_count', 
                           'active_loans', 'total_disbursed', 'payment_status']
    
    def get_user_count(self, obj):
        return User.objects.filter(company=obj).count()
    
    def get_loan_count(self, obj):
        from apps.loans.models import Loan
        return Loan.objects.filter(company=obj).count()
    
    def get_active_loans(self, obj):
        from apps.loans.models import Loan
        return Loan.objects.filter(company=obj, status__in=['active', 'disbursed']).count()
    
    def get_total_disbursed(self, obj):
        from apps.loans.models import Loan
        from django.db.models import Sum
        result = Loan.objects.filter(
            company=obj, 
            status__in=['disbursed', 'active', 'completed']
        ).aggregate(Sum('amount'))['amount__sum']
        return float(result) if result else 0.0
    
    def get_payment_status(self, obj):
        from datetime import date
        if not obj.next_payment_date:
            return 'pending'
        if obj.next_payment_date < date.today():
            return 'overdue'
        return 'paid'

class CompanyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['name', 'email', 'phone', 'address', 'admin_email', 'admin_name',
                 'subscription_plan', 'subscription_status', 'monthly_fee', 
                 'subscription_expiry', 'max_users', 'max_loans']
    
    def create(self, validated_data):
        from datetime import date, timedelta
        validated_data['slug'] = slugify(validated_data['name'])
        
        # Set default payment dates for new companies
        if validated_data.get('subscription_status') == 'active':
            validated_data['last_payment_date'] = date.today()
            validated_data['next_payment_date'] = date.today() + timedelta(days=30)
        
        return super().create(validated_data)