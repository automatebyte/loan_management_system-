import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, TextField, Button, 
  MenuItem, Alert, Box 
} from '@mui/material';
import { loanAPI } from '../services/api';

const LoanApplication: React.FC = () => {
  const [products, setProducts] = useState([]);
  const [application, setApplication] = useState({
    product: '',
    amount: '',
    term_months: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await loanAPI.getProducts();
      setProducts(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loanAPI.createLoan(application);
      setMessage('Loan application submitted successfully!');
      setApplication({ product: '', amount: '', term_months: '' });
      setError('');
    } catch (err) {
      setError('Error submitting application');
      setMessage('');
    }
  };

  return (
    <Card sx={{ maxWidth: 600 }}>
      <CardContent>
        <Typography variant="h5" mb={3}>
          Apply for Loan
        </Typography>
        
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <TextField
            select
            fullWidth
            label="Loan Product"
            margin="normal"
            value={application.product}
            onChange={(e) => setApplication({ ...application, product: e.target.value })}
            required
          >
            {products.map((product: any) => (
              <MenuItem key={product.id} value={product.id}>
                {product.name} ({product.interest_rate}% APR)
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            fullWidth
            label="Loan Amount"
            type="number"
            margin="normal"
            value={application.amount}
            onChange={(e) => setApplication({ ...application, amount: e.target.value })}
            required
          />
          
          <TextField
            fullWidth
            label="Term (Months)"
            type="number"
            margin="normal"
            value={application.term_months}
            onChange={(e) => setApplication({ ...application, term_months: e.target.value })}
            required
          />
          
          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" fullWidth>
              Submit Application
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoanApplication;