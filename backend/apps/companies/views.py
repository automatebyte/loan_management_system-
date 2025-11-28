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
        total_companies = Company.objects.count()
        active_companies = Company.objects.filter(is_active=True).count()
        recent_companies = Company.objects.filter(
            created_at__gte=timezone.now() - timezone.timedelta(days=30)
        ).count()
        
        # Subscription breakdown
        subscription_stats = Company.objects.values('subscription_plan').annotate(
            count=Count('id')
        )
        
        return Response({
            'total_companies': total_companies,
            'active_companies': active_companies,
            'recent_companies': recent_companies,
            'subscription_breakdown': list(subscription_stats)
        })
    
    @action(detail=False, methods=['get'], permission_classes=[IsCompanyAdmin])
    def my_company(self, request):
        if hasattr(request.user, 'company') and request.user.company:
            serializer = self.get_serializer(request.user.company)
            return Response(serializer.data)
        return Response({'error': 'No company associated'}, status=400)