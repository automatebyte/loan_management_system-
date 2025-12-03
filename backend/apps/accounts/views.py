from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import UserSerializer
from .permissions import IsCompanyAdmin, IsSuperAdmin

User = get_user_model()

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_loan_officer(request):
    """Create loan officer - Company Admin only"""
    if request.user.role != 'company_admin':
        return Response({'error': 'Only company admins can create loan officers'}, status=403)
    
    try:
        data = request.data
        company = request.user.company
        
        # Simple username and password
        username = f"{data['first_name'].lower()}_{company.id}"
        password = "Officer123!"
        
        # Create loan officer
        user = User.objects.create(
            username=username,
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            role='loan_officer',
            company=company,
            is_active=True
        )
        user.set_password(password)
        user.save()
        
        # TODO: Re-enable email after core flows stable
        # send_officer_credentials_email(user, password)
        
        return Response({
            'success': True,
            'message': 'Loan officer created successfully',
            'credentials': {
                'username': username,
                'password': password,
                'email': data['email']
            }
        }, status=201)
        
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
def login(request):
    """Simple login endpoint"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'error': 'Username and password required'}, status=400)
    
    user = authenticate(username=username, password=password)
    
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'token': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'first_name': user.first_name,
                'last_name': user.last_name
            }
        })
    else:
        return Response({'error': 'Invalid credentials'}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    """Get user profile"""
    return Response({
        'id': request.user.id,
        'username': request.user.username,
        'email': request.user.email,
        'role': request.user.role,
        'first_name': request.user.first_name,
        'last_name': request.user.last_name,
        'company': request.user.company.name if request.user.company else None
    })

@api_view(['GET'])
@permission_classes([IsCompanyAdmin])
def loan_officers(request):
    """Get loan officers for company admin"""
    officers = User.objects.filter(
        company=request.user.company,
        role='loan_officer'
    )
    return Response([{
        'id': officer.id,
        'username': officer.username,
        'email': officer.email,
        'first_name': officer.first_name,
        'last_name': officer.last_name,
        'is_active': officer.is_active
    } for officer in officers])