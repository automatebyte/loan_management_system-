from django.contrib import admin
from django.urls import path, include
from apps.common.views import health_check, verify_super_admin

urlpatterns = [
    path('admin/', admin.site.urls),
    path('health/', health_check, name='health_check'),
    path('api/verify-super-admin/', verify_super_admin, name='verify_super_admin'),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/companies/', include('apps.companies.urls')),
    path('api/loans/', include('apps.loans.urls')),
]