from django.contrib.auth.models import AbstractUser
from django.db import models
from apps.common.models import BaseModel
from apps.loans.utils import generate_client_id
from apps.common.validators import validate_image_file, validate_document_file

class User(AbstractUser):
    """Extended user model for KreditAI"""
    phone = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=20, choices=[
        ('admin', 'Admin'),
        ('field_officer', 'Field Officer'),
        ('clerk', 'Clerk'),
        ('client', 'Client'),
    ], default='client')
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"

class Client(BaseModel):
    """Client profile for loan applicants"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
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
    
    next_of_kin = models.JSONField(default=list, blank=True)
    guarantor = models.JSONField(default=dict, blank=True)
    
    def save(self, *args, **kwargs):
        if not self.client_id:
            self.client_id = generate_client_id()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.client_id}"

class Target(BaseModel):
    """Performance targets for field officers"""
    field_officer = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'field_officer'})
    target_type = models.CharField(max_length=20, choices=[
        ('loans', 'Loan Count'),
        ('amount', 'Loan Amount'),
        ('clients', 'Client Acquisition'),
    ])
    target_value = models.DecimalField(max_digits=12, decimal_places=2)
    achieved_value = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    period_start = models.DateField()
    period_end = models.DateField()
    
    def __str__(self):
        return f"{self.field_officer.get_full_name()} - {self.target_type}: {self.achieved_value}/{self.target_value}"

class PerformanceMetric(BaseModel):
    """Track staff performance metrics"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    metric_type = models.CharField(max_length=50)
    value = models.DecimalField(max_digits=12, decimal_places=2)
    period = models.DateField()
    
    class Meta:
        unique_together = ['user', 'metric_type', 'period']
    
    def __str__(self):
        return f"{self.user.username} - {self.metric_type}: {self.value}"