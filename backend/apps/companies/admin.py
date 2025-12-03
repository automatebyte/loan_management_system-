from django.contrib import admin
from .models import Company

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'email', 'max_users', 'max_loans', 'is_active']
    prepopulated_fields = {'slug': ('name',)}