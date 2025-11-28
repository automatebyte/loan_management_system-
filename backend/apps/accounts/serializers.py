from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Client

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
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone', 'role', 'company']
        read_only_fields = ['id']

class ClientSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    loan_officer_name = serializers.CharField(source='loan_officer.get_full_name', read_only=True)
    loan_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Client
        fields = ['id', 'client_id', 'full_name', 'email', 'date_of_birth', 'national_id',
                 'address', 'monthly_income', 'employment_status', 'identification_picture',
                 'loan_officer_name', 'loan_count', 'created_at', 'is_active']
        read_only_fields = ['client_id', 'full_name', 'email', 'loan_officer_name', 'loan_count']
    
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
    # User fields for creating both user and client
    username = serializers.CharField()
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    password = serializers.CharField(write_only=True, default='client123')
    
    class Meta:
        model = Client
        fields = ['username', 'email', 'first_name', 'last_name', 'password',
                 'date_of_birth', 'national_id', 'address', 'monthly_income', 
                 'employment_status', 'identification_picture']
    
    def create(self, validated_data):
        # Extract user data
        user_data = {
            'username': validated_data.pop('username'),
            'email': validated_data.pop('email'),
            'first_name': validated_data.pop('first_name'),
            'last_name': validated_data.pop('last_name'),
            'password': validated_data.pop('password', 'client123'),
            'role': 'client'
        }
        
        # Create user
        user = User.objects.create_user(**user_data)
        
        # Create client
        validated_data['user'] = user
        return super().create(validated_data)