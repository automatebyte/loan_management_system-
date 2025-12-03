from django.contrib.auth.models import AbstractUser
from django.db import models
from apps.common.models import BaseModel
from apps.loans.utils import generate_client_id
from apps.common.validators import validate_image_file, validate_document_file

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
    
    # File uploads with security validation
    identification_picture = models.ImageField(
        upload_to='client_ids/', 
        null=True, 
        blank=True,
        validators=[validate_image_file]
    )
    collateral_pictures = models.JSONField(default=list, blank=True)
    
    # Additional KYC documents
    proof_of_income = models.FileField(
        upload_to='client_documents/',
        null=True,
        blank=True,
        validators=[validate_document_file]
    )
    bank_statement = models.FileField(
        upload_to='client_documents/',
        null=True,
        blank=True,
        validators=[validate_document_file]
    )
    loan_officer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_clients')
    
    def save(self, *args, **kwargs):
        if not self.client_id:
            self.client_id = generate_client_id()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.client_id}"