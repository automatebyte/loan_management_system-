from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import LoanProduct, Loan, Payment, Transaction
from .serializers import LoanProductSerializer, LoanApplicationSerializer, LoanSerializer, PaymentSerializer, TransactionSerializer
from apps.accounts.permissions import IsLoanOfficer, IsClient, IsSameCompany, IsCompanyAdmin
from .tasks import send_loan_notification

class LoanProductViewSet(viewsets.ModelViewSet):
    serializer_class = LoanProductSerializer
    permission_classes = [IsCompanyAdmin]
    
    def get_queryset(self):
        if self.request.user.role == 'super_admin':
            return LoanProduct.objects.all()
        return LoanProduct.objects.filter(company=self.request.user.company)
    
    def perform_create(self, serializer):
        serializer.save(company=self.request.user.company)
    
    @action(detail=False, methods=['get'], permission_classes=[IsLoanOfficer])
    def available_products(self, request):
        """Get available loan products for loan officers"""
        products = LoanProduct.objects.filter(
            company=request.user.company,
            is_active=True
        )
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

class LoanViewSet(viewsets.ModelViewSet):
    serializer_class = LoanSerializer
    permission_classes = [IsSameCompany]
    
    def get_queryset(self):
        if self.request.user.role == 'client':
            return Loan.objects.filter(client__user=self.request.user)
        return Loan.objects.filter(company=self.request.user.company)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return LoanApplicationSerializer
        return LoanSerializer
    
    @action(detail=True, methods=['post'], permission_classes=[IsLoanOfficer])
    def approve(self, request, pk=None):
        loan = self.get_object()
        loan.status = 'approved'
        loan.approval_date = timezone.now()
        loan.loan_officer = request.user
        loan.save()
        send_loan_notification.delay(loan.id, 'approved')
        return Response({'status': 'approved'})
    
    @action(detail=True, methods=['post'], permission_classes=[IsLoanOfficer])
    def disburse(self, request, pk=None):
        loan = self.get_object()
        if loan.status != 'approved':
            return Response({'error': 'Loan must be approved first'}, status=400)
        
        # Create disbursement transaction
        Transaction.objects.create(
            loan=loan,
            amount=loan.amount,
            transaction_type='disbursement',
            processed_by=request.user,
            notes=f'Loan disbursed by {request.user.get_full_name()}'
        )
        
        loan.status = 'disbursed'
        loan.disbursement_date = timezone.now()
        loan.save()
        send_loan_notification.delay(loan.id, 'disbursed')
        return Response({'status': 'disbursed'})
    
    @action(detail=True, methods=['post'], permission_classes=[IsLoanOfficer])
    def record_repayment(self, request, pk=None):
        loan = self.get_object()
        amount = request.data.get('amount')
        notes = request.data.get('notes', '')
        
        if not amount:
            return Response({'error': 'Amount is required'}, status=400)
        
        # Create repayment transaction
        Transaction.objects.create(
            loan=loan,
            amount=amount,
            transaction_type='repayment',
            processed_by=request.user,
            notes=notes
        )
        
        # Update loan balance
        loan.outstanding_balance -= float(amount)
        if loan.outstanding_balance <= 0:
            loan.status = 'completed'
            loan.outstanding_balance = 0
        
        loan.save()
        return Response({'status': 'payment_recorded', 'new_balance': loan.outstanding_balance})

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsLoanOfficer]
    
    def get_queryset(self):
        return Payment.objects.filter(loan__company=self.request.user.company)