from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from celery import shared_task

@shared_task
def send_welcome_email(user_email, user_name, company_name, temp_password):
    """Send welcome email to new company admin"""
    subject = f'Welcome to KreditAI - {company_name}'
    
    html_message = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #1e3a8a; color: white; padding: 20px; text-align: center;">
                <h1>Welcome to KreditAI</h1>
            </div>
            
            <div style="padding: 20px; background: #f8fafc;">
                <h2>Hello {user_name},</h2>
                
                <p>Congratulations! Your company <strong>{company_name}</strong> has been approved for KreditAI.</p>
                
                <p>Your account details:</p>
                <div style="background: white; padding: 15px; border-left: 4px solid #1e3a8a; margin: 20px 0;">
                    <p><strong>Username:</strong> {user_email}</p>
                    <p><strong>Temporary Password:</strong> {temp_password}</p>
                    <p><strong>Login URL:</strong> <a href="https://kreditai.onrender.com/login">https://kreditai.onrender.com/login</a></p>
                </div>
                
                <p><strong>Important:</strong> Please change your password after first login.</p>
                
                <h3>Your 14-Day Free Trial Includes:</h3>
                <ul>
                    <li>Complete loan management system</li>
                    <li>Multi-user access for your team</li>
                    <li>Real-time reporting and analytics</li>
                    <li>Secure document management</li>
                    <li>24/7 customer support</li>
                </ul>
                
                <p>Need help getting started? Contact our support team at support@kreditai.com</p>
                
                <p>Best regards,<br>The KreditAI Team</p>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
                <p>© 2024 KreditAI. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    send_mail(
        subject=subject,
        message=f'Welcome to KreditAI! Login: {user_email}, Password: {temp_password}',
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user_email],
        html_message=html_message,
        fail_silently=False
    )

@shared_task
def send_loan_officer_credentials(user_email, user_name, company_name, temp_password):
    """Send credentials to new loan officer"""
    subject = f'Your KreditAI Account - {company_name}'
    
    html_message = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #1e3a8a; color: white; padding: 20px; text-align: center;">
                <h1>KreditAI Account Created</h1>
            </div>
            
            <div style="padding: 20px; background: #f8fafc;">
                <h2>Hello {user_name},</h2>
                
                <p>You've been added as a Loan Officer for <strong>{company_name}</strong> on KreditAI.</p>
                
                <div style="background: white; padding: 15px; border-left: 4px solid #1e3a8a; margin: 20px 0;">
                    <p><strong>Username:</strong> {user_email}</p>
                    <p><strong>Temporary Password:</strong> {temp_password}</p>
                    <p><strong>Login URL:</strong> <a href="https://kreditai.onrender.com/login">https://kreditai.onrender.com/login</a></p>
                </div>
                
                <p>Please change your password after first login.</p>
                
                <p>Best regards,<br>The KreditAI Team</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    send_mail(
        subject=subject,
        message=f'KreditAI Account Created. Login: {user_email}, Password: {temp_password}',
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user_email],
        html_message=html_message,
        fail_silently=False
    )

@shared_task
def send_payment_reminder(user_email, user_name, company_name, amount_due, due_date):
    """Send payment reminder email"""
    subject = f'Payment Reminder - {company_name}'
    
    html_message = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #f59e0b; color: white; padding: 20px; text-align: center;">
                <h1>Payment Reminder</h1>
            </div>
            
            <div style="padding: 20px; background: #f8fafc;">
                <h2>Hello {user_name},</h2>
                
                <p>This is a friendly reminder that your KreditAI subscription payment is due.</p>
                
                <div style="background: white; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0;">
                    <p><strong>Company:</strong> {company_name}</p>
                    <p><strong>Amount Due:</strong> ${amount_due}</p>
                    <p><strong>Due Date:</strong> {due_date}</p>
                </div>
                
                <p>Please log in to your account to update your payment information.</p>
                
                <p>Questions? Contact us at billing@kreditai.com</p>
                
                <p>Best regards,<br>The KreditAI Team</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    send_mail(
        subject=subject,
        message=f'Payment reminder: ${amount_due} due on {due_date}',
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user_email],
        html_message=html_message,
        fail_silently=False
    )