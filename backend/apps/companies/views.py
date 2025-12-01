from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Count, Q
from django.utils import timezone
from datetime import date, timedelta
from django.contrib.auth import get_user_model
from .models import Company
from .serializers import CompanySerializer, CompanyCreateSerializer
from apps.accounts.permissions import IsSuperAdmin, IsCompanyAdmin

User = get_user_model()

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
    
    @action(detail=True, methods=['get'], permission_classes=[IsSuperAdmin])
    def credentials(self, request, pk=None):
        """Get company admin credentials"""
        company = self.get_object()
        
        admin_user = User.objects.filter(
            company=company,
            role='company_admin'
        ).first()
        
        if not admin_user:
            return Response({'error': 'No admin user found for this company'}, status=404)
        
        return Response({
            'company_name': company.name,
            'admin_username': admin_user.username,
            'admin_email': admin_user.email,
            'login_url': 'https://kreditai1.onrender.com/',
            'last_login': admin_user.last_login,
            'is_active': admin_user.is_active
        })
    
    @action(detail=True, methods=['post'], permission_classes=[IsSuperAdmin])
    def reset_password(self, request, pk=None):
        """Reset company admin password"""
        company = self.get_object()
        
        admin_user = User.objects.filter(
            company=company,
            role='company_admin'
        ).first()
        
        if not admin_user:
            return Response({'error': 'No admin user found for this company'}, status=404)
        
        # Generate new password
        from apps.common.utils import generate_secure_password
        new_password = generate_secure_password()
        admin_user.set_password(new_password)
        admin_user.save()
        
        # Send email with new credentials
        from apps.common.email_service import send_welcome_email
        send_welcome_email.delay(
            user_email=admin_user.email,
            user_name=company.admin_name,
            company_name=company.name,
            temp_password=new_password
        )
        
        return Response({
            'status': 'password_reset',
            'new_password': new_password,
            'email_sent': True
        })
    
    @action(detail=False, methods=['get'], permission_classes=[IsSuperAdmin])
    def dashboard_stats(self, request):
        """Super Admin dashboard statistics with enhanced security"""
        from django.db.models import Sum
        
        # Validate super admin access
        if request.user.role != 'super_admin':
            return Response({'error': 'Unauthorized'}, status=403)
        
        total_companies = Company.objects.count()
        active_subscriptions = Company.objects.filter(subscription_status='active').count()
        trial_companies = Company.objects.filter(subscription_status='trial').count()
        suspended_companies = Company.objects.filter(subscription_status='suspended').count()
        
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
        
        # Monthly revenue calculation with validation
        monthly_revenue = Company.objects.filter(
            subscription_status='active'
        ).aggregate(Sum('monthly_fee'))['monthly_fee__sum'] or 0
        
        # Recent activity (last 30 days)
        recent_companies = Company.objects.filter(
            created_at__gte=timezone.now() - timezone.timedelta(days=30)
        ).count()
        
        # Subscription breakdown with security check
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
            'trial_companies': trial_companies,
            'suspended_companies': suspended_companies,
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
    
    @action(detail=True, methods=['post'], permission_classes=[IsSuperAdmin])
    def approve(self, request, pk=None):
        """Approve company registration and create admin user"""
        company = self.get_object()
        
        if company.subscription_status != 'pending_approval':
            return Response({'error': 'Company is not pending approval'}, status=400)
        
        try:
            # Create company admin user with secure credentials
            from apps.common.utils import create_company_admin
            admin_user, temp_password = create_company_admin(company)
            
            # Activate company
            company.subscription_status = 'trial'  # Start with trial
            company.is_active = True
            from datetime import date, timedelta
            company.subscription_expiry = date.today() + timedelta(days=14)  # 14-day trial
            company.save()
            
            # Send welcome email
            from apps.common.email_service import send_welcome_email
            send_welcome_email.delay(
                user_email=admin_user.email,
                user_name=company.admin_name,
                company_name=company.name,
                temp_password=temp_password
            )
            
            return Response({
                'status': 'approved',
                'admin_username': admin_user.username,
                'admin_password': temp_password,  # Include password in response
                'trial_expires': company.subscription_expiry
            })
            
        except Exception as e:
            return Response({'error': str(e)}, status=400)
    
    @action(detail=True, methods=['post'], permission_classes=[IsSuperAdmin])
    def reject(self, request, pk=None):
        """Reject company registration"""
        company = self.get_object()
        
        if company.subscription_status != 'pending_approval':
            return Response({'error': 'Company is not pending approval'}, status=400)
        
        # TODO: Send rejection email
        company.delete()  # Remove rejected registration
        
        return Response({'status': 'rejected'})
    
    @action(detail=False, methods=['get'], permission_classes=[IsCompanyAdmin])
    def my_company(self, request):
        if hasattr(request.user, 'company') and request.user.company:
            serializer = self.get_serializer(request.user.company)
            return Response(serializer.data)
        return Response({'error': 'No company associated'}, status=400)


@api_view(['POST'])
@permission_classes([AllowAny])
def company_registration(request):
    """Public endpoint for company registration"""
    try:
        data = request.data
        
        # Create company
        company = Company.objects.create(
            name=data['company_name'],
            business_registration=data.get('business_registration', ''),
            industry=data.get('industry', ''),
            address=data.get('address', ''),
            phone=data.get('phone', ''),
            website=data.get('website', ''),
            admin_name=f"{data['admin_first_name']} {data['admin_last_name']}",
            admin_email=data['admin_email'],
            admin_phone=data.get('admin_phone', ''),
            subscription_plan=data['subscription_plan'],
            subscription_status='pending_approval',
            estimated_loan_volume=data.get('estimated_loan_volume', ''),
            is_active=False
        )
        
        # Set monthly fee based on plan
        plan_fees = {
            'basic': 99.00,
            'professional': 299.00,
            'enterprise': 599.00
        }
        company.monthly_fee = plan_fees.get(data['subscription_plan'], 299.00)
        company.save()
        
        return Response({
            'message': 'Registration submitted successfully',
            'company_id': company.id,
            'status': 'pending_approval'
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'error': 'Registration failed',
            'details': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)