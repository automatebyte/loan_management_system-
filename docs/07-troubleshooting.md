# KreditAI Troubleshooting Guide

## Overview

This troubleshooting guide provides solutions for common issues encountered when using, deploying, or developing KreditAI. Issues are organized by category with step-by-step resolution procedures.

## Authentication Issues

### Login Problems

#### Issue: "Invalid credentials" error
**Symptoms:**
- User receives "Invalid credentials" message
- Login form rejects known good credentials
- Multiple failed login attempts

**Causes:**
- Incorrect username or password
- Account deactivated or suspended
- Case sensitivity in username
- Password recently changed

**Solutions:**
1. **Verify Credentials**
   ```bash
   # Check if user exists in database
   python manage.py shell
   >>> from django.contrib.auth import get_user_model
   >>> User = get_user_model()
   >>> user = User.objects.get(username='username')
   >>> print(f"Active: {user.is_active}, Role: {user.role}")
   ```

2. **Reset Password**
   ```bash
   # Reset user password
   python manage.py shell
   >>> user = User.objects.get(username='username')
   >>> user.set_password('new_password')
   >>> user.save()
   ```

3. **Check Account Status**
   ```bash
   # Activate deactivated account
   >>> user.is_active = True
   >>> user.save()
   ```

#### Issue: "Rate limit exceeded" error
**Symptoms:**
- HTTP 429 error on login attempts
- "Too many requests" message
- Temporary login blocking

**Causes:**
- Exceeded rate limit (50 requests per 15 minutes)
- Multiple failed login attempts
- Aggressive rate limiting configuration

**Solutions:**
1. **Wait for Rate Limit Reset**
   - Rate limits reset every 15 minutes
   - Inform user to wait before retrying

2. **Adjust Rate Limiting (Admin)**
   ```python
   # In apps/common/middleware.py
   # Increase rate limit threshold
   if len(requests) >= 100:  # Increased from 50
   ```

3. **Clear Rate Limit Cache**
   ```bash
   # Clear Redis cache
   redis-cli FLUSHALL
   ```

### JWT Token Issues

#### Issue: Token expired or invalid
**Symptoms:**
- Automatic logout after period of inactivity
- "Authentication credentials were not provided" error
- API requests returning 401 Unauthorized

**Causes:**
- JWT token expired (default 24 hours)
- Token corrupted in local storage
- Server-side token validation issues

**Solutions:**
1. **Clear Local Storage**
   ```javascript
   // In browser console
   localStorage.removeItem('token');
   localStorage.removeItem('user');
   ```

2. **Check Token Expiration**
   ```python
   # Decode JWT token to check expiration
   import jwt
   from django.conf import settings
   
   token = "your_jwt_token_here"
   decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
   print(f"Expires: {decoded['exp']}")
   ```

3. **Extend Token Lifetime**
   ```python
   # In settings.py
   from datetime import timedelta
   
   SIMPLE_JWT = {
       'ACCESS_TOKEN_LIFETIME': timedelta(hours=24),
       'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
   }
   ```

## Database Issues

### Connection Problems

#### Issue: Database connection refused
**Symptoms:**
- "Connection refused" error on startup
- Application fails to start
- Database queries timeout

**Causes:**
- Database server not running
- Incorrect connection parameters
- Network connectivity issues
- Database server overloaded

**Solutions:**
1. **Check Database Status**
   ```bash
   # For PostgreSQL
   sudo systemctl status postgresql
   
   # For SQLite (check file permissions)
   ls -la db.sqlite3
   ```

2. **Verify Connection String**
   ```bash
   # Test database connection
   python manage.py dbshell
   ```

3. **Reset Database Connection**
   ```python
   # In Django shell
   from django.db import connection
   connection.close()
   ```

### Migration Issues

#### Issue: Migration conflicts
**Symptoms:**
- "Conflicting migrations" error
- Migration fails to apply
- Database schema inconsistencies

**Causes:**
- Multiple developers creating migrations simultaneously
- Manual database changes
- Corrupted migration files

**Solutions:**
1. **Resolve Migration Conflicts**
   ```bash
   # Show migration status
   python manage.py showmigrations
   
   # Merge conflicting migrations
   python manage.py makemigrations --merge
   ```

2. **Reset Migrations (Development Only)**
   ```bash
   # Delete migration files
   find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
   find . -path "*/migrations/*.pyc" -delete
   
   # Recreate migrations
   python manage.py makemigrations
   python manage.py migrate
   ```

3. **Fake Migration Application**
   ```bash
   # Mark migration as applied without running
   python manage.py migrate --fake
   ```

## Performance Issues

### Slow Page Loading

#### Issue: Pages load slowly or timeout
**Symptoms:**
- Long page load times (>5 seconds)
- Timeout errors
- Poor user experience

**Causes:**
- Inefficient database queries
- Large dataset rendering
- Network latency
- Server resource constraints

**Solutions:**
1. **Optimize Database Queries**
   ```python
   # Use select_related for foreign keys
   companies = Company.objects.select_related('admin_user')
   
   # Use prefetch_related for reverse foreign keys
   users = User.objects.prefetch_related('company_set')
   
   # Limit fields returned
   companies = Company.objects.only('name', 'email')
   ```

2. **Implement Pagination**
   ```python
   # In views.py
   from rest_framework.pagination import PageNumberPagination
   
   class StandardResultsSetPagination(PageNumberPagination):
       page_size = 20
       page_size_query_param = 'page_size'
       max_page_size = 100
   ```

3. **Add Database Indexes**
   ```python
   # In models.py
   class Company(models.Model):
       name = models.CharField(max_length=255, db_index=True)
       
       class Meta:
           indexes = [
               models.Index(fields=['name', 'created_at']),
           ]
   ```

### Memory Issues

#### Issue: High memory usage or out of memory errors
**Symptoms:**
- Application crashes with memory errors
- Slow performance under load
- Server becomes unresponsive

**Causes:**
- Memory leaks in application code
- Large dataset processing
- Insufficient server resources
- Inefficient data structures

**Solutions:**
1. **Optimize Query Processing**
   ```python
   # Use iterator() for large datasets
   for company in Company.objects.iterator():
       process_company(company)
   
   # Use bulk operations
   Company.objects.bulk_create(company_list)
   ```

2. **Implement Caching**
   ```python
   # In views.py
   from django.core.cache import cache
   
   def get_dashboard_stats(request):
       stats = cache.get('dashboard_stats')
       if not stats:
           stats = calculate_stats()
           cache.set('dashboard_stats', stats, 300)  # 5 minutes
       return stats
   ```

3. **Monitor Memory Usage**
   ```bash
   # Check memory usage
   free -h
   
   # Monitor Python process
   ps aux | grep python
   ```

## Frontend Issues

### React Component Problems

#### Issue: Components not rendering or displaying errors
**Symptoms:**
- Blank pages or components
- JavaScript errors in console
- Component state not updating

**Causes:**
- JavaScript errors in component code
- Missing dependencies or imports
- State management issues
- API connection problems

**Solutions:**
1. **Check Browser Console**
   ```javascript
   // Open browser developer tools (F12)
   // Check Console tab for errors
   // Look for red error messages
   ```

2. **Verify Component Props**
   ```typescript
   // Add prop validation
   interface ComponentProps {
     title: string;
     data: any[];
   }
   
   const Component: React.FC<ComponentProps> = ({ title, data }) => {
     if (!data) {
       return <div>Loading...</div>;
     }
     // Component logic
   };
   ```

3. **Add Error Boundaries**
   ```typescript
   class ErrorBoundary extends React.Component {
     constructor(props) {
       super(props);
       this.state = { hasError: false };
     }
   
     static getDerivedStateFromError(error) {
       return { hasError: true };
     }
   
     render() {
       if (this.state.hasError) {
         return <h1>Something went wrong.</h1>;
       }
       return this.props.children;
     }
   }
   ```

### API Connection Issues

#### Issue: API requests failing or returning errors
**Symptoms:**
- Network errors in browser console
- API endpoints returning 404 or 500 errors
- Data not loading in frontend

**Causes:**
- Incorrect API endpoint URLs
- CORS configuration issues
- Authentication token problems
- Backend server not running

**Solutions:**
1. **Verify API Configuration**
   ```typescript
   // Check API base URL
   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
   console.log('API URL:', API_URL);
   ```

2. **Check CORS Settings**
   ```python
   # In settings.py
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:3000",
       "https://yourdomain.com",
   ]
   ```

3. **Debug API Requests**
   ```typescript
   // Add request/response logging
   axios.interceptors.request.use(request => {
     console.log('Starting Request:', request);
     return request;
   });
   
   axios.interceptors.response.use(
     response => {
       console.log('Response:', response);
       return response;
     },
     error => {
       console.log('Error:', error.response);
       return Promise.reject(error);
     }
   );
   ```

## Deployment Issues

### Build Failures

#### Issue: Frontend build fails during deployment
**Symptoms:**
- Build process exits with error
- TypeScript compilation errors
- Missing dependencies

**Causes:**
- TypeScript type errors
- Missing environment variables
- Dependency version conflicts
- Memory limitations during build

**Solutions:**
1. **Fix TypeScript Errors**
   ```bash
   # Run type checking locally
   npm run type-check
   
   # Fix type errors or temporarily disable strict mode
   # In tsconfig.json
   {
     "compilerOptions": {
       "strict": false,
       "noImplicitAny": false
     }
   }
   ```

2. **Check Dependencies**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Increase Build Memory**
   ```json
   // In package.json
   {
     "scripts": {
       "build": "GENERATE_SOURCEMAP=false react-scripts --max_old_space_size=4096 build"
     }
   }
   ```

### Server Configuration Issues

#### Issue: Application not accessible after deployment
**Symptoms:**
- 502 Bad Gateway errors
- Connection timeout
- Application not starting

**Causes:**
- Incorrect port configuration
- Environment variables not set
- Database connection issues
- SSL certificate problems

**Solutions:**
1. **Check Application Logs**
   ```bash
   # View application logs
   tail -f /var/log/app.log
   
   # Check system logs
   journalctl -u your-app-service -f
   ```

2. **Verify Environment Variables**
   ```bash
   # Check environment variables
   env | grep -E "(SECRET_KEY|DATABASE_URL|DEBUG)"
   ```

3. **Test Database Connection**
   ```bash
   # Test database connectivity
   python manage.py dbshell
   ```

## Security Issues

### CSRF Token Problems

#### Issue: CSRF verification failed
**Symptoms:**
- Form submissions fail with CSRF error
- API requests rejected with 403 Forbidden
- "CSRF token missing or incorrect" message

**Causes:**
- Missing CSRF token in forms
- Incorrect CSRF configuration
- Cross-origin request issues

**Solutions:**
1. **Add CSRF Token to Forms**
   ```html
   <!-- In Django templates -->
   <form method="post">
     {% csrf_token %}
     <!-- Form fields -->
   </form>
   ```

2. **Configure CSRF for API**
   ```python
   # In settings.py
   CSRF_TRUSTED_ORIGINS = [
       'https://yourdomain.com',
       'https://www.yourdomain.com',
   ]
   ```

3. **Disable CSRF for API Endpoints**
   ```python
   # In views.py
   from django.views.decorators.csrf import csrf_exempt
   
   @csrf_exempt
   def api_endpoint(request):
       # API logic
       pass
   ```

### Permission Denied Errors

#### Issue: Users cannot access certain features
**Symptoms:**
- 403 Forbidden errors
- "Permission denied" messages
- Features not visible to users

**Causes:**
- Incorrect role assignments
- Missing permission classes
- Faulty permission logic

**Solutions:**
1. **Check User Roles**
   ```python
   # Verify user role
   user = User.objects.get(username='username')
   print(f"User role: {user.role}")
   print(f"Company: {user.company}")
   ```

2. **Review Permission Classes**
   ```python
   # In views.py
   class CompanyViewSet(viewsets.ModelViewSet):
       permission_classes = [IsAuthenticated, IsSuperAdmin]
   ```

3. **Debug Permission Logic**
   ```python
   # Add logging to permission classes
   import logging
   logger = logging.getLogger(__name__)
   
   class IsSuperAdmin(BasePermission):
       def has_permission(self, request, view):
           result = request.user.role == 'super_admin'
           logger.info(f"Permission check: {result} for {request.user}")
           return result
   ```

## Data Issues

### Data Corruption or Loss

#### Issue: Data appears corrupted or missing
**Symptoms:**
- Incorrect data displayed
- Missing records
- Data inconsistencies

**Causes:**
- Database corruption
- Failed migrations
- Concurrent access issues
- Application bugs

**Solutions:**
1. **Backup and Restore**
   ```bash
   # Create database backup
   pg_dump database_name > backup.sql
   
   # Restore from backup
   psql database_name < backup.sql
   ```

2. **Data Validation**
   ```python
   # Run data integrity checks
   python manage.py shell
   >>> from apps.companies.models import Company
   >>> companies = Company.objects.all()
   >>> for company in companies:
   ...     if not company.admin_email:
   ...         print(f"Company {company.id} missing admin email")
   ```

3. **Fix Data Inconsistencies**
   ```python
   # Create data migration to fix issues
   python manage.py makemigrations --empty app_name
   # Add data fixing logic to migration
   ```

## Monitoring and Logging

### Log Analysis

#### Issue: Need to investigate system behavior
**Symptoms:**
- Unusual system behavior
- Performance degradation
- Security concerns

**Solutions:**
1. **Configure Logging**
   ```python
   # In settings.py
   LOGGING = {
       'version': 1,
       'disable_existing_loggers': False,
       'formatters': {
           'verbose': {
               'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
               'style': '{',
           },
       },
       'handlers': {
           'file': {
               'level': 'INFO',
               'class': 'logging.FileHandler',
               'filename': 'django.log',
               'formatter': 'verbose',
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

2. **Analyze Logs**
   ```bash
   # Search for errors
   grep -i error django.log
   
   # Monitor real-time logs
   tail -f django.log
   
   # Count error occurrences
   grep -c "ERROR" django.log
   ```

3. **Set Up Monitoring**
   ```python
   # Add health check endpoint
   def health_check(request):
       try:
           # Check database
           from django.db import connection
           with connection.cursor() as cursor:
               cursor.execute("SELECT 1")
           
           # Check other services
           return JsonResponse({'status': 'healthy'})
       except Exception as e:
           return JsonResponse({'status': 'unhealthy', 'error': str(e)}, status=500)
   ```

## Emergency Procedures

### System Recovery

#### Issue: Complete system failure
**Symptoms:**
- Application completely inaccessible
- Database corruption
- Data loss

**Emergency Steps:**
1. **Immediate Response**
   - Document the issue and timeline
   - Notify stakeholders
   - Activate backup systems if available

2. **Assessment**
   - Identify scope of the problem
   - Determine data integrity status
   - Estimate recovery time

3. **Recovery Process**
   ```bash
   # Restore from latest backup
   # 1. Stop application
   sudo systemctl stop your-app
   
   # 2. Restore database
   psql database_name < latest_backup.sql
   
   # 3. Restore application files
   tar -xzf app_backup.tar.gz
   
   # 4. Start application
   sudo systemctl start your-app
   ```

4. **Verification**
   - Test critical functionality
   - Verify data integrity
   - Monitor system performance

### Rollback Procedures

#### Issue: Deployment caused system issues
**Steps:**
1. **Immediate Rollback**
   ```bash
   # Git rollback
   git revert HEAD
   git push origin main
   
   # Or reset to previous version
   git reset --hard previous_commit_hash
   git push --force origin main
   ```

2. **Database Rollback**
   ```bash
   # Restore database to pre-deployment state
   psql database_name < pre_deployment_backup.sql
   ```

3. **Verification**
   - Test system functionality
   - Verify user access
   - Monitor for issues

## Getting Help

### Support Channels
- **Documentation**: Check this troubleshooting guide and user manual
- **Development Team**: Contact for technical issues
- **System Administrator**: For deployment and infrastructure issues
- **Emergency Contact**: For critical system failures

### Information to Provide
When reporting issues, include:
- Detailed description of the problem
- Steps to reproduce the issue
- Error messages and logs
- System environment details
- Screenshots if applicable

### Escalation Process
1. **Level 1**: Self-service using documentation
2. **Level 2**: Contact system administrator
3. **Level 3**: Escalate to development team
4. **Level 4**: Emergency response for critical issues

Last Updated: December 2024
Version: 1.0.0