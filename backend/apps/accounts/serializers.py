from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Client, Target, PerformanceMetric

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'phone', 'role']
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if not user:
            raise serializers.ValidationError('Invalid credentials')
        data['user'] = user
        return data

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone', 'role']
        read_only_fields = ['id']

class ClientSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.phone', read_only=True)
    loan_officer_name = serializers.CharField(source='loan_officer.get_full_name', read_only=True)
    loan_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Client
        fields = ['id', 'client_id', 'full_name', 'email', 'phone', 'date_of_birth', 'national_id',
                 'address', 'monthly_income', 'employment_status', 'occupation', 'industry',
                 'home_location', 'business_location', 'identification_picture',
                 'loan_officer_name', 'loan_count', 'next_of_kin', 'guarantor', 'created_at', 'is_active']
        read_only_fields = ['client_id', 'full_name', 'email', 'phone', 'loan_officer_name', 'loan_count']
    
    def get_loan_count(self, obj):
        return obj.loan_set.count()

class LoanOfficerSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone', 
                 'is_active', 'date_joined', 'full_name']
        read_only_fields = ['id', 'date_joined', 'full_name']
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username

class ClientCreateSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    phone = serializers.CharField()
    password = serializers.CharField(write_only=True, default='client123')
    next_of_kin = serializers.JSONField(required=False, default=list)
    guarantor = serializers.JSONField(required=False, default=dict)
    
    class Meta:
        model = Client
        fields = ['username', 'email', 'first_name', 'last_name', 'phone', 'password',
                 'date_of_birth', 'national_id', 'address', 'monthly_income', 
                 'employment_status', 'occupation', 'industry', 'home_location', 'business_location',
                 'identification_picture', 'next_of_kin', 'guarantor']
    
    def create(self, validated_data):
        user_data = {
            'username': validated_data.pop('username'),
            'email': validated_data.pop('email'),
            'first_name': validated_data.pop('first_name'),
            'last_name': validated_data.pop('last_name'),
            'phone': validated_data.pop('phone', ''),
            'password': validated_data.pop('password', 'client123'),
            'role': 'client'
        }
        user = User.objects.create_user(**user_data)
        validated_data['user'] = user
        return super().create(validated_data)

class TargetSerializer(serializers.ModelSerializer):
    field_officer_name = serializers.CharField(source='field_officer.get_full_name', read_only=True)
    achievement_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = Target
        fields = ['id', 'field_officer', 'field_officer_name', 'target_type', 'target_value', 
                 'achieved_value', 'period_start', 'period_end', 'achievement_percentage']
    
    def get_achievement_percentage(self, obj):
        if obj.target_value > 0:
            return round((obj.achieved_value / obj.target_value) * 100, 2)
        return 0

class PerformanceMetricSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = PerformanceMetric
        fields = ['id', 'user', 'user_name', 'metric_type', 'value', 'period']

class StaffSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone', 
                 'role', 'is_active', 'date_joined', 'full_name']
        read_only_fields = ['id', 'date_joined']
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username