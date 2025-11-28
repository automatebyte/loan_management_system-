from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'loan-officers', views.LoanOfficerViewSet, basename='loan-officer')
router.register(r'clients', views.ClientViewSet, basename='client')

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('profile/', views.profile, name='profile'),
    path('client-profile/', views.create_client_profile, name='create_client_profile'),
    path('', include(router.urls)),
]