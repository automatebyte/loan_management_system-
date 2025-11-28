from rest_framework import serializers
from django.utils.text import slugify
from .models import Company
from apps.accounts.models import User

class CompanySerializer(serializers.ModelSerializer):
    user_count = serializers.SerializerMethodField()
    loan_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Company
        fields = ['id', 'name', 'slug', 'email', 'phone', 'address', 'logo', 
                 'max_users', 'max_loans', 'subscription_plan', 'subscription_expiry', 
                 'admin_email', 'is_active', 'created_at', 'user_count', 'loan_count']
        read_only_fields = ['id', 'slug', 'created_at', 'user_count', 'loan_count']
    
    def get_user_count(self, obj):
        return User.objects.filter(company=obj).count()
    
    def get_loan_count(self, obj):
        from apps.loans.models import Loan
        return Loan.objects.filter(company=obj).count()

class CompanyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['name', 'email', 'phone', 'address', 'admin_email', 
                 'subscription_plan', 'subscription_expiry', 'max_users', 'max_loans']
    
    def create(self, validated_data):
        validated_data['slug'] = slugify(validated_data['name'])
        return super().create(validated_data)