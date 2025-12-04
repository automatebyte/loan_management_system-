import React from 'react';
import { Box, Typography, Paper, IconButton, Tooltip } from '@mui/material';
import { ContentCopy, Launch } from '@mui/icons-material';

interface CredentialDisplayProps {
  username: string;
  password: string;
  email: string;
  loginUrl: string;
  companyName: string;
}

const CredentialDisplay: React.FC<CredentialDisplayProps> = ({
  username, password, email, loginUrl, companyName
}) => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
    console.log(`${label} copied to clipboard: ${text}`);
  };

  return (
    <Paper sx={{ p: 3, bgcolor: '#f8fafc', border: '2px solid #10b981' }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#059669' }}>
        [SUCCESS] {companyName} - Login Credentials Generated
      </Typography>
      
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography sx={{ minWidth: 80, fontWeight: 'bold' }}>Email:</Typography>
          <Typography sx={{ mr: 1 }}>{email}</Typography>
          <Tooltip title="Copy email">
            <IconButton size="small" onClick={() => copyToClipboard(email, 'Email')}>
              <ContentCopy fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography sx={{ minWidth: 80, fontWeight: 'bold' }}>Username:</Typography>
          <Typography sx={{ mr: 1 }}>{username}</Typography>
          <Tooltip title="Copy username">
            <IconButton size="small" onClick={() => copyToClipboard(username, 'Username')}>
              <ContentCopy fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ minWidth: 80, fontWeight: 'bold' }}>Password:</Typography>
          <Typography sx={{ mr: 1, bgcolor: '#fef3c7', px: 1, py: 0.5, borderRadius: 1 }}>
            {password}
          </Typography>
          <Tooltip title="Copy password">
            <IconButton size="small" onClick={() => copyToClipboard(password, 'Password')}>
              <ContentCopy fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ minWidth: 80, fontWeight: 'bold' }}>Login URL:</Typography>
          <Typography sx={{ mr: 1 }}>{loginUrl}</Typography>
          <Tooltip title="Open login page">
            <IconButton size="small" onClick={() => window.open(loginUrl, '_blank')}>
              <Launch fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <Typography variant="body2" sx={{ mt: 2, color: '#6b7280' }}>
        [NOTE] Send these credentials to the company admin. They can change the password after first login.
      </Typography>
    </Paper>
  );
};

export default CredentialDisplay;