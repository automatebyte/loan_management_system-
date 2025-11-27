from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Company
from .serializers import CompanySerializer
from apps.accounts.permissions import IsSuperAdmin, IsCompanyAdmin

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsSuperAdmin]
    
    def get_queryset(self):
        if self.request.user.role == 'super_admin':
            return Company.objects.all()
        elif hasattr(self.request.user, 'company'):
            return Company.objects.filter(id=self.request.user.company.id)
        return Company.objects.none()
    
    @action(detail=False, methods=['get'], permission_classes=[IsCompanyAdmin])
    def my_company(self, request):
        if hasattr(request.user, 'company') and request.user.company:
            serializer = self.get_serializer(request.user.company)
            return Response(serializer.data)
        return Response({'error': 'No company associated'}, status=400)