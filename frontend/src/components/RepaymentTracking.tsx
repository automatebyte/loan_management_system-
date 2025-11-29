import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, Alert, Typography, Box,
  Table, TableBody, TableCell, TableHead, TableRow
} from '@mui/material';
import { Payment, Receipt } from '@mui/icons-material';
import api from '../services/api';

interface Props {
  open: boolean;
  onClose: () => void;
  loan: any;
  onSuccess: () => void;
}

const RepaymentTracking: React.FC<Props> = ({ open, onClose, loan, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handlePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setAlert({ type: 'error', message: 'Please enter a valid payment amount' });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/api/loans/loans/${loan.id}/record_repayment/`, {
        amount: parseFloat(amount),
        notes
      });

      setAlert({ type: 'success', message: 'Payment recorded successfully!' });
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 2000);
    } catch (error: any) {
      setAlert({ type: 'error', message: error.response?.data?.error || 'Payment recording failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    setNotes('');
    setAlert(null);
    onClose();
  };

  if (!loan) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Payment sx={{ mr: 1, verticalAlign: 'middle' }} />
        Record Payment - {loan.loan_id}
      </DialogTitle>
      <DialogContent>
        {alert && (
          <Alert severity={alert.type} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 2 }}>
              <Typography variant="h6" gutterBottom>Loan Details</Typography>
              <Typography>Client: {loan.client?.user?.first_name} {loan.client?.user?.last_name}</Typography>
              <Typography>Original Amount: ${loan.amount}</Typography>
              <Typography>Outstanding Balance: ${loan.outstanding_balance}</Typography>
              <Typography>Monthly Payment: ${loan.monthly_payment}</Typography>
              <Typography>Status: {loan.status}</Typography>
            </Box>

            <TextField
              fullWidth
              label="Payment Amount *"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputProps={{ min: 0, step: 0.01 }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Payment Notes"
              multiline
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes about this payment..."
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Recent Payments</Typography>
            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loan.payments?.slice(0, 5).map((payment: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                      <TableCell>${payment.amount}</TableCell>
                      <TableCell>{payment.payment_type}</TableCell>
                    </TableRow>
                  ))}
                  {(!loan.payments || loan.payments.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={3} align="center">No payments recorded</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handlePayment}
          disabled={loading || !amount}
          startIcon={<Receipt />}
        >
          {loading ? 'Recording...' : 'Record Payment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RepaymentTracking;