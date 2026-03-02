from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta
from apps.accounts.models import User, Client
from apps.loans.models import Loan, Payment, Expense

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_reports(request):
    if request.user.role != 'admin':
        return Response({'error': 'Unauthorized'}, status=403)
    
    today = timezone.now().date()
    month_start = today.replace(day=1)
    
    field_officers = User.objects.filter(role='field_officer')
    officer_performance = []
    
    for officer in field_officers:
        loans = Loan.objects.filter(loan_officer=officer)
        month_loans = loans.filter(created_at__gte=month_start)
        
        officer_performance.append({
            'officer_id': officer.id,
            'officer_name': officer.get_full_name(),
            'total_loans': loans.count(),
            'month_loans': month_loans.count(),
            'total_disbursed': loans.filter(status='disbursed').aggregate(Sum('amount'))['amount__sum'] or 0,
            'month_disbursed': month_loans.filter(status='disbursed').aggregate(Sum('amount'))['amount__sum'] or 0,
            'active_loans': loans.filter(status__in=['approved', 'disbursed']).count(),
            'clients_count': Client.objects.filter(loan_officer=officer).count()
        })
    
    return Response({
        'officer_performance': officer_performance,
        'summary': {
            'total_officers': field_officers.count(),
            'total_loans': Loan.objects.count(),
            'month_loans': Loan.objects.filter(created_at__gte=month_start).count(),
            'total_disbursed': Loan.objects.filter(status='disbursed').aggregate(Sum('amount'))['amount__sum'] or 0
        }
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def clerk_reports(request):
    if request.user.role != 'clerk':
        return Response({'error': 'Unauthorized'}, status=403)
    
    today = timezone.now().date()
    
    dues_today = Payment.objects.filter(due_date=today, status='pending')
    overdue = Payment.objects.filter(due_date__lt=today, status='pending')
    expenses_today = Expense.objects.filter(date=today)
    
    return Response({
        'daily_expenses': {
            'total': expenses_today.aggregate(Sum('amount'))['amount__sum'] or 0,
            'count': expenses_today.count(),
            'items': list(expenses_today.values('description', 'amount', 'category'))
        },
        'dues': {
            'today': {
                'count': dues_today.count(),
                'amount': dues_today.aggregate(Sum('amount'))['amount__sum'] or 0
            },
            'overdue': {
                'count': overdue.count(),
                'amount': overdue.aggregate(Sum('amount'))['amount__sum'] or 0
            }
        },
        'pending_debts': {
            'total': Loan.objects.filter(status='disbursed').aggregate(Sum('outstanding_balance'))['outstanding_balance__sum'] or 0,
            'count': Loan.objects.filter(status='disbursed', outstanding_balance__gt=0).count()
        }
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def field_officer_reports(request):
    if request.user.role != 'field_officer':
        return Response({'error': 'Unauthorized'}, status=403)
    
    loans = Loan.objects.filter(loan_officer=request.user)
    today = timezone.now().date()
    
    return Response({
        'summary': {
            'total_loans': loans.count(),
            'active_loans': loans.filter(status__in=['approved', 'disbursed']).count(),
            'total_disbursed': loans.filter(status='disbursed').aggregate(Sum('amount'))['amount__sum'] or 0,
            'outstanding_balance': loans.aggregate(Sum('outstanding_balance'))['outstanding_balance__sum'] or 0,
            'clients_count': Client.objects.filter(loan_officer=request.user).count()
        },
        'daily_disbursement': loans.filter(disbursement_date=today).aggregate(Sum('amount'))['amount__sum'] or 0,
        'loans_by_status': {
            'pending': loans.filter(status='pending').count(),
            'approved': loans.filter(status='approved').count(),
            'disbursed': loans.filter(status='disbursed').count(),
            'rejected': loans.filter(status='rejected').count()
        }
    })
