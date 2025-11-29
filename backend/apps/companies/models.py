from django.db import models
from apps.common.models import BaseModel

class Company(BaseModel):
    """Multi-tenant company model"""
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    logo = models.ImageField(upload_to='company_logos/', null=True, blank=True)
    
    # Registration fields
    business_registration = models.CharField(max_length=100, blank=True)
    industry = models.CharField(max_length=50, blank=True)
    website = models.URLField(blank=True)
    admin_phone = models.CharField(max_length=20, blank=True)
    estimated_loan_volume = models.CharField(max_length=50, blank=True)
    
    # Subscription settings
    max_users = models.PositiveIntegerField(default=10)
    max_loans = models.PositiveIntegerField(default=1000)
    subscription_plan = models.CharField(max_length=50, choices=[
        ('basic', 'Basic'),
        ('professional', 'Professional'),
        ('enterprise', 'Enterprise'),
    ], default='basic')
    subscription_status = models.CharField(max_length=20, choices=[
        ('pending_approval', 'Pending Approval'),
        ('active', 'Active'),
        ('trial', 'Trial'),
        ('suspended', 'Suspended'),
        ('expired', 'Expired'),
    ], default='pending_approval')
    monthly_fee = models.DecimalField(max_digits=10, decimal_places=2, default=99.00)
    subscription_expiry = models.DateField(null=True, blank=True)
    last_payment_date = models.DateField(null=True, blank=True)
    next_payment_date = models.DateField(null=True, blank=True)
    admin_email = models.EmailField(default='admin@company.com')
    admin_name = models.CharField(max_length=100, blank=True)
    last_login = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name_plural = "Companies"
        
    def __str__(self):
        return self.name