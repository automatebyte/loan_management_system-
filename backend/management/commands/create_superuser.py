from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os

class Command(BaseCommand):
    help = 'Create super admin user for production'
    
    def handle(self, *args, **options):
        User = get_user_model()
        username = os.getenv('SUPER_ADMIN_USERNAME', 'DonMeli')
        email = os.getenv('SUPER_ADMIN_EMAIL', 'mellinovation@gmail.com')
        password = os.getenv('SUPER_ADMIN_PASSWORD', 'Don#Meli10.')
        
        if not User.objects.filter(username=username).exists():
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
        else:
            self.stdout.write(
                self.style.WARNING(f'Super admin {username} already exists')
            )