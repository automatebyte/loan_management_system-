# KreditAI API Reference

## Overview

The KreditAI API provides RESTful endpoints for managing loans, users, and companies. All API endpoints require authentication except for public registration endpoints.

## Base URL

- **Production**: `https://kreditai.onrender.com/api`
- **Development**: `http://localhost:8000/api`

## Authentication

### JWT Token Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer <jwt_token>
```

### Login Endpoint

**POST** `/auth/login/`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "super_admin",
    "first_name": "Admin",
    "last_name": "User"
  }
}
```

**Error Responses:**
- `400`: Invalid credentials
- `429`: Rate limit exceeded

## User Management

### Get User Profile

**GET** `/auth/profile/`

Retrieve current user profile information.

**Headers:**
```http
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "role": "super_admin",
  "first_name": "Admin",
  "last_name": "User",
  "company": "Example Company"
}
```

### Create Loan Officer

**POST** `/auth/create-loan-officer/`

Create a new loan officer (Company Admin only).

**Headers:**
```http
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Loan officer created successfully",
  "credentials": {
    "username": "john_1",
    "password": "Officer123!",
    "email": "john.doe@example.com"
  }
}
```

**Error Responses:**
- `401`: Authentication required
- `403`: Only company admins can create loan officers
- `500`: Server error

### List Loan Officers

**GET** `/auth/loan-officers/`

Get list of loan officers for the authenticated company admin.

**Headers:**
```http
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
[
  {
    "id": 2,
    "username": "john_1",
    "email": "john.doe@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_active": true
  }
]
```

## Company Management

### List Companies

**GET** `/companies/`

Get list of companies (Super Admin only).

**Headers:**
```http
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "results": [
    {
      "id": 1,
      "name": "Example Company",
      "email": "admin@example.com",
      "subscription_plan": "professional",
      "subscription_status": "trial",
      "monthly_fee": "299.00",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Company Registration

**POST** `/companies/register/`

Public endpoint for company registration.

**Request Body:**
```json
{
  "company_name": "New Company",
  "admin_first_name": "Jane",
  "admin_last_name": "Smith",
  "admin_email": "jane@newcompany.com",
  "subscription_plan": "professional",
  "business_registration": "REG123456",
  "industry": "microfinance",
  "address": "123 Main St, City, Country",
  "phone": "+1234567890",
  "website": "https://newcompany.com",
  "estimated_loan_volume": "101-500"
}
```

**Response (201):**
```json
{
  "message": "Registration submitted successfully",
  "company_id": 2,
  "status": "pending_approval",
  "next_steps": "Your registration is pending approval. You will receive login credentials via email once approved."
}
```

**Error Responses:**
- `400`: Invalid data or missing required fields

### Approve Company

**POST** `/companies/{id}/approve/`

Approve a pending company registration (Super Admin only).

**Headers:**
```http
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Company approved successfully",
  "credentials": {
    "username": "new_company_admin",
    "password": "Welcome123!",
    "login_url": "https://kreditai.onrender.com/login"
  }
}
```

### Get Company Credentials

**GET** `/companies/{id}/credentials/`

Retrieve company admin credentials (Super Admin only).

**Headers:**
```http
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "company_name": "Example Company",
  "admin_username": "example_company_admin",
  "admin_email": "admin@example.com",
  "login_url": "https://kreditai.onrender.com/login",
  "last_login": "2024-01-01T12:00:00Z",
  "is_active": true
}
```

### Reset Company Password

**POST** `/companies/{id}/reset_password/`

Reset company admin password (Super Admin only).

**Headers:**
```http
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "status": "password_reset",
  "admin_username": "example_company_admin",
  "admin_email": "admin@example.com",
  "new_password": "NewPass123!",
  "login_url": "https://kreditai.onrender.com/login",
  "email_sent": true,
  "message": "Password reset! New credentials: example_company_admin / NewPass123!"
}
```

### Dashboard Statistics

**GET** `/companies/dashboard_stats/`

Get dashboard statistics (Super Admin only).

**Headers:**
```http
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "total_companies": 10,
  "active_subscriptions": 8,
  "trial_companies": 2,
  "suspended_companies": 0,
  "pending_renewals": 1,
  "overdue_payments": 0,
  "monthly_revenue": 2392.00,
  "recent_companies": 3,
  "subscription_breakdown": [
    {"subscription_plan": "basic", "count": 3},
    {"subscription_plan": "professional", "count": 5},
    {"subscription_plan": "enterprise", "count": 2}
  ],
  "status_breakdown": [
    {"subscription_status": "active", "count": 8},
    {"subscription_status": "trial", "count": 2}
  ]
}
```

### Company Service Management

**POST** `/companies/{id}/update_payment_status/`

Update payment status for a company (Super Admin only).

**POST** `/companies/{id}/suspend_service/`

Suspend company service (Super Admin only).

**POST** `/companies/{id}/activate_service/`

Activate company service (Super Admin only).

All service management endpoints return:
```json
{
  "status": "payment_updated" | "suspended" | "activated"
}
```

## Error Handling

### Standard Error Response Format

```json
{
  "error": "Error message description",
  "details": "Additional error details (optional)"
}
```

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request - Invalid data or missing parameters
- `401`: Unauthorized - Authentication required
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource does not exist
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error - Server-side error

## Rate Limiting

### Current Limits
- **Login/Registration**: 50 requests per 15 minutes per IP
- **General API**: No specific limits (subject to server capacity)

### Rate Limit Headers
```http
X-RateLimit-Limit: 50
X-RateLimit-Remaining: 49
X-RateLimit-Reset: 1640995200
```

### Rate Limit Exceeded Response
```json
{
  "error": "Rate limit exceeded"
}
```

## Pagination

List endpoints support pagination with the following parameters:

**Query Parameters:**
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20, max: 100)

**Response Format:**
```json
{
  "count": 100,
  "next": "https://api.example.com/endpoint/?page=3",
  "previous": "https://api.example.com/endpoint/?page=1",
  "results": [...]
}
```

## Filtering and Searching

### Company Filtering
**GET** `/companies/?status=active&plan=professional`

**Available Filters:**
- `status`: active, trial, suspended, expired
- `plan`: basic, professional, enterprise
- `search`: Search by company name or email

### Date Range Filtering
**GET** `/companies/?created_after=2024-01-01&created_before=2024-12-31`

## API Versioning

Current API version: `v1`

Version is included in the URL path:
- Current: `/api/` (default to v1)
- Future: `/api/v2/` (when available)

## CORS Configuration

The API supports Cross-Origin Resource Sharing (CORS) for the following origins:
- `https://kreditai.onrender.com`
- `http://localhost:3000` (development)

## Security Considerations

### HTTPS Only
All API communications must use HTTPS in production.

### Input Validation
All input data is validated and sanitized to prevent:
- SQL injection attacks
- XSS (Cross-Site Scripting)
- CSRF (Cross-Site Request Forgery)

### Data Privacy
- Personal data is encrypted at rest
- Audit logs track all data access
- GDPR compliance measures implemented

## SDK and Client Libraries

### JavaScript/TypeScript
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://kreditai.onrender.com/api',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// Login example
const login = async (username, password) => {
  const response = await api.post('/auth/login/', {
    username,
    password
  });
  return response.data;
};
```

### Python
```python
import requests

class KreditAIClient:
    def __init__(self, base_url, token=None):
        self.base_url = base_url
        self.token = token
        self.session = requests.Session()
        if token:
            self.session.headers.update({
                'Authorization': f'Bearer {token}'
            })
    
    def login(self, username, password):
        response = self.session.post(
            f'{self.base_url}/auth/login/',
            json={'username': username, 'password': password}
        )
        return response.json()
```

## Testing

### API Testing Tools
- **Postman Collection**: Available for import
- **OpenAPI/Swagger**: Interactive documentation
- **curl Examples**: Command-line testing

### Test Environment
- **Base URL**: `https://kreditai-staging.onrender.com/api`
- **Test Credentials**: Provided separately for authorized users

## Support and Documentation Updates

For API support or documentation updates:
- **Technical Issues**: Contact development team
- **Documentation Errors**: Submit GitHub issue
- **Feature Requests**: Use product feedback channels

Last Updated: December 2024
API Version: 1.0.0