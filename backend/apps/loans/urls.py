from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views, clerk_views
from .reports import admin_reports, clerk_reports, field_officer_reports

router = DefaultRouter()
router.register(r'products', views.LoanProductViewSet, basename='loanproduct')
router.register(r'loans', views.LoanViewSet, basename='loan')
router.register(r'payments', views.PaymentViewSet, basename='payment')
router.register(r'clerk/dues', clerk_views.DuesViewSet, basename='clerk-dues')
router.register(r'clerk/expenses', clerk_views.ExpenseViewSet, basename='clerk-expenses')
router.register(r'clerk/debt-analysis', clerk_views.DebtAnalysisViewSet, basename='clerk-debt')

urlpatterns = [
    path('', include(router.urls)),
    path('reports/admin/', admin_reports, name='admin-reports'),
    path('reports/clerk/', clerk_reports, name='clerk-reports'),
    path('reports/field-officer/', field_officer_reports, name='field-officer-reports'),
]