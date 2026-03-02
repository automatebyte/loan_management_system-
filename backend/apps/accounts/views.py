from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Client
from .permissions import IsAdmin, IsFieldOfficer
from .serializers import ClientSerializer, ClientCreateSerializer

User = get_user_model()

class FieldOfficerViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        officers = User.objects.filter(role='field_officer')
        return Response([{
            'id': officer.id,
            'username': officer.username,
            'email': officer.email,
            'first_name': officer.first_name,
            'last_name': officer.last_name,
            'is_active': officer.is_active
        } for officer in officers])
    
    def create(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Only admins can create field officers'}, status=403)
        
        data = request.data
        username = f"{data['first_name'].lower()}_{data['last_name'].lower()}"
        password = data.get('password', 'Officer123!')
        
        user = User.objects.create(
            username=username,
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            role='field_officer',
            is_active=True
        )
        user.set_password(password)
        user.save()
        
        return Response({
            'success': True,
            'credentials': {'username': username, 'password': password}
        }, status=201)

class LoanOfficerViewSet(FieldOfficerViewSet):
    pass

class ClientViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ClientSerializer
    
    def get_queryset(self):
        if self.request.user.role == 'field_officer':
            return Client.objects.filter(loan_officer=self.request.user)
        return Client.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ClientCreateSerializer
        return ClientSerializer
    
    def perform_create(self, serializer):
        if self.request.user.role == 'field_officer':
            serializer.save(loan_officer=self.request.user)
        else:
            serializer.save()

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Login endpoint for Eagle Trend"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'error': 'Username and password required'}, status=400)
    
    user = authenticate(username=username, password=password)
    
    if not user:
        try:
            user_obj = User.objects.get(email=username)
            user = authenticate(username=user_obj.username, password=password)
        except User.DoesNotExist:
            pass
    
    if user and user.is_active:
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
        'last_name': request.user.last_name
    })
