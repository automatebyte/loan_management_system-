import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, Alert, TextField, IconButton,
  Divider, Chip
} from '@mui/material';
import { ContentCopy, Refresh, Email } from '@mui/icons-material';
import api from '../services/api';

interface CompanyCredentialsModalProps {
  open: boolean;
  onClose: () => void;
  company: any;
}

const CompanyCredentialsModal: React.FC<CompanyCredentialsModalProps> = ({
  open,
  onClose,
  company
}) => {
  const [credentials, setCredentials] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  React.useEffect(() => {
    if (open && company) {
      fetchCredentials();
    }
  }, [open, company]);

  const fetchCredentials = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/companies/${company.id}/credentials/`);
      setCredentials(response.data);
    } catch (error: any) {
      setAlert({ 
        type: 'error', 
        message: error.response?.data?.error || 'Failed to fetch credentials' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      const response = await api.post(`/api/companies/${company.id}/reset_password/`);
      setAlert({ 
        type: 'success', 
        message: `Password reset! New password: ${response.data.new_password}` 
      });
      fetchCredentials(); // Refresh credentials
    } catch (error: any) {
      setAlert({ 
        type: 'error', 
        message: 'Failed to reset password' 
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setAlert({ type: 'success', message: 'Copied to clipboard!' });
    setTimeout(() => setAlert(null), 2000);
  };

  if (!credentials && !loading) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">
            Company Login Credentials
          </Typography>
          <Chip 
            label={company?.subscription_status || 'Unknown'} 
            color={company?.subscription_status === 'active' ? 'success' : 'warning'}
            size="small"
          />
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {alert && (
          <Alert severity={alert.type} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}

        {loading ? (
          <Typography>Loading credentials...</Typography>
        ) : credentials ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              {credentials.company_name}
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Login URL
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <TextField
                  fullWidth
                  value={credentials.login_url}
                  InputProps={{ readOnly: true }}
                  size="small"
                />
                <IconButton onClick={() => copyToClipboard(credentials.login_url)}>
                  <ContentCopy />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Username
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <TextField
                  fullWidth
                  value={credentials.admin_username}
                  InputProps={{ readOnly: true }}
                  size="small"
                />
                <IconButton onClick={() => copyToClipboard(credentials.admin_username)}>
                  <ContentCopy />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Email
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <TextField
                  fullWidth
                  value={credentials.admin_email}
                  InputProps={{ readOnly: true }}
                  size="small"
                />
                <IconButton onClick={() => copyToClipboard(credentials.admin_email)}>
                  <ContentCopy />
                </IconButton>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Last Login: {credentials.last_login ? 
                  new Date(credentials.last_login).toLocaleString() : 
                  'Never'
                }
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Status: {credentials.is_active ? 'Active' : 'Inactive'}
              </Typography>
            </Box>

            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Instructions for Company Admin:</strong><br/>
                1. Go to: {credentials.login_url}<br/>
                2. Enter username and password<br/>
                3. You'll be automatically routed to your company dashboard<br/>
                4. Change your password after first login
              </Typography>
            </Alert>
          </Box>
        ) : (
          <Alert severity="error">
            No admin user found for this company. The company may need to be re-approved.
          </Alert>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
        {credentials && (
          <Button 
            onClick={handleResetPassword}
            startIcon={<Refresh />}
            variant="outlined"
            disabled={loading}
          >
            Reset Password & Send Email
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CompanyCredentialsModal;