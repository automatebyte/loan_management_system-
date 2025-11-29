# Deployment Guide for Render

## Prerequisites

1. GitHub repository with your code
2. Render account (https://render.com)
3. Environment variables configured

## Step-by-Step Deployment

### 1. Database Setup

1. In Render Dashboard, create a new PostgreSQL database:
   - Name: `lms-postgres`
   - Database Name: `lms_db`
   - User: `lms_user`
   - Note the connection string for later use

### 2. Redis Setup

1. Create a new Redis instance:
   - Name: `lms-redis`
   - Note the connection string

### 3. Backend Deployment

1. Create a new Web Service:
   - Connect your GitHub repository
   - Name: `lms-backend`
   - Environment: `Python 3`
   - Build Command: 
     ```bash
     cd backend && pip install -r requirements-prod.txt && python manage.py collectstatic --noinput && python manage.py migrate
     ```
   - Start Command: 
     ```bash
     cd backend && gunicorn backend.wsgi:application
     ```

2. Set Environment Variables:
   ```
   DJANGO_SETTINGS_MODULE=backend.settings
   DEBUG=false
   ALLOWED_HOSTS=.onrender.com
   DATABASE_URL=[from PostgreSQL service]
   REDIS_URL=[from Redis service]
   SECRET_KEY=[generate secure key]
   CORS_ALLOWED_ORIGINS=https://your-frontend-url.onrender.com
   ```

### 4. Frontend Deployment

1. Create a new Static Site:
   - Connect your GitHub repository
   - Name: `lms-frontend`
   - Build Command:
     ```bash
     cd frontend && npm ci && npm run build
     ```
   - Publish Directory: `frontend/build`

2. Set Environment Variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```

### 5. Post-Deployment Setup

1. Create superuser:
   ```bash
   python manage.py createsuperuser
   ```

2. Test the application:
   - Visit your frontend URL
   - Test login functionality
   - Verify API connections

## Environment Variables Reference

### Backend (.env)
```
DEBUG=False
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=.onrender.com
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
CORS_ALLOWED_ORIGINS=https://frontend-url.onrender.com
```

### Frontend (.env)
```
REACT_APP_API_URL=https://backend-url.onrender.com
```

## Troubleshooting

### Common Issues

1. **Static files not loading**
   - Ensure `whitenoise` is installed
   - Check `STATIC_ROOT` configuration
   - Run `collectstatic` in build command

2. **Database connection errors**
   - Verify `DATABASE_URL` is correctly set
   - Check database service is running
   - Ensure migrations are run

3. **CORS errors**
   - Verify `CORS_ALLOWED_ORIGINS` includes frontend URL
   - Check frontend is using correct API URL

4. **Build failures**
   - Check all dependencies are in requirements files
   - Verify build commands are correct
   - Check logs for specific error messages

### Monitoring

- Use Render's built-in logging
- Monitor database performance
- Set up health checks
- Configure alerts for downtime

## Security Checklist

- [ ] DEBUG=False in production
- [ ] Strong SECRET_KEY generated
- [ ] Database credentials secured
- [ ] CORS properly configured
- [ ] HTTPS enforced
- [ ] Environment variables not in code
- [ ] Regular security updates applied