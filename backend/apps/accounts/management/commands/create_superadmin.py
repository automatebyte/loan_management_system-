from django.core.management.base import BaseCommand
from apps.accounts.models import User

class Command(BaseCommand):
    help = 'Create a super admin user'

    def handle(self, *args, **options):
        if not User.objects.filter(username='superadmin').exists():
            User.objects.create_user(
                username='superadmin',
                email='admin@kreditai.com',
                password='admin123',
                first_name='Super',
                last_name='Admin',
                role='super_admin',
                is_staff=True,
                is_superuser=True
            )
            self.stdout.write(
                self.style.SUCCESS('Super admin created successfully')
            )
        else:
            self.stdout.write(
                self.style.WARNING('Super admin already exists')
            )