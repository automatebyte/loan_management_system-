import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import api from '../services/api';

const AuthDebug: React.FC = () => {
  const [authInfo, setAuthInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    let profileData = null;
    try {
      const response = await api.get('/api/auth/profile/');
      profileData = response.data;
    } catch (error: any) {
      console.error('Profile fetch error:', error);
    }

    setAuthInfo({
      hasToken: !!token,
      token: token ? `${token.substring(0, 20)}...` : null,
      storedUser: user ? JSON.parse(user) : null,
      profileData,
      timestamp: new Date().toISOString()
    });
    setLoading(false);
  };

  if (loading) return <Typography>Loading auth info...</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom>Authentication Debug Info</Typography>
        
        <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 1 }}>
          <strong>Has Token:</strong> {authInfo.hasToken ? '✅ Yes' : '❌ No'}
        </Typography>
        
        {authInfo.token && (
          <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 1 }}>
            <strong>Token:</strong> {authInfo.token}
          </Typography>
        )}
        
        <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 1 }}>
          <strong>Stored User:</strong> {authInfo.storedUser ? JSON.stringify(authInfo.storedUser, null, 2) : 'None'}
        </Typography>
        
        <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 1 }}>
          <strong>Profile Data:</strong> {authInfo.profileData ? JSON.stringify(authInfo.profileData, null, 2) : 'Failed to fetch'}
        </Typography>
        
        <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 2 }}>
          <strong>Checked At:</strong> {authInfo.timestamp}
        </Typography>
        
        <Button variant="outlined" onClick={checkAuth}>
          Refresh Auth Info
        </Button>
      </Paper>
    </Box>
  );
};

export default AuthDebug;