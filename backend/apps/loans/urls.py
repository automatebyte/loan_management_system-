from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views, reports

router = DefaultRouter()
router.register(r'products', views.LoanProductViewSet, basename='loanproduct')
router.register(r'loans', views.LoanViewSet, basename='loan')
router.register(r'payments', views.PaymentViewSet, basename='payment')

urlpatterns = [
    path('', include(router.urls)),
    path('reports/summary/', reports.loan_summary, name='loan_summary'),
]