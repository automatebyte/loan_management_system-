from rest_framework import serializers
from django.utils.text import slugify
from .models import Company
from apps.accounts.models import User

class CompanySerializer(serializers.ModelSerializer):
    user_count = serializers.SerializerMethodField()
    payment_status = serializers.SerializerMethodField()
    days_until_expiry = serializers.SerializerMethodField()
    
    class Meta:
        model = Company
        fields = ['id', 'name', 'slug', 'email', 'phone', 'address', 'logo', 
                 'max_users', 'subscription_plan', 'subscription_status',
                 'monthly_fee', 'subscription_expiry', 'last_payment_date', 'next_payment_date',
                 'admin_email', 'admin_name', 'last_login', 'is_active', 'created_at', 
                 'user_count', 'payment_status', 'days_until_expiry']
        read_only_fields = ['id', 'slug', 'created_at', 'user_count', 'payment_status', 'days_until_expiry']
    
    def get_user_count(self, obj):
        return User.objects.filter(company=obj).count()
    
    def get_payment_status(self, obj):
        from datetime import date
        if not obj.next_payment_date:
            return 'pending'
        if obj.next_payment_date < date.today():
            return 'overdue'
        return 'paid'
    
    def get_days_until_expiry(self, obj):
        from datetime import date
        if not obj.subscription_expiry:
            return None
        delta = obj.subscription_expiry - date.today()
        return delta.days if delta.days > 0 else 0

class CompanyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['name', 'email', 'phone', 'address', 'admin_email', 'admin_name',
                 'subscription_plan', 'subscription_status', 'monthly_fee', 
                 'subscription_expiry', 'max_users']
    
    def create(self, validated_data):
        from datetime import date, timedelta
        validated_data['slug'] = slugify(validated_data['name'])
        
        # Set default payment dates for new companies
        if validated_data.get('subscription_status') == 'active':
            validated_data['last_payment_date'] = date.today()
            validated_data['next_payment_date'] = date.today() + timedelta(days=30)
        
        return super().create(validated_data)