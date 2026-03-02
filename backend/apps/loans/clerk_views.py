from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Sum, Q
from .models import PaymentSchedule, Expense, Loan
from .serializers import PaymentScheduleSerializer, ExpenseSerializer
from apps.accounts.permissions import IsClerk

class DuesViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsClerk]
    serializer_class = PaymentScheduleSerializer
    
    def get_queryset(self):
        return PaymentSchedule.objects.filter(status__in=['pending', 'overdue'])
    
    @action(detail=False, methods=['get'])
    def daily(self, request):
        date_str = request.query_params.get('date', timezone.now().date())
        dues = PaymentSchedule.objects.filter(due_date=date_str)
        serializer = self.get_serializer(dues, many=True)
        total = dues.aggregate(total=Sum('amount_due'))['total'] or 0
        return Response({'dues': serializer.data, 'total_due': total})

class ExpenseViewSet(viewsets.ModelViewSet):
    permission_classes = [IsClerk]
    serializer_class = ExpenseSerializer
    queryset = Expense.objects.all()
    
    def perform_create(self, serializer):
        serializer.save(recorded_by=self.request.user)

class DebtAnalysisViewSet(viewsets.ViewSet):
    permission_classes = [IsClerk]
    
    @action(detail=False, methods=['get'])
    def unpaid(self, request):
        loans = Loan.objects.filter(outstanding_balance__gt=0, status='active')
        data = [{
            'loan_id': loan.loan_id,
            'client_name': loan.client.user.get_full_name(),
            'outstanding_balance': loan.outstanding_balance,
            'status': loan.status
        } for loan in loans]
        return Response(data)
    
    @action(detail=False, methods=['get'])
    def paid(self, request):
        loans = Loan.objects.filter(outstanding_balance=0, status='completed')
        data = [{
            'loan_id': loan.loan_id,
            'client_name': loan.client.user.get_full_name(),
            'amount': loan.amount,
            'status': loan.status
        } for loan in loans]
        return Response(data)
    
    @action(detail=False, methods=['get'])
    def report(self, request):
        total_outstanding = Loan.objects.filter(status='active').aggregate(
            total=Sum('outstanding_balance'))['total'] or 0
        total_completed = Loan.objects.filter(status='completed').count()
        total_active = Loan.objects.filter(status='active').count()
        
        return Response({
            'total_outstanding': total_outstanding,
            'total_completed': total_completed,
            'total_active': total_active,
            'collection_rate': round((total_completed / (total_completed + total_active) * 100), 2) if (total_completed + total_active) > 0 else 0
        })
