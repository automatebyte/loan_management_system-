# KreditAI Implementation Checklist

Quick reference for implementing missing features identified in the verification report.

## Phase 1: Role System Fix (CRITICAL)

### Backend Changes
- [ ] Update `User.role` choices in `backend/apps/accounts/models.py`
  ```python
  role = models.CharField(max_length=20, choices=[
      ('admin', 'Admin'),
      ('field_officer', 'Field Officer'),  # Changed from loan_officer
      ('clerk', 'Clerk'),  # NEW
      ('client', 'Client'),
  ])
  ```
- [ ] Create migration: `python manage.py makemigrations accounts --name update_user_roles`
- [ ] Update all `loan_officer` references to `field_officer` in:
  - [ ] `backend/apps/accounts/views.py`
  - [ ] `backend/apps/accounts/permissions.py`
  - [ ] `backend/apps/loans/views.py`
  - [ ] `backend/apps/loans/models.py` (ForeignKey references)
- [ ] Run migration: `python manage.py migrate`

### Frontend Changes
- [ ] Rename `LoanOfficerDashboard.tsx` → `FieldOfficerDashboard.tsx`
- [ ] Update role checks in `App.tsx` and routing
- [ ] Update API service calls referencing `loan_officer`

---

## Phase 2: New Database Models

### Target Model
- [ ] Add to `backend/apps/accounts/models.py`:
```python
class Target(BaseModel):
    field_officer = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'field_officer'})
    target_type = models.CharField(max_length=20, choices=[
        ('loans', 'Loan Count'),
        ('amount', 'Loan Amount'),
        ('clients', 'Client Acquisition'),
    ])
    target_value = models.DecimalField(max_digits=12, decimal_places=2)
    achieved_value = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    period_start = models.DateField()
    period_end = models.DateField()
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE)
```

### Expense Model
- [ ] Add to `backend/apps/loans/models.py`:
```python
class Expense(BaseModel):
    date = models.DateField()
    category = models.CharField(max_length=50, choices=[
        ('office', 'Office Supplies'),
        ('transport', 'Transportation'),
        ('utilities', 'Utilities'),
        ('other', 'Other'),
    ])
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    receipt = models.FileField(upload_to='expenses/', null=True, blank=True)
    recorded_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True)
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE)
```

### PaymentSchedule Model
- [ ] Add to `backend/apps/loans/models.py`:
```python
class PaymentSchedule(BaseModel):
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE, related_name='schedule')
    due_date = models.DateField()
    amount_due = models.DecimalField(max_digits=12, decimal_places=2)
    amount_paid = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue'),
        ('partial', 'Partially Paid'),
    ], default='pending')
```

- [ ] Run migrations: `python manage.py makemigrations && python manage.py migrate`

---

## Phase 3: Admin Endpoints

### Staff Management
- [ ] Create `backend/apps/accounts/admin_views.py`:
```python
class StaffViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdmin]
    
    @action(detail=False, methods=['post'])
    def add_field_officer(self, request):
        # Create field officer
        pass
    
    @action(detail=False, methods=['post'])
    def add_clerk(self, request):
        # Create clerk
        pass
    
    @action(detail=True, methods=['delete'])
    def remove_staff(self, request, pk=None):
        # Deactivate staff member
        pass
```

### Target Management
- [ ] Create serializers in `backend/apps/accounts/serializers.py`:
```python
class TargetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Target
        fields = '__all__'
```

- [ ] Create views in `backend/apps/accounts/admin_views.py`:
```python
class TargetViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdmin]
    serializer_class = TargetSerializer
```

### Performance Tracking
- [ ] Create `backend/apps/accounts/performance.py`:
```python
def calculate_field_officer_performance(user_id, start_date, end_date):
    # Calculate metrics: loans processed, conversion rate, client acquisition
    pass

def calculate_clerk_performance(user_id, start_date, end_date):
    # Calculate metrics: daily collections, payment processing
    pass
```

- [ ] Add performance endpoint in admin_views.py

### Update URLs
- [ ] Add to `backend/apps/accounts/urls.py`:
```python
router.register(r'admin/staff', admin_views.StaffViewSet, basename='admin-staff')
router.register(r'admin/targets', admin_views.TargetViewSet, basename='admin-targets')
path('admin/performance/', admin_views.performance_dashboard, name='admin-performance'),
```

---

## Phase 4: Field Officer Endpoints

### Client Management (Already exists, needs refinement)
- [ ] Add filtering to `ClientViewSet` in `backend/apps/accounts/views.py`:
```python
def get_queryset(self):
    if self.request.user.role == 'field_officer':
        return Client.objects.filter(loan_officer=self.request.user)
    return Client.objects.filter(company=self.request.user.company)
```

### Loan Filtering
- [ ] Add to `LoanViewSet` in `backend/apps/loans/views.py`:
```python
@action(detail=False, methods=['get'])
def active_loans(self, request):
    loans = self.get_queryset().filter(status__in=['active', 'disbursed'])
    serializer = self.get_serializer(loans, many=True)
    return Response(serializer.data)

@action(detail=False, methods=['get'])
def inactive_loans(self, request):
    loans = self.get_queryset().filter(status__in=['completed', 'defaulted'])
    serializer = self.get_serializer(loans, many=True)
    return Response(serializer.data)
```

### Individual Reports
- [ ] Create `backend/apps/accounts/field_officer_reports.py`:
```python
def generate_individual_report(field_officer_id, period):
    # Client acquisition, loan disbursement, target achievement
    pass
```

---

## Phase 5: Clerk Endpoints

### Dues Tracking
- [ ] Create `backend/apps/loans/clerk_views.py`:
```python
class DuesViewSet(viewsets.ViewSet):
    permission_classes = [IsClerk]
    
    def list(self, request):
        # Get all dues for today
        today = timezone.now().date()
        dues = PaymentSchedule.objects.filter(
            due_date=today,
            status__in=['pending', 'overdue']
        )
        return Response(...)
    
    @action(detail=False, methods=['get'])
    def daily_report(self, request):
        date = request.query_params.get('date', timezone.now().date())
        # Generate dues report for specific date
        pass
```

### Expense Management
- [ ] Create serializer:
```python
class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'
```

- [ ] Create viewset:
```python
class ExpenseViewSet(viewsets.ModelViewSet):
    permission_classes = [IsClerk]
    serializer_class = ExpenseSerializer
    
    def perform_create(self, serializer):
        serializer.save(recorded_by=self.request.user)
```

### Debt Analysis
- [ ] Add to `clerk_views.py`:
```python
class DebtAnalysisViewSet(viewsets.ViewSet):
    permission_classes = [IsClerk]
    
    @action(detail=False, methods=['get'])
    def unpaid(self, request):
        loans = Loan.objects.filter(
            outstanding_balance__gt=0,
            status='active'
        )
        return Response(...)
    
    @action(detail=False, methods=['get'])
    def paid(self, request):
        loans = Loan.objects.filter(
            outstanding_balance=0,
            status='completed'
        )
        return Response(...)
    
    @action(detail=False, methods=['get'])
    def analysis_report(self, request):
        # Calculate: total outstanding, collection rate, overdue amounts
        pass
```

### Update URLs
- [ ] Create `backend/apps/loans/clerk_urls.py`:
```python
router = DefaultRouter()
router.register(r'dues', clerk_views.DuesViewSet, basename='clerk-dues')
router.register(r'expenses', clerk_views.ExpenseViewSet, basename='clerk-expenses')
router.register(r'debt-analysis', clerk_views.DebtAnalysisViewSet, basename='clerk-debt')
```

---

## Phase 6: Permissions

### New Permission Classes
- [ ] Add to `backend/apps/accounts/permissions.py`:
```python
class IsFieldOfficer(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'field_officer'

class IsClerk(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'clerk'

class CanManageStaff(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'
```

---

## Phase 7: Frontend Components

### Clerk Dashboard
- [ ] Create `frontend/src/components/ClerkDashboard.tsx`:
  - [ ] Daily dues summary
  - [ ] Expense recording form
  - [ ] Debt analysis charts
  - [ ] Quick actions panel

### Staff Management (Admin)
- [ ] Create `frontend/src/components/admin/StaffManagement.tsx`:
  - [ ] Add field officer form
  - [ ] Add clerk form
  - [ ] Staff list with deactivate button
  - [ ] Staff performance cards

### Target Management (Admin)
- [ ] Create `frontend/src/components/admin/TargetManagement.tsx`:
  - [ ] Set target form
  - [ ] Target list by field officer
  - [ ] Achievement progress bars
  - [ ] Edit target modal

### Performance Dashboard (Admin)
- [ ] Create `frontend/src/components/admin/PerformanceDashboard.tsx`:
  - [ ] Field officer metrics
  - [ ] Clerk metrics
  - [ ] Comparative charts
  - [ ] Export buttons

### Expense Form (Clerk)
- [ ] Create `frontend/src/components/clerk/ExpenseForm.tsx`:
  - [ ] Date picker
  - [ ] Category dropdown
  - [ ] Amount input
  - [ ] Description textarea
  - [ ] Receipt upload

### Dues Tracking (Clerk)
- [ ] Create `frontend/src/components/clerk/DuesTracking.tsx`:
  - [ ] Daily dues list
  - [ ] Date range filter
  - [ ] Payment schedule table
  - [ ] Collection summary

### Debt Analysis (Clerk)
- [ ] Create `frontend/src/components/clerk/DebtAnalysis.tsx`:
  - [ ] Unpaid debts table
  - [ ] Paid debts table
  - [ ] Status filters
  - [ ] Analysis metrics cards

---

## Phase 8: Testing

### Backend Tests
- [ ] Test role-based access control
- [ ] Test admin can add/remove staff
- [ ] Test field officer can only see their clients
- [ ] Test clerk can record expenses
- [ ] Test clerk can view dues
- [ ] Test target CRUD operations

### Frontend Tests
- [ ] Test role-based routing
- [ ] Test clerk dashboard loads
- [ ] Test staff management UI
- [ ] Test expense form submission
- [ ] Test dues tracking display

### Integration Tests
- [ ] Admin adds field officer → Field officer logs in
- [ ] Admin sets target → Field officer sees target
- [ ] Field officer adds client → Client appears in system
- [ ] Clerk records expense → Expense in report
- [ ] Clerk views dues → Accurate calculations

---

## Phase 9: Documentation

- [ ] Update API documentation with new endpoints
- [ ] Create user guides for each role
- [ ] Document role migration process
- [ ] Update README with new features
- [ ] Create video tutorials for admin features

---

## Verification Commands

```bash
# Check role migration
python manage.py shell
>>> from apps.accounts.models import User
>>> User.objects.values_list('role', flat=True).distinct()

# Verify models created
python manage.py showmigrations

# Test endpoints
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/admin/staff/
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/clerk/dues/
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/field-officer/loans/active/

# Run tests
python manage.py test apps.accounts
python manage.py test apps.loans
```

---

## Progress Tracking

**Phase 1:** ☐ Not Started | ◐ In Progress | ✓ Complete  
**Phase 2:** ☐ Not Started | ◐ In Progress | ✓ Complete  
**Phase 3:** ☐ Not Started | ◐ In Progress | ✓ Complete  
**Phase 4:** ☐ Not Started | ◐ In Progress | ✓ Complete  
**Phase 5:** ☐ Not Started | ◐ In Progress | ✓ Complete  
**Phase 6:** ☐ Not Started | ◐ In Progress | ✓ Complete  
**Phase 7:** ☐ Not Started | ◐ In Progress | ✓ Complete  
**Phase 8:** ☐ Not Started | ◐ In Progress | ✓ Complete  
**Phase 9:** ☐ Not Started | ◐ In Progress | ✓ Complete  

**Overall Progress: 0%**

---

**Estimated Timeline:** 5-8 working days  
**Last Updated:** $(date)
