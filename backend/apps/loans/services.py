from decimal import Decimal, ROUND_HALF_UP
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from django.utils import timezone
from .models import Loan, Payment, Transaction

class LoanCalculationService:
    """Service for loan financial calculations"""
    
    @staticmethod
    def calculate_monthly_payment(principal, annual_rate, term_months):
        """Calculate monthly payment using standard loan formula"""
        if annual_rate == 0:
            return principal / term_months
        
        monthly_rate = annual_rate / 100 / 12
        payment = principal * (monthly_rate * (1 + monthly_rate) ** term_months) / \
                 ((1 + monthly_rate) ** term_months - 1)
        
        return Decimal(str(payment)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    
    @staticmethod
    def calculate_interest_amount(principal, annual_rate, days=30):
        """Calculate interest for given period"""
        daily_rate = annual_rate / 100 / 365
        interest = principal * Decimal(str(daily_rate)) * days
        return interest.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    
    @staticmethod
    def calculate_penalty(overdue_amount, penalty_rate, days_overdue):
        """Calculate penalty for overdue payments"""
        if days_overdue <= 0:
            return Decimal('0.00')
        
        daily_penalty_rate = penalty_rate / 100 / 365
        penalty = overdue_amount * Decimal(str(daily_penalty_rate)) * days_overdue
        return penalty.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    
    @staticmethod
    def generate_payment_schedule(loan):
        """Generate complete payment schedule for a loan"""
        schedule = []
        remaining_balance = loan.amount
        monthly_payment = loan.monthly_payment
        
        start_date = loan.disbursement_date or timezone.now().date()
        
        for month in range(1, loan.term_months + 1):
            payment_date = start_date + relativedelta(months=month)
            
            # Calculate interest for this period
            interest_amount = LoanCalculationService.calculate_interest_amount(
                remaining_balance, loan.interest_rate, 30
            )
            
            # Principal payment
            principal_amount = monthly_payment - interest_amount
            
            # Adjust for final payment
            if month == loan.term_months:
                principal_amount = remaining_balance
                monthly_payment = principal_amount + interest_amount
            
            remaining_balance -= principal_amount
            
            schedule.append({
                'payment_number': month,
                'payment_date': payment_date,
                'payment_amount': monthly_payment,
                'principal_amount': principal_amount,
                'interest_amount': interest_amount,
                'remaining_balance': remaining_balance
            })
        
        return schedule
    
    @staticmethod
    def process_payment(loan, payment_amount, payment_date=None):
        """Process a loan payment with proper allocation"""
        if not payment_date:
            payment_date = timezone.now()
        
        # Calculate any penalties first
        overdue_payments = Payment.objects.filter(
            loan=loan,
            payment_date__lt=payment_date,
            amount__gt=0
        ).count()
        
        penalty_amount = Decimal('0.00')
        if overdue_payments > 0:
            days_overdue = (payment_date.date() - loan.disbursement_date).days - (loan.term_months * 30)
            if days_overdue > 0:
                penalty_amount = LoanCalculationService.calculate_penalty(
                    loan.outstanding_balance, 
                    loan.product.penalty_rate, 
                    days_overdue
                )
        
        # Allocate payment: penalties first, then interest, then principal
        remaining_payment = payment_amount
        
        # Pay penalties
        penalty_paid = min(penalty_amount, remaining_payment)
        remaining_payment -= penalty_paid
        
        # Calculate current interest
        last_payment = Payment.objects.filter(loan=loan).order_by('-payment_date').first()
        days_since_last = 30  # Default to monthly
        if last_payment:
            days_since_last = (payment_date.date() - last_payment.payment_date.date()).days
        
        interest_due = LoanCalculationService.calculate_interest_amount(
            loan.outstanding_balance, loan.interest_rate, days_since_last
        )
        
        # Pay interest
        interest_paid = min(interest_due, remaining_payment)
        remaining_payment -= interest_paid
        
        # Pay principal
        principal_paid = min(loan.outstanding_balance, remaining_payment)
        
        # Update loan balance
        loan.outstanding_balance -= principal_paid
        loan.save()
        
        # Create payment records
        if penalty_paid > 0:
            Payment.objects.create(
                loan=loan,
                amount=penalty_paid,
                payment_date=payment_date,
                payment_type='penalty'
            )
        
        if interest_paid > 0:
            Payment.objects.create(
                loan=loan,
                amount=interest_paid,
                payment_date=payment_date,
                payment_type='interest'
            )
        
        if principal_paid > 0:
            Payment.objects.create(
                loan=loan,
                amount=principal_paid,
                payment_date=payment_date,
                payment_type='principal'
            )
        
        # Create transaction record
        Transaction.objects.create(
            loan=loan,
            amount=payment_amount,
            transaction_type='repayment',
            transaction_date=payment_date,
            notes=f'Payment allocation: Principal: {principal_paid}, Interest: {interest_paid}, Penalty: {penalty_paid}'
        )
        
        # Update loan status if fully paid
        if loan.outstanding_balance <= 0:
            loan.status = 'completed'
            loan.save()
        
        return {
            'principal_paid': principal_paid,
            'interest_paid': interest_paid,
            'penalty_paid': penalty_paid,
            'remaining_balance': loan.outstanding_balance
        }