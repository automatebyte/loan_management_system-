from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views, admin_views
from .clerk_management import ClerkViewSet

router = DefaultRouter()
router.register(r'field-officers', views.FieldOfficerViewSet, basename='field-officer')
router.register(r'loan-officers', views.LoanOfficerViewSet, basename='loan-officer')
router.register(r'clerks', ClerkViewSet, basename='clerk')
router.register(r'clients', views.ClientViewSet, basename='client')
router.register(r'admin/staff', admin_views.StaffViewSet, basename='admin-staff')
router.register(r'admin/targets', admin_views.TargetViewSet, basename='admin-targets')
router.register(r'admin/performance', admin_views.PerformanceViewSet, basename='admin-performance')

urlpatterns = [
    path('login/', views.login, name='login'),
    path('profile/', views.profile, name='profile'),
    path('', include(router.urls)),
]