# Loan Management System (LMS)

A multi-tenant, white-label Loan Management System built with Django REST Framework and React.

## Project Overview

This system provides comprehensive loan management capabilities for financial institutions, including:
- Multi-tenant architecture with data isolation
- Role-based access control (RBAC)
- Complete loan lifecycle management
- Client portal and administrative dashboards
- Reporting and analytics

## Technology Stack

- **Backend**: Django, Django REST Framework, PostgreSQL
- **Frontend**: React, TypeScript, Material-UI
- **Authentication**: JWT
- **Caching/Tasks**: Redis, Celery
- **Containerization**: Docker, Docker Compose

## Quick Start

1. Clone the repository
2. Copy environment variables: `cp .env.example .env`
3. Build and run: `docker-compose up --build`
4. Access the application at `http://localhost:3000`

## Development Workflow

This project follows the Git Feature Branch workflow:
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: New feature development

## Project Structure

```
loan_management_system/
├── backend/                 # Django application
├── frontend/               # React application
├── docker-compose.yml      # Development environment
├── .env.example           # Environment variables template
└── README.md              # This file
```

## Getting Started

Detailed setup instructions will be provided as the project develops.