from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import LoanProduct, Loan, Payment
from .serializers import LoanProductSerializer, LoanApplicationSerializer, LoanSerializer, PaymentSerializer
from apps.accounts.permissions import IsLoanOfficer, IsClient, IsSameCompany
from .tasks import send_loan_notification

class LoanProductViewSet(viewsets.ModelViewSet):
    serializer_class = LoanProductSerializer
    permission_classes = [IsLoanOfficer]
    
    def get_queryset(self):
        return LoanProduct.objects.filter(company=self.request.user.company)
    
    def perform_create(self, serializer):
        serializer.save(company=self.request.user.company)

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
        loan.status = 'disbursed'
        loan.disbursement_date = timezone.now()
        loan.save()
        send_loan_notification.delay(loan.id, 'disbursed')
        return Response({'status': 'disbursed'})

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsLoanOfficer]
    
    def get_queryset(self):
        return Payment.objects.filter(loan__company=self.request.user.company)