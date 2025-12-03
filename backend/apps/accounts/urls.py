from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'loan-officers', views.LoanOfficerViewSet, basename='loan-officer')
router.register(r'clients', views.ClientViewSet, basename='client')

urlpatterns = [
    path('login/', views.login, name='login'),
    path('profile/', views.profile, name='profile'),
    path('create-loan-officer/', views.create_loan_officer, name='create_loan_officer'),
    path('loan-officers/', views.loan_officers, name='loan_officers'),
    path('', include(router.urls)),
]