import jwt
from datetime import datetime, timedelta
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .serializers import (
    UserRegistrationSerializer, LoginSerializer, UserSerializer, 
    ClientSerializer, LoanOfficerSerializer, ClientCreateSerializer
)
from .models import Client, User
from .permissions import IsClient, IsCompanyAdmin, IsSameCompany, IsLoanOfficer

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from django.http import JsonResponse
from django.contrib.auth import authenticate
import json

@csrf_exempt
def test_endpoint(request):
    return JsonResponse({'status': 'ok', 'message': 'API is working'})

@csrf_exempt  
def login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            
            user = authenticate(username=username, password=password)
            if user:
                payload = {
                    'user_id': user.id,
                    'exp': datetime.utcnow() + timedelta(hours=24),
                    'iat': datetime.utcnow()
                }
                
                token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
                
                return JsonResponse({
                    'token': token,
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'role': getattr(user, 'role', 'client'),
                        'company': getattr(user, 'company_id', None)
                    }
                })
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

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

class ClientViewSet(viewsets.ModelViewSet):
    permission_classes = [IsLoanOfficer]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ClientCreateSerializer
        return ClientSerializer
    
    def get_queryset(self):
        """Loan officers can only see clients in their company"""
        if self.request.user.role == 'super_admin':
            return Client.objects.all()
        return Client.objects.filter(company=self.request.user.company)
    
    def perform_create(self, serializer):
        """Assign new client to current user's company and loan officer"""
        serializer.save(
            company=self.request.user.company,
            loan_officer=self.request.user
        )
    
    @action(detail=False, methods=['get'])
    def my_clients(self, request):
        """Get clients assigned to current loan officer"""
        clients = Client.objects.filter(loan_officer=request.user)
        serializer = self.get_serializer(clients, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def assign_to_me(self, request, pk=None):
        """Assign client to current loan officer"""
        client = self.get_object()
        client.loan_officer = request.user
        client.save()
        return Response({'status': 'assigned'})