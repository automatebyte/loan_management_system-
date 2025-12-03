import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, 
  Grid, Alert, Stepper, Step, StepLabel, MenuItem
} from '@mui/material';
import { Business, Person, Payment } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface RegistrationData {
  // Company Information
  company_name: string;
  business_registration: string;
  industry: string;
  address: string;
  phone: string;
  website: string;
  
  // Admin Information
  admin_first_name: string;
  admin_last_name: string;
  admin_email: string;
  admin_phone: string;
  
  // Subscription Plan
  subscription_plan: string;
  estimated_loan_volume: string;
}

const steps = ['Company Details', 'Admin Information', 'Subscription Plan'];

const CompanyRegistration: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<RegistrationData>({
    company_name: '',
    business_registration: '',
    industry: '',
    address: '',
    phone: '',
    website: '',
    admin_first_name: '',
    admin_last_name: '',
    admin_email: '',
    admin_phone: '',
    subscription_plan: 'professional',
    estimated_loan_volume: ''
  });

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!(formData.company_name && formData.business_registration && formData.industry);
      case 1:
        return !!(formData.admin_first_name && formData.admin_last_name && formData.admin_email);
      case 2:
        return !!(formData.subscription_plan);
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post('/api/companies/register/', formData);
      setAlert({ 
        type: 'success', 
        message: 'Registration submitted successfully! You will receive approval confirmation within 24 hours.' 
      });
      setTimeout(() => navigate('/login'), 3000);
    } catch (error: any) {
      setAlert({ 
        type: 'error', 
        message: error.response?.data?.message || 'Registration failed. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <Business sx={{ mr: 1, verticalAlign: 'middle' }} />
                Company Information
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company Name *"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Business Registration Number *"
                value={formData.business_registration}
                onChange={(e) => setFormData({ ...formData, business_registration: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Industry *"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              >
                <MenuItem value="microfinance">Microfinance</MenuItem>
                <MenuItem value="banking">Banking</MenuItem>
                <MenuItem value="credit_union">Credit Union</MenuItem>
                <MenuItem value="fintech">Fintech</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Business Address"
                multiline
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </Grid>
          </Grid>
        );
      
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                Administrator Information
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name *"
                value={formData.admin_first_name}
                onChange={(e) => setFormData({ ...formData, admin_first_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name *"
                value={formData.admin_last_name}
                onChange={(e) => setFormData({ ...formData, admin_last_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email Address *"
                type="email"
                value={formData.admin_email}
                onChange={(e) => setFormData({ ...formData, admin_email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.admin_phone}
                onChange={(e) => setFormData({ ...formData, admin_phone: e.target.value })}
              />
            </Grid>
          </Grid>
        );
      
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <Payment sx={{ mr: 1, verticalAlign: 'middle' }} />
                Subscription Plan
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Subscription Plan *"
                value={formData.subscription_plan}
                onChange={(e) => setFormData({ ...formData, subscription_plan: e.target.value })}
              >
                <MenuItem value="basic">Basic - $99/month (Up to 100 loans)</MenuItem>
                <MenuItem value="professional">Professional - $299/month (Up to 500 loans)</MenuItem>
                <MenuItem value="enterprise">Enterprise - $599/month (Unlimited loans)</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Estimated Monthly Loan Volume"
                value={formData.estimated_loan_volume}
                onChange={(e) => setFormData({ ...formData, estimated_loan_volume: e.target.value })}
              >
                <MenuItem value="1-50">1-50 loans</MenuItem>
                <MenuItem value="51-100">51-100 loans</MenuItem>
                <MenuItem value="101-500">101-500 loans</MenuItem>
                <MenuItem value="500+">500+ loans</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        );
      
      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'background.default',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2
    }}>
      <Card sx={{ maxWidth: 800, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" textAlign="center" mb={1}>
            Join KreditAI
          </Typography>
          <Typography variant="body1" textAlign="center" color="textSecondary" mb={4}>
            Start your 14-day free trial today
          </Typography>

          {alert && (
            <Alert severity={alert.type} sx={{ mb: 3 }}>
              {alert.message}
            </Alert>
          )}

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading || !validateStep(activeStep)}
              >
                {loading ? 'Submitting...' : 'Complete Registration'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!validateStep(activeStep)}
              >
                Next
              </Button>
            )}
          </Box>

          <Box textAlign="center" mt={3}>
            <Typography variant="body2" color="textSecondary">
              Already have an account?{' '}
              <Button variant="text" onClick={() => navigate('/login')}>
                Sign In
              </Button>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CompanyRegistration;