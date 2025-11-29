import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Typography, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Chip,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Alert, Card, CardContent, useMediaQuery, useTheme
} from '@mui/material';
import { AccountBalance, Payment, History, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import StatCard from './common/StatCard';
import ResponsiveNavbar from './common/ResponsiveNavbar';

interface Loan {
  id: number;
  loan_id: string;
  amount: number;
  outstanding_balance: number;
  monthly_payment: number;
  status: string;
  next_payment_date: string;
  interest_rate: number;
}

interface Transaction {
  id: number;
  amount: number;
  transaction_type: string;
  transaction_date: string;
  notes: string;
}

const ClientPortal: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  useEffect(() => {
    fetchLoans();
    fetchTransactions();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await api.get('/api/loans/loans/');
      setLoans(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching loans:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/api/loans/transactions/');
      setTransactions(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handlePaymentRequest = async () => {
    if (!selectedLoan || !paymentAmount) return;

    try {
      await api.post(`/api/loans/loans/${selectedLoan.id}/request_payment/`, {
        amount: paymentAmount,
        notes: 'Client payment request'
      });
      
      setAlert({ type: 'success', message: 'Payment request submitted successfully!' });
      setOpenPaymentDialog(false);
      setPaymentAmount('');
      fetchLoans();
      fetchTransactions();
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to submit payment request' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'info';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };



  const totalOutstanding = loans.reduce((sum, loan) => sum + loan.outstanding_balance, 0);
  const totalMonthlyPayment = loans.reduce((sum, loan) => sum + loan.monthly_payment, 0);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <ResponsiveNavbar
        title="KreditAI"
        userRole="Client"
        onLogout={handleLogout}
      />
      
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {alert && (
        <Alert severity={alert.type} className="mb-4" onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

        <Typography variant="h4" sx={{ mb: { xs: 3, md: 4 }, fontWeight: 700, color: 'text.primary' }}>
          {isMobile ? 'My Loans' : 'My Loan Portal'}
        </Typography>

      {/* Summary Cards */}
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title="Active Loans" 
            value={loans.filter(l => l.status === 'active').length}
            icon={<AccountBalance fontSize="large" />}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title="Total Outstanding" 
            value={formatCurrency(totalOutstanding)}
            color="error"
            icon={<Payment fontSize="large" />}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title="Monthly Payment" 
            value={formatCurrency(totalMonthlyPayment)}
            color="warning"
            icon={<Payment fontSize="large" />}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title="Completed Loans" 
            value={loans.filter(l => l.status === 'completed').length}
            color="success"
            icon={<History fontSize="large" />}
          />
        </Grid>
      </Grid>

      {/* Loans Table */}
      <Card sx={{ mb: { xs: 3, md: 4 }, borderRadius: 2, boxShadow: 1, border: '1px solid #e5e7eb' }}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>My Loans</Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: { xs: 300, md: 650 } }}>
              <TableHead>
                <TableRow>
                  <TableCell>Loan ID</TableCell>
                  <TableCell>Amount</TableCell>
                  {!isMobile && <TableCell>Outstanding</TableCell>}
                  <TableCell>Monthly</TableCell>
                  <TableCell>Status</TableCell>
                  {!isMobile && <TableCell>Next Payment</TableCell>}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{loan.loan_id}</TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{formatCurrency(loan.amount)}</TableCell>
                    {!isMobile && <TableCell sx={{ fontSize: '0.875rem' }}>{formatCurrency(loan.outstanding_balance)}</TableCell>}
                    <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{formatCurrency(loan.monthly_payment)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={loan.status.toUpperCase()} 
                        color={getStatusColor(loan.status) as any}
                        size="small"
                      />
                    </TableCell>
                    {!isMobile && (
                      <TableCell sx={{ fontSize: '0.875rem' }}>
                        {loan.next_payment_date ? 
                          new Date(loan.next_payment_date).toLocaleDateString() : 
                          'N/A'
                        }
                      </TableCell>
                    )}
                    <TableCell>
                      {loan.status === 'active' && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setSelectedLoan(loan);
                            setOpenPaymentDialog(true);
                          }}
                        >
                          {isMobile ? 'Pay' : 'Make Payment'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card sx={{ borderRadius: 2, boxShadow: 1, border: '1px solid #e5e7eb' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Transaction History</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.slice(0, 10).map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {new Date(transaction.transaction_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={transaction.transaction_type.toUpperCase()}
                        color={transaction.transaction_type === 'repayment' ? 'success' : 'info'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                    <TableCell>{transaction.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Payment Request Dialog */}
      <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)}>
        <DialogTitle>Request Payment</DialogTitle>
        <DialogContent>
          {selectedLoan && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="body2" className="mb-4">
                Loan: {selectedLoan.loan_id} | Outstanding: {formatCurrency(selectedLoan.outstanding_balance)}
              </Typography>
              <TextField
                fullWidth
                label="Payment Amount"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPaymentDialog(false)}>Cancel</Button>
          <Button onClick={handlePaymentRequest} variant="contained">
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </Box>
  );
};

export default ClientPortal;