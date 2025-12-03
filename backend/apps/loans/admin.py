from django.contrib import admin
from .models import LoanProduct, Loan, Payment

@admin.register(LoanProduct)
class LoanProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'company', 'interest_rate', 'min_amount', 'max_amount']
    list_filter = ['company']

@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    list_display = ['loan_id', 'client', 'company', 'amount', 'status']
    list_filter = ['company', 'status', 'product']

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['loan', 'amount', 'payment_date', 'payment_type']
    list_filter = ['payment_type']