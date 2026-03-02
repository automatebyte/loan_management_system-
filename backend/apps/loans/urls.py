from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views, reports, clerk_views

router = DefaultRouter()
router.register(r'products', views.LoanProductViewSet, basename='loanproduct')
router.register(r'loans', views.LoanViewSet, basename='loan')
router.register(r'payments', views.PaymentViewSet, basename='payment')
router.register(r'clerk/dues', clerk_views.DuesViewSet, basename='clerk-dues')
router.register(r'clerk/expenses', clerk_views.ExpenseViewSet, basename='clerk-expenses')
router.register(r'clerk/debt-analysis', clerk_views.DebtAnalysisViewSet, basename='clerk-debt')

urlpatterns = [
    path('', include(router.urls)),
    path('reports/summary/', reports.loan_summary, name='loan_summary'),
]