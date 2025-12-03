from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os

class Command(BaseCommand):
    help = 'Create super admin user for production'
    
    def add_arguments(self, parser):
        parser.add_argument('--username', type=str, default='DonMeli')
        parser.add_argument('--email', type=str, default='mellinovation@gmail.com')
        parser.add_argument('--password', type=str, default='Don#Meli10.')
    
    def handle(self, *args, **options):
        User = get_user_model()
        username = options['username']
        email = options['email']
        password = options['password']
        
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