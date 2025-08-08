// Layout component with navigation
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { Build, Preview, List, Home } from '@mui/icons-material';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: <Home /> },
    { path: '/create', label: 'Create Form', icon: <Build /> },
    { path: '/preview', label: 'Preview', icon: <Preview /> },
    { path: '/myforms', label: 'My Forms', icon: <List /> },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ background: 'var(--primary-gradient)' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            🔧 Dynamic Form Builder
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                startIcon={item.icon}
                sx={{
                  color: 'white',
                  borderRadius: 2,
                  px: 3,
                  ...(location.pathname === item.path && {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  }),
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;