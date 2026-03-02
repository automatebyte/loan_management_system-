import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Grid, Paper, Typography, Button, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, MenuItem, Dialog, DialogTitle,
  DialogContent, DialogActions, Card, CardContent
} from '@mui/material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const ClerkDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dues, setDues] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [debtAnalysis, setDebtAnalysis] = useState<any>({});
  const [openExpenseDialog, setOpenExpenseDialog] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'office',
    amount: '',
    description: '',
    receipt: null
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.role !== 'clerk') {
      navigate('/login');
      return;
    }
    
    fetchDues();
    fetchExpenses();
    fetchDebtAnalysis();
  }, [navigate]);

  const fetchDues = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/loans/clerk/dues/daily/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDues(response.data.dues || []);
    } catch (error) {
    }
  };

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/loans/clerk/expenses/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(response.data || []);
    } catch (error) {
    }
  };

  const fetchDebtAnalysis = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/loans/clerk/debt-analysis/report/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDebtAnalysis(response.data || {});
    } catch (error) {
    }
  };

  const handleExpenseSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/loans/clerk/expenses/`, expenseForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOpenExpenseDialog(false);
      fetchExpenses();
      setExpenseForm({
        date: new Date().toISOString().split('T')[0],
        category: 'office',
        amount: '',
        description: '',
        receipt: null
      });
    } catch (error) {
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Clerk Dashboard</Typography>
        <Button variant="outlined" onClick={handleLogout}>Logout</Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Outstanding</Typography>
              <Typography variant="h5">${debtAnalysis.total_outstanding || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Active Loans</Typography>
              <Typography variant="h5">{debtAnalysis.total_active || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Completed Loans</Typography>
              <Typography variant="h5">{debtAnalysis.total_completed || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Collection Rate</Typography>
              <Typography variant="h5">{debtAnalysis.collection_rate || 0}%</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Today's Dues</Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Loan ID</TableCell>
                    <TableCell>Client</TableCell>
                    <TableCell>Amount Due</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dues.map((due) => (
                    <TableRow key={due.id}>
                      <TableCell>{due.loan_id}</TableCell>
                      <TableCell>{due.client_name}</TableCell>
                      <TableCell>${due.amount_due}</TableCell>
                      <TableCell>{due.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Expenses</Typography>
              <Button variant="contained" onClick={() => setOpenExpenseDialog(true)}>
                Record Expense
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.date}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>${expense.amount}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openExpenseDialog} onClose={() => setOpenExpenseDialog(false)}>
        <DialogTitle>Record Expense</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Date"
            type="date"
            value={expenseForm.date}
            onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            margin="normal"
            select
            label="Category"
            value={expenseForm.category}
            onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
          >
            <MenuItem value="office">Office Supplies</MenuItem>
            <MenuItem value="transport">Transportation</MenuItem>
            <MenuItem value="utilities">Utilities</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
          <TextField
            fullWidth
            margin="normal"
            label="Amount"
            type="number"
            value={expenseForm.amount}
            onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            multiline
            rows={3}
            value={expenseForm.description}
            onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenExpenseDialog(false)}>Cancel</Button>
          <Button onClick={handleExpenseSubmit} variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ClerkDashboard;
