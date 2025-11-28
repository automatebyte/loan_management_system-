from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from django.utils import timezone
from .models import Company
from .serializers import CompanySerializer, CompanyCreateSerializer
from apps.accounts.permissions import IsSuperAdmin, IsCompanyAdmin

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    permission_classes = [IsSuperAdmin]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CompanyCreateSerializer
        return CompanySerializer
    
    def get_queryset(self):
        if self.request.user.role == 'super_admin':
            return Company.objects.all()
        elif hasattr(self.request.user, 'company'):
            return Company.objects.filter(id=self.request.user.company.id)
        return Company.objects.none()
    
    @action(detail=False, methods=['get'], permission_classes=[IsSuperAdmin])
    def dashboard_stats(self, request):
        """Super Admin dashboard statistics"""
        from django.db.models import Sum
        from datetime import date, timedelta
        
        total_companies = Company.objects.count()
        active_subscriptions = Company.objects.filter(subscription_status='active').count()
        
        # Pending renewals (expiring in next 30 days)
        pending_renewals = Company.objects.filter(
            subscription_expiry__lte=date.today() + timedelta(days=30),
            subscription_status='active'
        ).count()
        
        # Overdue payments (past next_payment_date)
        overdue_payments = Company.objects.filter(
            next_payment_date__lt=date.today(),
            subscription_status__in=['active', 'trial']
        ).count()
        
        # Monthly revenue
        monthly_revenue = Company.objects.filter(
            subscription_status='active'
        ).aggregate(Sum('monthly_fee'))['monthly_fee__sum'] or 0
        
        # Recent activity
        recent_companies = Company.objects.filter(
            created_at__gte=timezone.now() - timezone.timedelta(days=30)
        ).count()
        
        # Subscription breakdown
        subscription_stats = Company.objects.values('subscription_plan').annotate(
            count=Count('id')
        )
        
        # Status breakdown
        status_stats = Company.objects.values('subscription_status').annotate(
            count=Count('id')
        )
        
        return Response({
            'total_companies': total_companies,
            'active_subscriptions': active_subscriptions,
            'pending_renewals': pending_renewals,
            'overdue_payments': overdue_payments,
            'monthly_revenue': float(monthly_revenue),
            'recent_companies': recent_companies,
            'subscription_breakdown': list(subscription_stats),
            'status_breakdown': list(status_stats)
        })
    
    @action(detail=True, methods=['post'], permission_classes=[IsSuperAdmin])
    def update_payment_status(self, request, pk=None):
        """Update payment status for a company"""
        company = self.get_object()
        from datetime import date, timedelta
        
        company.last_payment_date = date.today()
        company.next_payment_date = date.today() + timedelta(days=30)
        company.subscription_status = 'active'
        company.save()
        
        return Response({'status': 'payment_updated'})
    
    @action(detail=True, methods=['post'], permission_classes=[IsSuperAdmin])
    def suspend_service(self, request, pk=None):
        """Suspend company service"""
        company = self.get_object()
        company.subscription_status = 'suspended'
        company.is_active = False
        company.save()
        
        return Response({'status': 'suspended'})
    
    @action(detail=True, methods=['post'], permission_classes=[IsSuperAdmin])
    def activate_service(self, request, pk=None):
        """Activate company service"""
        company = self.get_object()
        company.subscription_status = 'active'
        company.is_active = True
        company.save()
        
        return Response({'status': 'activated'})
    
    @action(detail=False, methods=['get'], permission_classes=[IsCompanyAdmin])
    def my_company(self, request):
        if hasattr(request.user, 'company') and request.user.company:
            serializer = self.get_serializer(request.user.company)
            return Response(serializer.data)
        return Response({'error': 'No company associated'}, status=400)