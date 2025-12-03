from django.http import JsonResponse
from django.core.cache import cache
from django.utils.deprecation import MiddlewareMixin
import time
import re

class MultiTenantMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if hasattr(request.user, 'company') and request.user.company:
            request.tenant = request.user.company
        response = self.get_response(request)
        return response

class SecurityMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # Rate limiting for authentication endpoints
        if request.path in ['/api/auth/login/', '/api/companies/register/']:
            client_ip = self.get_client_ip(request)
            cache_key = f"rate_limit_{client_ip}_{request.path}"
            
            requests = cache.get(cache_key, [])
            now = time.time()
            
            # Remove requests older than 15 minutes (more reasonable window)
            requests = [req_time for req_time in requests if now - req_time < 900]
            
            # Check if limit exceeded (50 requests per hour for production)
            if len(requests) >= 50:
                return JsonResponse({'error': 'Rate limit exceeded'}, status=429)
            
            requests.append(now)
            cache.set(cache_key, requests, 900)
        
        # Input sanitization
        if request.method in ['POST', 'PUT', 'PATCH']:
            self.sanitize_input(request)
        
        return None

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

    def sanitize_input(self, request):
        if hasattr(request, 'data'):
            for key, value in request.data.items():
                if isinstance(value, str):
                    # Basic XSS protection
                    value = re.sub(r'<script.*?</script>', '', value, flags=re.IGNORECASE | re.DOTALL)
                    value = re.sub(r'javascript:', '', value, flags=re.IGNORECASE)
                    request.data[key] = value

    def process_response(self, request, response):
        # Security headers
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        return response