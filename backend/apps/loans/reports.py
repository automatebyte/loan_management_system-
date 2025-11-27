from django.db.models import Sum, Count, Q
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Loan, Payment
from apps.accounts.permissions import IsLoanOfficer

@api_view(['GET'])
def loan_summary(request):
    company = request.user.company
    
    total_loans = Loan.objects.filter(company=company).count()
    active_loans = Loan.objects.filter(company=company, status='active').count()
    total_disbursed = Loan.objects.filter(
        company=company, 
        status__in=['disbursed', 'active', 'completed']
    ).aggregate(Sum('amount'))['amount__sum'] or 0
    
    pending_approvals = Loan.objects.filter(company=company, status='pending').count()
    
    return Response({
        'total_loans': total_loans,
        'active_loans': active_loans,
        'total_disbursed': float(total_disbursed),
        'pending_approvals': pending_approvals
    })