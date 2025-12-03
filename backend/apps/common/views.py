from django.http import JsonResponse
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

User = get_user_model()

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Health check endpoint for deployment verification"""
    return JsonResponse({
        'status': 'healthy',
        'message': 'KreditAI Backend is running',
        'super_admin_exists': User.objects.filter(role='super_admin').exists()
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def verify_super_admin(request):
    """Verify super admin permissions (for testing)"""
    super_admins = User.objects.filter(role='super_admin')
    return JsonResponse({
        'super_admin_count': super_admins.count(),
        'super_admins': [
            {
                'username': user.username,
                'email': user.email,
                'is_active': user.is_active,
                'is_superuser': user.is_superuser
            } for user in super_admins
        ]
    })