# Super Admin User Guide

## Overview

The Super Admin role provides system-wide oversight and management capabilities for the KreditAI platform. This guide covers all Super Admin functions, workflows, and best practices.

## Dashboard Overview

### Accessing the Dashboard
1. Navigate to the login page
2. Enter your Super Admin credentials
3. You will be automatically redirected to the Super Admin dashboard

### Dashboard Layout
The Super Admin dashboard is organized into several key sections:

#### Statistics Overview
- **Total Companies**: Number of registered organizations
- **Active Subscriptions**: Companies with active paid subscriptions
- **Monthly Revenue**: Current monthly recurring revenue
- **Overdue Payments**: Companies with payment issues

#### Management Sections
- **Pending Approvals**: New company registrations awaiting review
- **Company Management**: Active company oversight and administration
- **System Analytics**: Platform usage and performance metrics

## Company Management

### Company Registration Process

#### Understanding the Registration Flow
1. **Public Registration**: Companies submit registration through public form
2. **Pending Review**: Registration appears in "Pending Approvals" section
3. **Admin Review**: Super Admin reviews company details and credentials
4. **Approval Decision**: Approve or reject the registration
5. **Account Creation**: System generates company admin credentials upon approval

#### Reviewing Pending Registrations

**Step 1: Access Pending Approvals**
- Locate the "Pending Approvals" section on your dashboard
- Review the number of companies awaiting approval
- Click on the section to view detailed list

**Step 2: Review Company Details**
For each pending company, review:
- **Company Information**: Name, industry, business registration
- **Admin Details**: Administrator name and contact information
- **Subscription Plan**: Selected plan (Basic, Professional, Enterprise)
- **Business Context**: Estimated loan volume and operational details

**Step 3: Make Approval Decision**
- **Approve**: Click "Approve" button to activate the company
- **Reject**: Click "Reject" button to decline the registration

#### Approving Companies

**Approval Process:**
1. Click "Approve" button for the selected company
2. System automatically creates company admin user account
3. Credentials are generated and displayed for 30 seconds
4. Copy the credentials immediately for distribution
5. Company status changes to "Trial" with 14-day trial period

**Generated Credentials Format:**
- **Username**: `{company_name}_admin` (e.g., "acme_corp_admin")
- **Password**: `Welcome123!` (standard initial password)
- **Login URL**: https://kreditai.onrender.com/login

**Important Notes:**
- Credentials are displayed only once during approval
- Credentials are also logged to browser console for reference
- Company admin can change password after first login
- Trial period begins immediately upon approval

### Managing Active Companies

#### Company Management Table
The Company Management section displays all approved companies with:
- **Company Name**: Organization name and contact information
- **Subscription Status**: Current subscription state (Trial, Active, Suspended)
- **Payment Status**: Payment history and current status
- **User Count**: Number of active users in the organization
- **Last Activity**: Recent system usage

#### Available Actions

**View Credentials**
1. Click "View Credentials" button for any company
2. System displays current login information
3. Use this to retrieve credentials for companies
4. If admin user is missing, system automatically creates one

**Reset Password**
1. Click "Reset Password" for the target company
2. System generates new secure password
3. New credentials are displayed and logged
4. Email notification sent to company admin (if configured)

**Suspend Service**
1. Click "Suspend Service" to temporarily disable company access
2. All company users lose system access immediately
3. Data is preserved but inaccessible
4. Use for payment issues or policy violations

**Activate Service**
1. Click "Activate Service" to restore suspended company
2. All users regain access immediately
3. System functionality fully restored
4. Use after resolving suspension issues

**Update Payment Status**
1. Click "Update Payment" when payment is received
2. System updates payment date and extends service
3. Subscription status updated to "Active"
4. Next payment date automatically calculated

### Subscription Management

#### Subscription Plans
- **Basic Plan**: $99/month, up to 100 loans
- **Professional Plan**: $299/month, up to 500 loans  
- **Enterprise Plan**: $599/month, unlimited loans

#### Trial Management
- **Trial Period**: 14 days from approval
- **Trial Features**: Full access to all features
- **Trial Expiration**: System automatically suspends access
- **Conversion**: Manual upgrade to paid subscription required

#### Payment Tracking
- **Payment Due Dates**: Tracked automatically
- **Overdue Notifications**: Highlighted in dashboard
- **Payment Recording**: Manual payment status updates
- **Revenue Reporting**: Monthly recurring revenue calculations

## System Analytics

### Dashboard Statistics

#### Key Metrics
- **Total Companies**: All registered organizations
- **Active Subscriptions**: Paying customers
- **Trial Companies**: Companies in trial period
- **Suspended Companies**: Temporarily disabled accounts
- **Pending Renewals**: Subscriptions expiring within 30 days
- **Monthly Revenue**: Current MRR from active subscriptions

#### Subscription Breakdown
- **By Plan**: Distribution across Basic, Professional, Enterprise
- **By Status**: Active, Trial, Suspended, Expired
- **Growth Metrics**: New companies in last 30 days
- **Revenue Trends**: Monthly revenue progression

### Reporting Capabilities

#### Available Reports
- **Company Registration Report**: New signups and approval rates
- **Subscription Revenue Report**: Monthly and annual revenue analysis
- **User Activity Report**: System usage and engagement metrics
- **Payment Status Report**: Outstanding payments and collections

#### Generating Reports
1. Navigate to Reports section
2. Select report type and date range
3. Apply filters as needed
4. Generate and download report
5. Reports available in CSV and PDF formats

## User Account Management

### Super Admin Account Settings

#### Profile Management
- **Personal Information**: Name, email, contact details
- **Password Management**: Change password regularly
- **Security Settings**: Two-factor authentication (if available)
- **Notification Preferences**: Email alerts and system notifications

#### Account Security
- **Strong Passwords**: Use complex passwords with regular changes
- **Session Management**: Log out when finished
- **Access Monitoring**: Review login history regularly
- **Suspicious Activity**: Report unusual account activity

### System User Oversight

#### User Role Hierarchy
```
Super Admin (You)
├── Company Admin (One per company)
│   ├── Loan Officer (Multiple per company)
│   └── Client (Multiple per company)
```

#### User Management Capabilities
- **Company Admin Creation**: Automatic during company approval
- **Account Status Control**: Activate/deactivate company accounts
- **Password Reset**: Generate new passwords for company admins
- **Access Monitoring**: Track user activity across the platform

## Best Practices

### Company Approval Guidelines

#### Approval Criteria
- **Complete Information**: All required fields properly filled
- **Valid Business Details**: Legitimate business registration and contact info
- **Appropriate Use Case**: Suitable for loan management operations
- **Compliance**: Meets platform terms of service

#### Due Diligence Process
1. **Verify Business Registration**: Check business license validity
2. **Contact Verification**: Confirm email and phone contact information
3. **Industry Assessment**: Ensure appropriate industry for loan management
4. **Risk Evaluation**: Assess potential compliance or security risks

#### Documentation Requirements
- **Approval Records**: Maintain records of approval decisions
- **Communication Log**: Document any communication with applicants
- **Credential Distribution**: Track credential delivery to approved companies
- **Follow-up**: Monitor initial usage after approval

### System Maintenance

#### Regular Tasks
- **Daily**: Review pending approvals and system alerts
- **Weekly**: Monitor subscription status and payment issues
- **Monthly**: Generate revenue reports and usage analytics
- **Quarterly**: Review system performance and user feedback

#### Monitoring Responsibilities
- **System Performance**: Monitor response times and availability
- **Security Alerts**: Review security logs and suspicious activity
- **User Support**: Address escalated support issues
- **Platform Updates**: Coordinate system updates and maintenance

### Security Considerations

#### Access Control
- **Credential Security**: Protect Super Admin login credentials
- **Session Management**: Use secure sessions and regular logouts
- **Permission Verification**: Regularly audit user permissions
- **Incident Response**: Have procedures for security incidents

#### Data Protection
- **Sensitive Information**: Handle company and user data securely
- **Privacy Compliance**: Ensure GDPR and privacy regulation compliance
- **Audit Trails**: Maintain logs of all administrative actions
- **Backup Verification**: Regularly verify backup integrity

## Troubleshooting

### Common Issues

#### Company Approval Problems
**Issue**: Credentials not generating during approval
**Solution**: 
1. Check browser console for error messages
2. Verify company has valid admin email
3. Try refreshing page and re-approving
4. Use "View Credentials" button to retrieve credentials

**Issue**: Company admin cannot login with generated credentials
**Solution**:
1. Verify credentials were copied correctly
2. Check if account is active in system
3. Use "Reset Password" to generate new credentials
4. Ensure company status is "Trial" or "Active"

#### System Performance Issues
**Issue**: Dashboard loading slowly
**Solution**:
1. Check internet connection
2. Clear browser cache and cookies
3. Try different browser or incognito mode
4. Contact technical support if issues persist

#### Payment and Subscription Issues
**Issue**: Payment status not updating
**Solution**:
1. Use "Update Payment Status" button
2. Verify payment was actually received
3. Check subscription expiry dates
4. Contact billing team for payment verification

### Getting Help

#### Support Channels
- **Technical Issues**: Contact development team
- **Billing Questions**: Contact billing department
- **User Training**: Request additional training sessions
- **System Updates**: Subscribe to update notifications

#### Escalation Process
1. **Self-Service**: Use this guide and troubleshooting section
2. **Technical Support**: Contact IT support team
3. **Management Escalation**: Escalate critical issues to management
4. **Emergency Response**: Use emergency procedures for critical failures

## System Limits and Constraints

### Current System Limits
- **Maximum Companies**: No hard limit (based on server capacity)
- **Concurrent Users**: Based on subscription plan
- **File Upload Size**: 10MB maximum per file
- **API Rate Limits**: 50 requests per 15 minutes per IP

### Performance Considerations
- **Large Company Lists**: May load slowly with 100+ companies
- **Report Generation**: Large reports may take several minutes
- **Concurrent Operations**: Avoid multiple simultaneous approvals
- **Browser Compatibility**: Use modern browsers for best performance

## Future Enhancements

### Planned Features
- **Advanced Analytics**: Enhanced reporting and dashboard metrics
- **Automated Billing**: Integration with payment processors
- **Multi-Language Support**: Interface localization
- **Mobile Application**: Native mobile app for administrators

### Feedback and Suggestions
- **Feature Requests**: Submit through designated channels
- **User Experience**: Provide feedback on interface improvements
- **System Performance**: Report performance issues or suggestions
- **Training Needs**: Request additional training or documentation

Last Updated: December 2024
Version: 1.0.0