from rest_framework.permissions import BasePermission
from django.core.exceptions import PermissionDenied

class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'super_admin'

class IsCompanyAdmin(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.role in ['super_admin', 'company_admin']
    
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'super_admin':
            return True
        return hasattr(obj, 'company') and obj.company == request.user.company

class IsLoanOfficer(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.role in ['super_admin', 'company_admin', 'loan_officer']
    
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'super_admin':
            return True
        return hasattr(obj, 'company') and obj.company == request.user.company

class IsClient(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'client'
    
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return hasattr(obj, 'client') and obj.client.user == request.user

class IsSameCompany(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.user.role == 'super_admin':
            return True
        return hasattr(request.user, 'company') and request.user.company is not None
    
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'super_admin':
            return True
        if not hasattr(request.user, 'company') or not request.user.company:
            return False
        return hasattr(obj, 'company') and obj.company == request.user.company

class TenantIsolationMixin:
    """Mixin to enforce tenant isolation in viewsets"""
    
    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.role == 'super_admin':
            return queryset
        if hasattr(self.request.user, 'company') and self.request.user.company:
            return queryset.filter(company=self.request.user.company)
        return queryset.none()