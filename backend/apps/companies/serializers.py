from rest_framework import serializers
from .models import Company

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'slug', 'email', 'phone', 'address', 'logo', 'max_users', 'max_loans']
        read_only_fields = ['id', 'slug']