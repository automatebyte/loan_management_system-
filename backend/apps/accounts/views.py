from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, get_user_model
from django.db.models import Q
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Client
from .permissions import IsAdmin, IsFieldOfficer
from .serializers import ClientSerializer, ClientCreateSerializer

User = get_user_model()

class FieldOfficerViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        officers = User.objects.filter(role='field_officer')
        search = request.query_params.get('search', None)
        if search:
            officers = officers.filter(
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(email__icontains=search) |
                Q(username__icontains=search)
            )
        return Response([{
            'id': o.id,
            'username': o.username,
            'email': o.email,
            'first_name': o.first_name,
            'last_name': o.last_name,
            'phone': o.phone,
            'is_active': o.is_active,
            'full_name': o.get_full_name()
        } for o in officers])
    
    def create(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Unauthorized'}, status=403)
        
        data = request.data
        username = f"{data['first_name'].lower()}_{data['last_name'].lower()}"
        password = data.get('password', 'Officer123!')
        
        user = User.objects.create(
            username=username,
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            phone=data.get('phone', ''),
            role='field_officer',
            is_active=True
        )
        user.set_password(password)
        user.save()
        
        return Response({
            'success': True,
            'credentials': {'username': username, 'password': password}
        }, status=201)
    
    def destroy(self, request, pk=None):
        if request.user.role != 'admin':
            return Response({'error': 'Unauthorized'}, status=403)
        try:
            user = User.objects.get(pk=pk, role='field_officer')
            user.is_active = False
            user.save()
            return Response(status=204)
        except User.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)

class LoanOfficerViewSet(FieldOfficerViewSet):
    pass

class ClientViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ClientSerializer
    
    def get_queryset(self):
        queryset = Client.objects.all()
        if self.request.user.role == 'field_officer':
            queryset = queryset.filter(loan_officer=self.request.user)
        
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(user__first_name__icontains=search) |
                Q(user__last_name__icontains=search) |
                Q(user__phone__icontains=search) |
                Q(client_id__icontains=search)
            )
        return queryset
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ClientCreateSerializer
        return ClientSerializer
    
    def perform_create(self, serializer):
        if self.request.user.role == 'field_officer':
            serializer.save(loan_officer=self.request.user)
        else:
            serializer.save()
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response(status=204)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'error': 'Username and password required', 'non_field_errors': ['Username and password required']}, status=400)
    
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
    
    return Response({'error': 'Invalid credentials', 'non_field_errors': ['Invalid username or password']}, status=400)

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
