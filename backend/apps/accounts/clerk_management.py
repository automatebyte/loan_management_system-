from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from apps.accounts.models import User


class ClerkViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Unauthorized'}, status=403)
        
        clerks = User.objects.filter(role='clerk')
        search = request.query_params.get('search', None)
        if search:
            clerks = clerks.filter(
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(email__icontains=search) |
                Q(username__icontains=search)
            )
        return Response([{
            'id': c.id,
            'username': c.username,
            'email': c.email,
            'first_name': c.first_name,
            'last_name': c.last_name,
            'phone': c.phone,
            'is_active': c.is_active,
            'full_name': c.get_full_name()
        } for c in clerks])
    
    def create(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Unauthorized'}, status=403)
        
        data = request.data
        username = f"{data['first_name'].lower()}_{data['last_name'].lower()}_clerk"
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
            'credentials': {'username': username, 'password': password}
        }, status=201)
    
    def destroy(self, request, pk=None):
        if request.user.role != 'admin':
            return Response({'error': 'Unauthorized'}, status=403)
        try:
            user = User.objects.get(pk=pk, role='clerk')
            user.is_active = False
            user.save()
            return Response(status=204)
        except User.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
