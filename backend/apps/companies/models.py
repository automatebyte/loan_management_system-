from django.db import models
from apps.common.models import BaseModel

class Company(BaseModel):
    """Multi-tenant company model"""
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.TextField()
    logo = models.ImageField(upload_to='company_logos/', null=True, blank=True)
    
    # Subscription settings
    max_users = models.PositiveIntegerField(default=10)
    max_loans = models.PositiveIntegerField(default=1000)
    subscription_plan = models.CharField(max_length=50, choices=[
        ('basic', 'Basic'),
        ('professional', 'Professional'),
        ('enterprise', 'Enterprise'),
    ], default='basic')
    subscription_status = models.CharField(max_length=20, choices=[
        ('active', 'Active'),
        ('trial', 'Trial'),
        ('suspended', 'Suspended'),
        ('expired', 'Expired'),
    ], default='trial')
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