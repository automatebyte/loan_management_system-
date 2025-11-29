import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, Alert, Box, Typography,
  MenuItem, InputAdornment, Stepper, Step, StepLabel
} from '@mui/material';
import { Person, AttachMoney, Upload } from '@mui/icons-material';
import api from '../services/api';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ClientData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  date_of_birth: string;
  national_id: string;
  address: string;
  monthly_income: string;
  employment_status: string;
}

const steps = ['Basic Info', 'Financial Info', 'Verification'];

const QuickClientAdd: React.FC<Props> = ({ open, onClose, onSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const [clientData, setClientData] = useState<ClientData>({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    date_of_birth: '',
    national_id: '',
    address: '',
    monthly_income: '',
    employment_status: 'employed'
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
        return !!(clientData.first_name && clientData.last_name && clientData.phone);
      case 1:
        return !!(clientData.monthly_income && clientData.employment_status);
      case 2:
        return !!(clientData.national_id);
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Generate username from email or name
      if (!clientData.username) {
        clientData.username = clientData.email || 
          `${clientData.first_name.toLowerCase()}.${clientData.last_name.toLowerCase()}`;
      }

      await api.post('/api/auth/clients/', clientData);
      setAlert({ type: 'success', message: 'Client added successfully!' });
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);
    } catch (error: any) {
      setAlert({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to add client' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setClientData({
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      phone: '',
      date_of_birth: '',
      national_id: '',
      address: '',
      monthly_income: '',
      employment_status: 'employed'
    });
    setAlert(null);
    onClose();
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                Basic Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name *"
                value={clientData.first_name}
                onChange={(e) => setClientData({ ...clientData, first_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name *"
                value={clientData.last_name}
                onChange={(e) => setClientData({ ...clientData, last_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number *"
                value={clientData.phone}
                onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={clientData.email}
                onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={clientData.date_of_birth}
                onChange={(e) => setClientData({ ...clientData, date_of_birth: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={2}
                value={clientData.address}
                onChange={(e) => setClientData({ ...clientData, address: e.target.value })}
              />
            </Grid>
          </Grid>
        );
      
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <AttachMoney sx={{ mr: 1, verticalAlign: 'middle' }} />
                Financial Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Monthly Income *"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={clientData.monthly_income}
                onChange={(e) => setClientData({ ...clientData, monthly_income: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Employment Status *"
                value={clientData.employment_status}
                onChange={(e) => setClientData({ ...clientData, employment_status: e.target.value })}
              >
                <MenuItem value="employed">Employed</MenuItem>
                <MenuItem value="self_employed">Self Employed</MenuItem>
                <MenuItem value="unemployed">Unemployed</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        );
      
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <Upload sx={{ mr: 1, verticalAlign: 'middle' }} />
                Verification
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="National ID / SSN *"
                value={clientData.national_id}
                onChange={(e) => setClientData({ ...clientData, national_id: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ 
                border: '2px dashed #ccc', 
                borderRadius: 2, 
                p: 3, 
                textAlign: 'center',
                bgcolor: 'grey.50'
              }}>
                <Upload sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  ID Document Upload (Optional)
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Can be uploaded later from client profile
                </Typography>
              </Box>
            </Grid>
          </Grid>
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Quick Client Registration
      </DialogTitle>
      <DialogContent>
        {alert && (
          <Alert severity={alert.type} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}

        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent(activeStep)}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          Cancel
        </Button>
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
            {loading ? 'Adding Client...' : 'Add Client'}
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
      </DialogActions>
    </Dialog>
  );
};

export default QuickClientAdd;