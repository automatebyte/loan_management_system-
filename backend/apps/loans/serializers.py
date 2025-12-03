from rest_framework import serializers
from .models import LoanProduct, Loan, Payment, Transaction
from apps.accounts.models import Client

class LoanProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanProduct
        fields = '__all__'
        read_only_fields = ['company']

class LoanApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loan
        fields = ['product', 'amount', 'term_months']
    
    def create(self, validated_data):
        validated_data['company'] = self.context['request'].user.company
        validated_data['client'] = self.context['request'].user.client
        validated_data['interest_rate'] = validated_data['product'].interest_rate
        return super().create(validated_data)

class LoanSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.user.get_full_name', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = Loan
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class TransactionSerializer(serializers.ModelSerializer):
    processed_by_name = serializers.CharField(source='processed_by.get_full_name', read_only=True)
    
    class Meta:
        model = Transaction
        fields = ['id', 'amount', 'transaction_type', 'transaction_date', 'notes', 'processed_by_name']
        read_only_fields = ['id', 'transaction_date', 'processed_by_name']