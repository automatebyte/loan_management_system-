from rest_framework import serializers
from .models import LoanProduct, Loan, Payment, Transaction, PaymentSchedule, Expense
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

class PaymentScheduleSerializer(serializers.ModelSerializer):
    loan_id = serializers.CharField(source='loan.loan_id', read_only=True)
    client_name = serializers.CharField(source='loan.client.user.get_full_name', read_only=True)
    
    class Meta:
        model = PaymentSchedule
        fields = ['id', 'loan', 'loan_id', 'client_name', 'due_date', 'amount_due', 'amount_paid', 'status']

class ExpenseSerializer(serializers.ModelSerializer):
    recorded_by_name = serializers.CharField(source='recorded_by.get_full_name', read_only=True)
    
    class Meta:
        model = Expense
        fields = ['id', 'date', 'category', 'amount', 'description', 'receipt', 'recorded_by', 'recorded_by_name']
        read_only_fields = ['recorded_by', 'recorded_by_name']