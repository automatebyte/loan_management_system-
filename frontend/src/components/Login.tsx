import React, { useState } from 'react';
import { Box, Card, TextField, Button, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Clear any stale tokens on component mount
  React.useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Clear any existing tokens before login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    console.log('Attempting login with:', credentials);
    console.log('API URL:', process.env.REACT_APP_API_URL || 'http://localhost:8000');
    
    try {
      const response = await authAPI.login(credentials);
      console.log('Login successful:', response.data);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      if (response.data.user.role === 'super_admin') {
        navigate('/super-admin');
      } else if (response.data.user.role === 'company_admin') {
        navigate('/company-admin');
      } else if (response.data.user.role === 'loan_officer') {
        navigate('/loan-officer');
      } else if (response.data.user.role === 'client') {
        navigate('/client-portal');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      if (err.response?.status === 429) {
        setError('Too many login attempts. Please wait a few minutes and try again.');
      } else if (err.response?.status === 403) {
        setError('Access forbidden. Please check your credentials.');
      } else if (err.response?.status === 400) {
        setError('Invalid credentials');
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Card sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h4" textAlign="center" mb={3}>
          KreditAI Login
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            margin="normal"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
        
        <Box textAlign="center" mt={3}>
          <Typography variant="body2" color="textSecondary">
            New to KreditAI?{' '}  
            <Button 
              variant="text" 
              onClick={() => navigate('/register')}
              sx={{ textTransform: 'none' }}
            >
              Start Free Trial
            </Button>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default Login;