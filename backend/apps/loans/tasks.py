from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from .models import Loan

@shared_task
def send_loan_notification(loan_id, status):
    try:
        loan = Loan.objects.get(id=loan_id)
        subject = f'Loan {loan.loan_id} - Status Update'
        message = f'Your loan application status has been updated to: {status}'
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [loan.client.user.email],
            fail_silently=False,
        )
    except Loan.DoesNotExist:
        pass