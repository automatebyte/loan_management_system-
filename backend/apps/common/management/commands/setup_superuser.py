from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os

class Command(BaseCommand):
    help = 'Setup super admin user for production'
    
    def handle(self, *args, **options):
        User = get_user_model()
        username = 'DonMeli'
        email = 'mellinovation@gmail.com'
        password = 'Don#Meli10.'
        
        # Delete existing user if exists
        User.objects.filter(username=username).delete()
        
        # Create new superuser
        superuser = User.objects.create_superuser(
            username=username,
            email=email,
            password=password
        )
        
        # Set role for custom user model
        superuser.role = 'super_admin'
        superuser.save()
        
        self.stdout.write(
            self.style.SUCCESS(f'Super admin {username} created successfully')
        )