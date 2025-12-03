import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  useMediaQuery, useTheme, IconButton, Box
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface ResponsiveModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const ResponsiveModal: React.FC<ResponsiveModalProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'md'
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      fullScreen={isMobile}
      sx={{
        '& .MuiDialog-paper': {
          margin: isMobile ? 0 : 2,
          borderRadius: isMobile ? 0 : 2,
        },
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        p: { xs: 2, md: 3 }
      }}>
        {title}
        <IconButton
          onClick={onClose}
          sx={{ 
            minWidth: '44px', 
            minHeight: '44px',
            ml: 1
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
        {children}
      </DialogContent>
      
      {actions && (
        <DialogActions sx={{ 
          p: { xs: 2, md: 3 },
          gap: { xs: 1, md: 2 },
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ResponsiveModal;