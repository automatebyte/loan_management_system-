# KreditAI Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying KreditAI to production environments. The system is optimized for deployment on Render.com but can be adapted for other cloud platforms.

## Prerequisites

### System Requirements
- **Node.js**: Version 18 or higher
- **Python**: Version 3.11 or higher
- **Database**: PostgreSQL 13+ (production) or SQLite (development)
- **Redis**: Version 6+ (for caching and task queue)
- **Git**: Version control system access

### Account Requirements
- **Render.com Account**: For hosting and deployment
- **GitHub Account**: For code repository access
- **Email Service**: SMTP credentials for notifications (optional)

## Environment Configuration

### Environment Variables

Create the following environment variables in your deployment platform:

#### Required Variables
```bash
# Django Configuration
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-domain.com,*.onrender.com

# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/database

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@yourdomain.com

# Redis Configuration
REDIS_URL=redis://localhost:6379/0
```

#### Optional Variables
```bash
# Custom Configuration
REACT_APP_API_URL=https://your-api-domain.com
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
CSRF_TRUSTED_ORIGINS=https://your-frontend-domain.com
```

## Render.com Deployment

### Backend Deployment

1. **Create Web Service**
   - Connect your GitHub repository
   - Select the backend directory as root
   - Configure build and start commands

2. **Build Configuration**
   ```yaml
   # render.yaml
   services:
     - type: web
       name: kreditai-backend
       env: python
       buildCommand: |
         cd backend
         pip install -r requirements.txt
         python manage.py collectstatic --noinput
         python manage.py migrate
       startCommand: |
         cd backend
         gunicorn backend.wsgi:application
       envVars:
         - key: PYTHON_VERSION
           value: 3.11.0
   ```

3. **Database Setup**
   - Add PostgreSQL database service
   - Configure DATABASE_URL environment variable
   - Run initial migrations

### Frontend Deployment

1. **Create Static Site**
   - Connect frontend directory
   - Configure build settings

2. **Build Configuration**
   ```yaml
   # Frontend service in render.yaml
     - type: web
       name: kreditai-frontend
       env: static
       buildCommand: |
         cd frontend
         npm ci
         npm run build
       staticPublishPath: frontend/build
       envVars:
         - key: NODE_VERSION
           value: 18.17.0
   ```

## Manual Deployment Steps

### Backend Deployment

1. **Prepare Environment**
   ```bash
   # Clone repository
   git clone https://github.com/your-repo/kreditai.git
   cd kreditai/backend
   
   # Create virtual environment
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # or
   venv\Scripts\activate     # Windows
   
   # Install dependencies
   pip install -r requirements.txt
   ```

2. **Database Setup**
   ```bash
   # Run migrations
   python manage.py migrate
   
   # Create superuser
   python manage.py createsuperuser
   
   # Collect static files
   python manage.py collectstatic --noinput
   ```

3. **Start Application**
   ```bash
   # Development
   python manage.py runserver
   
   # Production
   gunicorn backend.wsgi:application --bind 0.0.0.0:8000
   ```

### Frontend Deployment

1. **Build Application**
   ```bash
   cd frontend
   npm ci
   npm run build
   ```

2. **Deploy Static Files**
   ```bash
   # Copy build files to web server
   cp -r build/* /var/www/html/
   
   # Or serve with Node.js
   npm install -g serve
   serve -s build -l 3000
   ```

## Database Migration

### Initial Setup
```bash
# Create database tables
python manage.py migrate

# Load initial data (optional)
python manage.py loaddata initial_data.json
```

### Production Migration
```bash
# Backup existing database
pg_dump database_name > backup.sql

# Run migrations
python manage.py migrate

# Verify migration
python manage.py showmigrations
```

## SSL/HTTPS Configuration

### Render.com (Automatic)
- SSL certificates are automatically provisioned
- HTTPS is enforced by default
- Custom domains supported with automatic SSL

### Manual SSL Setup
```nginx
# Nginx configuration
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Monitoring and Logging

### Application Monitoring
```python
# settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'django.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}
```

### Health Checks
```python
# health_check.py
from django.http import JsonResponse
from django.db import connection

def health_check(request):
    try:
        # Check database connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        
        return JsonResponse({'status': 'healthy'})
    except Exception as e:
        return JsonResponse({'status': 'unhealthy', 'error': str(e)}, status=500)
```

## Performance Optimization

### Database Optimization
```python
# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'OPTIONS': {
            'MAX_CONNS': 20,
            'OPTIONS': {
                'MAX_CONNS': 20,
            }
        }
    }
}
```

### Caching Configuration
```python
# Redis caching
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}
```

## Security Configuration

### Production Security Settings
```python
# settings.py
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'
```

### Rate Limiting
```python
# Adjust rate limiting for production
RATELIMIT_ENABLE = True
RATELIMIT_RATE = '100/hour'
```

## Backup and Recovery

### Database Backup
```bash
# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
```

### File Backup
```bash
# Backup media files
tar -czf media_backup_$DATE.tar.gz media/
aws s3 cp media_backup_$DATE.tar.gz s3://your-backup-bucket/
```

## Troubleshooting

### Common Issues

#### Static Files Not Loading
```bash
# Ensure static files are collected
python manage.py collectstatic --noinput

# Check STATIC_ROOT setting
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
```

#### Database Connection Errors
```bash
# Verify DATABASE_URL format
DATABASE_URL=postgresql://user:password@host:port/database

# Test connection
python manage.py dbshell
```

#### CORS Issues
```python
# Update CORS settings
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",
    "https://www.yourdomain.com",
]
```

### Log Analysis
```bash
# View application logs
tail -f django.log

# Check system logs
journalctl -u your-service-name -f
```

## Deployment Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] Static files collected
- [ ] SSL certificates configured
- [ ] Backup procedures tested

### Post-Deployment
- [ ] Application health check passes
- [ ] Database connectivity verified
- [ ] User authentication working
- [ ] Email notifications functional
- [ ] Performance monitoring active

### Rollback Plan
- [ ] Previous version tagged in Git
- [ ] Database backup available
- [ ] Rollback procedure documented
- [ ] Monitoring alerts configured

## Maintenance Procedures

### Regular Updates
```bash
# Update dependencies
pip install -r requirements.txt --upgrade
npm update

# Run security audit
pip audit
npm audit
```

### Database Maintenance
```bash
# Analyze database performance
python manage.py dbshell
ANALYZE;

# Clean up old sessions
python manage.py clearsessions
```

### Log Rotation
```bash
# Configure logrotate
/var/log/django.log {
    daily
    missingok
    rotate 52
    compress
    notifempty
    create 644 www-data www-data
}
```