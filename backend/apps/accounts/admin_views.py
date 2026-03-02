from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Target, PerformanceMetric
from .serializers import StaffSerializer, TargetSerializer, PerformanceMetricSerializer
from .permissions import IsAdmin

User = get_user_model()

class StaffViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdmin]
    serializer_class = StaffSerializer
    
    def get_queryset(self):
        return User.objects.filter(role__in=['field_officer', 'clerk'])
    
    @action(detail=False, methods=['post'])
    def add_field_officer(self, request):
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
            'credentials': {'username': username, 'password': password},
            'user': StaffSerializer(user).data
        }, status=201)
    
    @action(detail=False, methods=['post'])
    def add_clerk(self, request):
        data = request.data
        username = f"{data['first_name'].lower()}_{data['last_name'].lower()}"
        password = data.get('password', 'Clerk123!')
        
        user = User.objects.create(
            username=username,
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            phone=data.get('phone', ''),
            role='clerk',
            is_active=True
        )
        user.set_password(password)
        user.save()
        
        return Response({
            'success': True,
            'credentials': {'username': username, 'password': password},
            'user': StaffSerializer(user).data
        }, status=201)
    
    @action(detail=True, methods=['delete'])
    def deactivate(self, request, pk=None):
        user = self.get_object()
        user.is_active = False
        user.save()
        return Response({'success': True, 'message': 'Staff member deactivated'})

class TargetViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdmin]
    serializer_class = TargetSerializer
    queryset = Target.objects.all()

class PerformanceViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAdmin]
    serializer_class = PerformanceMetricSerializer
    queryset = PerformanceMetric.objects.all()
