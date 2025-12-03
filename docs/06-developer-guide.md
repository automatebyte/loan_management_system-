# KreditAI Developer Guide

## Overview

This guide provides comprehensive information for developers working on the KreditAI loan management system. It covers development environment setup, coding standards, testing procedures, and contribution guidelines.

## Development Environment Setup

### Prerequisites

#### System Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **Node.js**: Version 18.17.0 or higher
- **Python**: Version 3.11.0 or higher
- **Git**: Version 2.30 or higher
- **Code Editor**: VS Code recommended with extensions

#### Required Tools
```bash
# Node.js and npm
node --version  # Should be 18.17.0+
npm --version   # Should be 9.0.0+

# Python and pip
python --version  # Should be 3.11.0+
pip --version     # Should be 23.0+

# Git
git --version    # Should be 2.30+
```

### Repository Setup

#### Clone Repository
```bash
git clone https://github.com/your-org/kreditai.git
cd kreditai
```

#### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Environment configuration
cp .env.example .env
# Edit .env with your local settings

# Database setup
python manage.py migrate
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm ci

# Environment configuration
cp .env.example .env.local
# Edit .env.local with your local settings

# Start development server
npm start
```

### Development Tools Configuration

#### VS Code Extensions
```json
{
  "recommendations": [
    "ms-python.python",
    "ms-python.flake8",
    "ms-python.black-formatter",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-json"
  ]
}
```

#### Python Configuration
```json
// .vscode/settings.json
{
  "python.defaultInterpreterPath": "./backend/venv/bin/python",
  "python.linting.enabled": true,
  "python.linting.flake8Enabled": true,
  "python.formatting.provider": "black",
  "python.formatting.blackArgs": ["--line-length=88"]
}
```

## Project Structure

### Backend Structure
```
backend/
├── apps/
│   ├── accounts/          # User management and authentication
│   │   ├── models.py      # User and Client models
│   │   ├── views.py       # API views and endpoints
│   │   ├── serializers.py # Data serialization
│   │   ├── urls.py        # URL routing
│   │   └── permissions.py # Access control
│   ├── companies/         # Multi-tenant company management
│   │   ├── models.py      # Company model
│   │   ├── views.py       # Company management APIs
│   │   └── serializers.py # Company data serialization
│   ├── loans/             # Loan management system
│   │   ├── models.py      # Loan and payment models
│   │   ├── views.py       # Loan processing APIs
│   │   └── services.py    # Business logic
│   └── common/            # Shared utilities
│       ├── middleware.py  # Custom middleware
│       ├── utils.py       # Utility functions
│       └── validators.py  # Data validation
├── backend/
│   ├── settings.py        # Django configuration
│   ├── urls.py           # Main URL configuration
│   └── wsgi.py           # WSGI application
├── requirements.txt       # Python dependencies
└── manage.py             # Django management script
```

### Frontend Structure
```
frontend/
├── public/               # Static assets
├── src/
│   ├── components/       # React components
│   │   ├── common/       # Reusable components
│   │   ├── auth/         # Authentication components
│   │   └── dashboard/    # Dashboard components
│   ├── services/         # API services
│   │   ├── api.ts        # API client configuration
│   │   └── auth.ts       # Authentication service
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript type definitions
│   └── App.tsx           # Main application component
├── package.json          # Node.js dependencies
└── tsconfig.json         # TypeScript configuration
```

## Coding Standards

### Python/Django Standards

#### Code Style
```python
# Use Black formatter with 88 character line length
# Follow PEP 8 guidelines
# Use type hints where appropriate

from typing import Optional, List
from django.db import models

class Company(models.Model):
    """Multi-tenant company model."""
    
    name: str = models.CharField(max_length=255)
    is_active: bool = models.BooleanField(default=True)
    
    def __str__(self) -> str:
        return self.name
    
    class Meta:
        verbose_name_plural = "Companies"
```

#### API View Standards
```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class CompanyViewSet(viewsets.ModelViewSet):
    """Company management API endpoints."""
    
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve company registration."""
        company = self.get_object()
        # Implementation here
        return Response({'status': 'approved'})
```

### TypeScript/React Standards

#### Component Structure
```typescript
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';

interface DashboardProps {
  title: string;
  onAction: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ title, onAction }) => {
  const [loading, setLoading] = useState<boolean>(false);
  
  useEffect(() => {
    // Component initialization
  }, []);
  
  const handleClick = (): void => {
    setLoading(true);
    onAction();
    setLoading(false);
  };
  
  return (
    <Box>
      <Typography variant="h4">{title}</Typography>
      <Button onClick={handleClick} disabled={loading}>
        {loading ? 'Loading...' : 'Action'}
      </Button>
    </Box>
  );
};

export default Dashboard;
```

#### API Service Pattern
```typescript
import axios, { AxiosResponse } from 'axios';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

class AuthService {
  private baseURL = process.env.REACT_APP_API_URL;
  
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response: AxiosResponse<LoginResponse> = await axios.post(
      `${this.baseURL}/auth/login/`,
      credentials
    );
    return response.data;
  }
}

export const authService = new AuthService();
```

## Database Management

### Model Design Principles

#### Multi-Tenant Architecture
```python
class BaseModel(models.Model):
    """Base model with common fields."""
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True

class Company(BaseModel):
    """Tenant model for multi-tenancy."""
    
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)

class User(AbstractUser):
    """Extended user model with company association."""
    
    company = models.ForeignKey(
        Company, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
```

### Migration Management

#### Creating Migrations
```bash
# Create migration for model changes
python manage.py makemigrations

# Create named migration
python manage.py makemigrations --name add_company_fields

# Create empty migration for data migration
python manage.py makemigrations --empty app_name
```

#### Data Migrations
```python
from django.db import migrations

def migrate_data_forward(apps, schema_editor):
    """Forward data migration."""
    Company = apps.get_model('companies', 'Company')
    for company in Company.objects.all():
        # Migration logic here
        pass

def migrate_data_reverse(apps, schema_editor):
    """Reverse data migration."""
    pass

class Migration(migrations.Migration):
    dependencies = [
        ('companies', '0001_initial'),
    ]
    
    operations = [
        migrations.RunPython(
            migrate_data_forward,
            migrate_data_reverse
        ),
    ]
```

## Testing

### Backend Testing

#### Unit Tests
```python
from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.companies.models import Company

User = get_user_model()

class CompanyModelTest(TestCase):
    """Test cases for Company model."""
    
    def setUp(self):
        """Set up test data."""
        self.company = Company.objects.create(
            name="Test Company",
            admin_email="admin@test.com"
        )
    
    def test_company_creation(self):
        """Test company creation."""
        self.assertEqual(self.company.name, "Test Company")
        self.assertTrue(self.company.is_active)
    
    def test_string_representation(self):
        """Test string representation."""
        self.assertEqual(str(self.company), "Test Company")
```

#### API Tests
```python
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse

class CompanyAPITest(APITestCase):
    """Test cases for Company API."""
    
    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass',
            role='super_admin'
        )
        self.client.force_authenticate(user=self.user)
    
    def test_company_list(self):
        """Test company list endpoint."""
        url = reverse('company-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
```

#### Running Tests
```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test apps.companies

# Run with coverage
coverage run --source='.' manage.py test
coverage report
coverage html
```

### Frontend Testing

#### Component Tests
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from './Dashboard';

describe('Dashboard Component', () => {
  const mockOnAction = jest.fn();
  
  beforeEach(() => {
    mockOnAction.mockClear();
  });
  
  test('renders dashboard title', () => {
    render(<Dashboard title="Test Dashboard" onAction={mockOnAction} />);
    expect(screen.getByText('Test Dashboard')).toBeInTheDocument();
  });
  
  test('calls onAction when button clicked', () => {
    render(<Dashboard title="Test Dashboard" onAction={mockOnAction} />);
    fireEvent.click(screen.getByText('Action'));
    expect(mockOnAction).toHaveBeenCalledTimes(1);
  });
});
```

#### Running Frontend Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## API Development

### RESTful API Design

#### Endpoint Naming
```python
# Good examples
GET    /api/companies/           # List companies
POST   /api/companies/           # Create company
GET    /api/companies/1/         # Get company
PUT    /api/companies/1/         # Update company
DELETE /api/companies/1/         # Delete company
POST   /api/companies/1/approve/ # Custom action
```

#### Response Format
```python
# Success response
{
    "data": {...},
    "message": "Success message",
    "status": "success"
}

# Error response
{
    "error": "Error message",
    "details": {...},
    "status": "error"
}

# List response with pagination
{
    "count": 100,
    "next": "http://api.example.com/accounts/?page=4",
    "previous": "http://api.example.com/accounts/?page=2",
    "results": [...]
}
```

### Serializer Patterns

#### Model Serializers
```python
from rest_framework import serializers
from .models import Company

class CompanySerializer(serializers.ModelSerializer):
    """Company serializer with validation."""
    
    class Meta:
        model = Company
        fields = ['id', 'name', 'email', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def validate_email(self, value):
        """Validate email uniqueness."""
        if Company.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value
```

## Security Guidelines

### Authentication and Authorization

#### JWT Implementation
```python
from rest_framework_simplejwt.tokens import RefreshToken

def get_tokens_for_user(user):
    """Generate JWT tokens for user."""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
```

#### Permission Classes
```python
from rest_framework.permissions import BasePermission

class IsSuperAdmin(BasePermission):
    """Permission for super admin users only."""
    
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            request.user.role == 'super_admin'
        )
```

### Input Validation

#### Data Sanitization
```python
import re
from django.core.exceptions import ValidationError

def validate_phone_number(value):
    """Validate phone number format."""
    pattern = r'^\+?1?\d{9,15}$'
    if not re.match(pattern, value):
        raise ValidationError('Invalid phone number format')
```

## Performance Optimization

### Database Optimization

#### Query Optimization
```python
# Use select_related for foreign keys
companies = Company.objects.select_related('admin_user').all()

# Use prefetch_related for many-to-many
users = User.objects.prefetch_related('companies').all()

# Use only() to limit fields
companies = Company.objects.only('name', 'email').all()
```

#### Database Indexing
```python
class Company(models.Model):
    name = models.CharField(max_length=255, db_index=True)
    email = models.EmailField(unique=True)  # Automatically indexed
    
    class Meta:
        indexes = [
            models.Index(fields=['name', 'created_at']),
            models.Index(fields=['-created_at']),
        ]
```

### Frontend Optimization

#### Code Splitting
```typescript
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  );
}
```

#### Memoization
```typescript
import { memo, useMemo, useCallback } from 'react';

const ExpensiveComponent = memo(({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({ ...item, processed: true }));
  }, [data]);
  
  const handleUpdate = useCallback((id) => {
    onUpdate(id);
  }, [onUpdate]);
  
  return <div>{/* Component JSX */}</div>;
});
```

## Deployment and CI/CD

### Git Workflow

#### Branch Strategy
```bash
# Main branches
main        # Production-ready code
develop     # Integration branch

# Feature branches
feature/user-authentication
feature/loan-processing
bugfix/login-issue
hotfix/security-patch
```

#### Commit Messages
```bash
# Format: type(scope): description
feat(auth): add JWT token authentication
fix(loans): resolve calculation error in interest
docs(api): update endpoint documentation
test(companies): add unit tests for company model
```

### Pre-commit Hooks

#### Setup
```bash
# Install pre-commit
pip install pre-commit

# Install hooks
pre-commit install
```

#### Configuration (.pre-commit-config.yaml)
```yaml
repos:
  - repo: https://github.com/psf/black
    rev: 22.3.0
    hooks:
      - id: black
        language_version: python3.11
  
  - repo: https://github.com/pycqa/flake8
    rev: 4.0.1
    hooks:
      - id: flake8
  
  - repo: https://github.com/pre-commit/mirrors-prettier
    rev: v2.6.2
    hooks:
      - id: prettier
        files: \.(js|ts|tsx|json|css|md)$
```

## Troubleshooting

### Common Development Issues

#### Database Issues
```bash
# Reset database
python manage.py flush
python manage.py migrate

# Fix migration conflicts
python manage.py migrate --fake-initial

# Reset migrations
rm apps/*/migrations/0*.py
python manage.py makemigrations
python manage.py migrate
```

#### Frontend Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Fix TypeScript errors
npm run type-check
```

### Debugging Tools

#### Django Debug Toolbar
```python
# settings.py
if DEBUG:
    INSTALLED_APPS += ['debug_toolbar']
    MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']
    INTERNAL_IPS = ['127.0.0.1']
```

#### React Developer Tools
- Install React Developer Tools browser extension
- Use React Profiler for performance analysis
- Enable strict mode for development warnings

## Contributing Guidelines

### Code Review Process
1. Create feature branch from develop
2. Implement changes with tests
3. Submit pull request with description
4. Address review feedback
5. Merge after approval

### Documentation Requirements
- Update API documentation for new endpoints
- Add docstrings to new functions and classes
- Update user manual for UI changes
- Include migration notes for breaking changes

### Release Process
1. Create release branch from develop
2. Update version numbers and changelog
3. Run full test suite
4. Deploy to staging environment
5. Perform user acceptance testing
6. Merge to main and tag release
7. Deploy to production

Last Updated: December 2024
Version: 1.0.0