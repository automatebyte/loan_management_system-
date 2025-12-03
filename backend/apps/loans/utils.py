import uuid
from django.utils import timezone

def generate_loan_id():
    """Generate unique loan ID"""
    return f"LN{timezone.now().strftime('%Y%m%d')}{str(uuid.uuid4())[:8].upper()}"

def generate_client_id():
    """Generate unique client ID"""
    return f"CL{timezone.now().strftime('%Y%m%d')}{str(uuid.uuid4())[:6].upper()}"