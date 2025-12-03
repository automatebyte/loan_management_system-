from rest_framework import permissions

class IsSuperAdmin(permissions.BasePermission):
    """
    Super Admin permissions - Company management ONLY
    NO access to loan portfolios (by design)
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            request.user.role == 'super_admin'
        )

class IsCompanyAdmin(permissions.BasePermission):
    """Company Admin permissions"""
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            request.user.role == 'company_admin'
        )

class IsLoanOfficer(permissions.BasePermission):
    """Loan Officer permissions"""
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            request.user.role == 'loan_officer'
        )

class NoSuperAdminLoanAccess(permissions.BasePermission):
    """
    CRITICAL: Prevents Super Admin from accessing loan data
    Super Admins should NEVER see loan portfolios
    """
    def has_permission(self, request, view):
        if request.user.is_authenticated and request.user.role == 'super_admin':
            return False  # Block super admin from loan endpoints
        return True