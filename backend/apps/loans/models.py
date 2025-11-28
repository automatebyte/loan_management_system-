from django.db import models
from decimal import Decimal
from apps.common.models import BaseModel
from .utils import generate_loan_id

class LoanProduct(BaseModel):
    """Loan product configuration per company"""
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2)
    penalty_rate = models.DecimalField(max_digits=5, decimal_places=2, default=5.0)
    min_amount = models.DecimalField(max_digits=12, decimal_places=2)
    max_amount = models.DecimalField(max_digits=12, decimal_places=2)
    min_term_months = models.PositiveIntegerField()
    max_term_months = models.PositiveIntegerField()
    
    def __str__(self):
        return f"{self.company.name} - {self.name}"

class Loan(BaseModel):
    """Core loan model"""
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE)
    client = models.ForeignKey('accounts.Client', on_delete=models.CASCADE)
    loan_officer = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True)
    product = models.ForeignKey(LoanProduct, on_delete=models.CASCADE)
    
    loan_id = models.CharField(max_length=20, unique=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2)
    term_months = models.PositiveIntegerField()
    monthly_payment = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    outstanding_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('disbursed', 'Disbursed'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('defaulted', 'Defaulted'),
    ], default='pending')
    
    application_date = models.DateTimeField(auto_now_add=True)
    approval_date = models.DateTimeField(null=True, blank=True)
    disbursement_date = models.DateTimeField(null=True, blank=True)
    
    def save(self, *args, **kwargs):
        if not self.loan_id:
            self.loan_id = generate_loan_id()
        if not self.outstanding_balance:
            self.outstanding_balance = self.amount
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.loan_id} - {self.client.user.get_full_name()}"

class Transaction(BaseModel):
    """Financial transaction model for loan disbursements and repayments"""
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    transaction_type = models.CharField(max_length=20, choices=[
        ('disbursement', 'Disbursement'),
        ('repayment', 'Repayment'),
        ('penalty', 'Penalty'),
    ])
    transaction_date = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)
    processed_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True)
    
    def __str__(self):
        return f"{self.loan.loan_id} - {self.transaction_type} - {self.amount}"

class Payment(BaseModel):
    """Loan payment tracking"""
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_date = models.DateTimeField()
    payment_type = models.CharField(max_length=20, choices=[
        ('principal', 'Principal'),
        ('interest', 'Interest'),
        ('penalty', 'Penalty'),
    ])
    
    def __str__(self):
        return f"{self.loan.loan_id} - {self.amount}"