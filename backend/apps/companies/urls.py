from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.CompanyViewSet)

urlpatterns = [
    path('register/', views.company_registration, name='company_registration'),
    path('', include(router.urls)),
]