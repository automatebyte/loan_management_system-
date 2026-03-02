from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Setup default users for production'
    
    def handle(self, *args, **options):
        User = get_user_model()
        
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@kreditai.com',
                password='admin123',
                first_name='Admin',
                last_name='User',
                role='admin'
            )
            self.stdout.write(self.style.SUCCESS('Admin created: admin/admin123'))
        
        if not User.objects.filter(username='field_officer').exists():
            User.objects.create_user(
                username='field_officer',
                email='fo@kreditai.com',
                password='fo123',
                first_name='Field',
                last_name='Officer',
                role='field_officer'
            )
            self.stdout.write(self.style.SUCCESS('Field Officer created: field_officer/fo123'))
        
        if not User.objects.filter(username='clerk').exists():
            User.objects.create_user(
                username='clerk',
                email='clerk@kreditai.com',
                password='clerk123',
                first_name='Clerk',
                last_name='User',
                role='clerk'
            )
            self.stdout.write(self.style.SUCCESS('Clerk created: clerk/clerk123'))