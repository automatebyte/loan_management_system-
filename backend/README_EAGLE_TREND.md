# 🦅 Eagle Trend - Loan Management System

> Professional single-tenant loan management platform for financial institutions

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Python](https://img.shields.io/badge/python-3.11-blue)
![Django](https://img.shields.io/badge/django-4.2-green)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Overview

**Eagle Trend** is a comprehensive loan management system designed for financial institutions to streamline their lending operations. Built with Django REST Framework, it provides robust features for managing clients, loans, payments, and reporting.

### Key Features

- 👥 **User Management** - Admin, loan officers, and client roles
- 💰 **Loan Processing** - Complete loan lifecycle management
- 📊 **Financial Tracking** - Payments, disbursements, and transactions
- 📈 **Reporting** - Comprehensive financial reports and analytics
- 🔒 **Security** - JWT authentication, rate limiting, input sanitization
- 📱 **RESTful API** - Clean, well-documented API endpoints

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- PostgreSQL (production) or SQLite (development)
- Redis (for Celery tasks)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd loan_management_system/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run migrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

### Environment Variables

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (optional, defaults to SQLite)
DATABASE_URL=postgresql://user:password@localhost:5432/eagletrend

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@eagletrend.com

# Redis (for Celery)
REDIS_URL=redis://localhost:6379/0
```

## 📚 Documentation

### API Endpoints

#### Authentication
- `POST /api/auth/login/` - User login
- `GET /api/auth/profile/` - Get user profile

#### Loans
- `GET /api/loans/` - List all loans
- `POST /api/loans/` - Create new loan
- `GET /api/loans/{id}/` - Get loan details
- `PUT /api/loans/{id}/` - Update loan
- `DELETE /api/loans/{id}/` - Delete loan

#### Health Check
- `GET /health/` - System health status

### User Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Full system access, manage users and settings |
| **Loan Officer** | Create/manage loans, view clients, process payments |
| **Client** | View own loans, make payments, upload documents |

## 🏗️ Architecture

### Technology Stack

- **Backend**: Django 4.2, Django REST Framework
- **Database**: PostgreSQL (production), SQLite (development)
- **Authentication**: JWT (JSON Web Tokens)
- **Task Queue**: Celery + Redis
- **Email**: SMTP (configurable)

### Project Structure

```
backend/
├── apps/
│   ├── accounts/       # User & client management
│   ├── common/         # Shared utilities & middleware
│   └── loans/          # Loan management & transactions
├── backend/
│   ├── settings.py     # Django configuration
│   ├── urls.py         # URL routing
│   └── wsgi.py         # WSGI application
├── manage.py           # Django management script
└── requirements.txt    # Python dependencies
```

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Rate limiting on authentication endpoints
- ✅ Input sanitization (XSS protection)
- ✅ Security headers (HSTS, X-Frame-Options, etc.)
- ✅ File upload validation
- ✅ Password strength requirements
- ✅ CSRF protection

## 🧪 Testing

```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test apps.loans

# Run with coverage
coverage run --source='.' manage.py test
coverage report
```

## 📦 Deployment

### Production Checklist

- [ ] Set `DEBUG=False` in environment
- [ ] Configure production database (PostgreSQL)
- [ ] Set up Redis for Celery
- [ ] Configure email service
- [ ] Set secure `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Set up SSL/TLS certificates
- [ ] Configure static file serving
- [ ] Set up monitoring and logging
- [ ] Run database migrations
- [ ] Create admin user

### Docker Deployment

```bash
# Build image
docker build -t eagle-trend .

# Run container
docker run -p 8000:8000 eagle-trend
```

## 🎨 Branding

### Logo Generation

Use the AI prompts in `LOGO_PROMPT_QUICK.md` to generate the Eagle Trend logo:

**Quick Prompt:**
```
Modern fintech logo: stylized eagle + upward arrow, 
navy blue (#1a365d) and gold (#f59e0b), 
"EAGLE TREND", professional minimalist design
```

See `EAGLE_TREND_LOGO_PROMPT.md` for detailed specifications.

### Color Scheme

- **Primary**: Navy Blue `#1a365d`
- **Accent**: Gold `#f59e0b`
- **Background**: Light Gray `#e5e7eb`
- **Text**: Dark Gray `#1f2937`

## 🔄 Migration from Multi-Tenant

This application was converted from a multi-tenant architecture. See `MIGRATION_GUIDE.md` for:
- Detailed migration steps
- Database schema changes
- Data migration scripts
- Rollback procedures

## 📝 Development

### Code Style

```bash
# Format code with black
black .

# Lint with flake8
flake8 .

# Sort imports
isort .
```

### Creating Migrations

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Show migration status
python manage.py showmigrations
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🆘 Support

- **Documentation**: See `/docs` folder
- **Issues**: Open an issue on GitHub
- **Email**: support@eagletrend.com

## 🗺️ Roadmap

- [ ] Mobile app integration
- [ ] Advanced analytics dashboard
- [ ] Automated credit scoring
- [ ] SMS notifications
- [ ] Multi-currency support
- [ ] Blockchain integration for transparency

## 📊 Status

- ✅ Core loan management
- ✅ User authentication
- ✅ Payment processing
- ✅ Basic reporting
- 🚧 Advanced analytics (in progress)
- 📋 Mobile app (planned)

---

**Built with ❤️ for financial institutions**

**Eagle Trend** - Empowering lending through technology
