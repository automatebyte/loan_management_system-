from django.contrib.auth.models import AbstractUser
from django.db import models
from apps.common.models import BaseModel

class User(AbstractUser):
    """Extended user model with company association"""
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE, null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=20, choices=[
        ('super_admin', 'Super Admin'),
        ('company_admin', 'Company Admin'),
        ('loan_officer', 'Loan Officer'),
        ('client', 'Client'),
    ], default='client')
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"

class Client(BaseModel):
    """Client profile for loan applicants"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE)
    client_id = models.CharField(max_length=20, unique=True)
    date_of_birth = models.DateField()
    national_id = models.CharField(max_length=50)
    address = models.TextField()
    monthly_income = models.DecimalField(max_digits=12, decimal_places=2)
    employment_status = models.CharField(max_length=20, choices=[
        ('employed', 'Employed'),
        ('self_employed', 'Self Employed'),
        ('unemployed', 'Unemployed'),
    ])
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.client_id}"