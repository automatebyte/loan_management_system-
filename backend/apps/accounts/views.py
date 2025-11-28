import jwt
from datetime import datetime, timedelta
from django.conf import settings
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .serializers import UserRegistrationSerializer, LoginSerializer, UserSerializer, ClientSerializer, LoanOfficerSerializer
from .models import Client, User
from .permissions import IsClient, IsCompanyAdmin, IsSameCompany

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        payload = {
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(hours=24),
            'iat': datetime.utcnow()
        }
        
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        
        return Response({
            'token': token,
            'user': UserSerializer(user).data
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsClient])
def create_client_profile(request):
    if hasattr(request.user, 'client'):
        return Response({'error': 'Client profile already exists'}, status=400)
    
    data = request.data.copy()
    data['user'] = request.user.id
    data['company'] = request.user.company.id
    
    serializer = ClientSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

class LoanOfficerViewSet(viewsets.ModelViewSet):
    serializer_class = LoanOfficerSerializer
    permission_classes = [IsCompanyAdmin]
    
    def get_queryset(self):
        """Company Admin can only see loan officers in their company"""
        if self.request.user.role == 'super_admin':
            return User.objects.filter(role='loan_officer')
        return User.objects.filter(
            company=self.request.user.company,
            role='loan_officer'
        )
    
    def perform_create(self, serializer):
        """Assign new loan officer to current user's company"""
        serializer.save(
            company=self.request.user.company,
            role='loan_officer'
        )
    
    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate a loan officer"""
        officer = self.get_object()
        officer.is_active = False
        officer.save()
        return Response({'status': 'deactivated'})
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate a loan officer"""
        officer = self.get_object()
        officer.is_active = True
        officer.save()
        return Response({'status': 'activated'})