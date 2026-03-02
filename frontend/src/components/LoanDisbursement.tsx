import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, Alert, Typography, MenuItem,
  Box, Stepper, Step, StepLabel, Chip
} from '@mui/material';
import { AttachMoney, Person, Assignment } from '@mui/icons-material';
import api from '../services/api';

interface Props {
  open: boolean;
  onClose: () => void;
  clientId?: number;
  onSuccess: () => void;
}

interface LoanData {
  client: number;
  product: number;
  amount: string;
  term_months: number;
  purpose: string;
  collateral_description: string;
}

const steps = ['Select Product', 'Loan Details', 'Review & Disburse'];

const LoanDisbursement: React.FC<Props> = ({ open, onClose, clientId, onSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const [loanData, setLoanData] = useState<LoanData>({
    client: clientId || 0,
    product: 0,
    amount: '',
    term_months: 12,
    purpose: '',
    collateral_description: ''
  });

  useEffect(() => {
    if (open) {
      fetchProducts();
      if (!clientId) fetchClients();
    }
  }, [open, clientId]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/loans/products/available_products/');
      setProducts(response.data);
    } catch (error) {
    }
  };

  const fetchClients = async () => {
    try {
      const response = await api.get('/api/auth/clients/my_clients/');
      setClients(response.data);
    } catch (error) {
    }
  };

  const handleNext = () => setActiveStep(prev => prev + 1);
  const handleBack = () => setActiveStep(prev => prev - 1);

  const handleDisburse = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/loans/loans/', loanData);
      const loanId = response.data.id;
      
      // Auto-approve and disburse
      await api.post(`/api/loans/loans/${loanId}/approve/`);
      await api.post(`/api/loans/loans/${loanId}/disburse/`);
      
      setAlert({ type: 'success', message: 'Loan disbursed successfully!' });
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 2000);
    } catch (error: any) {
      setAlert({ type: 'error', message: error.response?.data?.error || 'Disbursement failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setLoanData({
      client: clientId || 0,
      product: 0,
      amount: '',
      term_months: 12,
      purpose: '',
      collateral_description: ''
    });
    setAlert(null);
    onClose();
  };

  const selectedProduct = products.find((p: any) => p.id === loanData.product) as any;
  const monthlyPayment = selectedProduct && loanData.amount ? 
    (parseFloat(loanData.amount) * (1 + selectedProduct.interest_rate / 100)) / loanData.term_months : 0;

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <Assignment sx={{ mr: 1, verticalAlign: 'middle' }} />
                Select Loan Product
              </Typography>
            </Grid>
            {!clientId && (
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Client *"
                  value={loanData.client}
                  onChange={(e) => setLoanData({ ...loanData, client: parseInt(e.target.value) })}
                >
                  {clients.map((client: any) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.user.first_name} {client.user.last_name} - {client.client_id}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Loan Product *"
                value={loanData.product}
                onChange={(e) => setLoanData({ ...loanData, product: parseInt(e.target.value) })}
              >
                {products.map((product: any) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name} - {product.interest_rate}% APR
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {selectedProduct && (
              <Grid item xs={12}>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2">Product Details:</Typography>
                  <Typography variant="body2">Interest Rate: {selectedProduct.interest_rate}%</Typography>
                  <Typography variant="body2">
                    Amount Range: ${selectedProduct.min_amount} - ${selectedProduct.max_amount}
                  </Typography>
                  <Typography variant="body2">
                    Term: {selectedProduct.min_term_months} - {selectedProduct.max_term_months} months
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        );
      
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <AttachMoney sx={{ mr: 1, verticalAlign: 'middle' }} />
                Loan Details
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Loan Amount *"
                type="number"
                value={loanData.amount}
                onChange={(e) => setLoanData({ ...loanData, amount: e.target.value })}
                inputProps={{ 
                  min: selectedProduct?.min_amount, 
                  max: selectedProduct?.max_amount 
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Term (Months) *"
                type="number"
                value={loanData.term_months}
                onChange={(e) => setLoanData({ ...loanData, term_months: parseInt(e.target.value) })}
                inputProps={{ 
                  min: selectedProduct?.min_term_months, 
                  max: selectedProduct?.max_term_months 
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Loan Purpose *"
                multiline
                rows={2}
                value={loanData.purpose}
                onChange={(e) => setLoanData({ ...loanData, purpose: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Collateral Description"
                multiline
                rows={2}
                value={loanData.collateral_description}
                onChange={(e) => setLoanData({ ...loanData, collateral_description: e.target.value })}
              />
            </Grid>
            {monthlyPayment > 0 && (
              <Grid item xs={12}>
                <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                  <Typography variant="h6" color="white">
                    Estimated Monthly Payment: ${monthlyPayment.toFixed(2)}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        );
      
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Review & Confirm</Typography>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>Loan Summary</Typography>
                <Typography>Product: {selectedProduct?.name}</Typography>
                <Typography>Amount: ${loanData.amount}</Typography>
                <Typography>Term: {loanData.term_months} months</Typography>
                <Typography>Interest Rate: {selectedProduct?.interest_rate}%</Typography>
                <Typography>Monthly Payment: ${monthlyPayment.toFixed(2)}</Typography>
                <Typography>Purpose: {loanData.purpose}</Typography>
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
      <DialogTitle>Loan Disbursement</DialogTitle>
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
        <Button onClick={handleClose}>Cancel</Button>
        <Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleDisburse}
            disabled={loading}
          >
            {loading ? 'Disbursing...' : 'Disburse Loan'}
          </Button>
        ) : (
          <Button variant="contained" onClick={handleNext}>Next</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default LoanDisbursement;