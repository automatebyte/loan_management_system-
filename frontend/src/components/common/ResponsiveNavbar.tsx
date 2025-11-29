import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem,
  ListItemText, Box, useMediaQuery, useTheme
} from '@mui/material';
import { Menu, Close } from '@mui/icons-material';

interface ResponsiveNavbarProps {
  title: string;
  userRole?: string;
  onLogout: () => void;
  navItems?: Array<{ label: string; onClick: () => void }>;
}

const ResponsiveNavbar: React.FC<ResponsiveNavbarProps> = ({
  title,
  userRole,
  onLogout,
  navItems = []
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, pb: 2 }}>
        <IconButton onClick={handleDrawerToggle}>
          <Close />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item, index) => (
          <ListItem 
            key={index} 
            onClick={() => {
              item.onClick();
              setMobileOpen(false);
            }}
            sx={{ cursor: 'pointer', minHeight: '48px' }}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        <ListItem 
          onClick={() => {
            onLogout();
            setMobileOpen(false);
          }}
          sx={{ cursor: 'pointer', minHeight: '48px', mt: 2, borderTop: '1px solid #e5e7eb' }}
        >
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar sx={{ minHeight: { xs: '56px', sm: '64px' } }}>
          <Typography 
            variant="h6" 
            sx={{ 
              flexGrow: 1, 
              fontSize: { xs: '1rem', sm: '1.25rem' },
              fontWeight: 600
            }}
          >
            {title} {userRole && `- ${userRole}`}
          </Typography>
          
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ minWidth: '48px', minHeight: '48px' }}
            >
              <Menu />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {navItems.map((item, index) => (
                <Button
                  key={index}
                  color="inherit"
                  onClick={item.onClick}
                  sx={{ minHeight: '44px' }}
                >
                  {item.label}
                </Button>
              ))}
              <Button 
                color="inherit" 
                onClick={onLogout}
                sx={{ minHeight: '44px' }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default ResponsiveNavbar;