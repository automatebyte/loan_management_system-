import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: 'primary' | 'success' | 'error' | 'warning' | 'info';
  prefix?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color = 'primary', 
  prefix = '' 
}) => (
  <Card sx={{ 
    transition: 'all 0.2s ease-in-out',
    '&:hover': { 
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
    },
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    border: '1px solid #e2e8f0'
  }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography 
            color="textSecondary" 
            gutterBottom 
            sx={{ fontSize: '0.875rem', fontWeight: 500, mb: 1 }}
          >
            {title}
          </Typography>
          <Typography 
            variant="h4" 
            component="div" 
            color={color} 
            sx={{ fontWeight: 700, fontSize: '1.875rem' }}
          >
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
          </Typography>
        </Box>
        {icon && (
          <Box sx={{ color: '#6b7280', opacity: 0.7 }}>
            {icon}
          </Box>
        )}
      </Box>
    </CardContent>
  </Card>
);

export default StatCard;