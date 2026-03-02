import React, { useState } from 'react';
import { Box, Card, TextField, Button, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  React.useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    try {
      const response = await authAPI.login(credentials);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      if (response.data.user.role === 'admin') {
        navigate('/admin');
      } else if (response.data.user.role === 'field_officer' || response.data.user.role === 'loan_officer') {
        navigate('/field-officer');
      } else if (response.data.user.role === 'clerk') {
        navigate('/clerk');
      } else if (response.data.user.role === 'client') {
        navigate('/client-portal');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.response?.data?.non_field_errors?.[0] || 'Login failed';
      if (err.response?.status === 429) {
        setError('Too many login attempts. Please wait and try again.');
      } else if (err.response?.status === 400) {
        setError(errorMsg);
      } else {
        setError('Unable to connect. Please try again.');
      }
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Card sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h4" textAlign="center" mb={3}>
          Eagle Trend
        </Typography>
        <Typography variant="body2" textAlign="center" color="textSecondary" mb={3}>
          Professional Loan Management System
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
            © 2024 Eagle Trend. All rights reserved.
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default Login;