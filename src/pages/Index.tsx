// Home page for the Form Builder
import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Container,
  Paper,
  Chip
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Build, Preview, List, ArrowForward } from '@mui/icons-material';
import Layout from '../components/Layout';

const Index = () => {
  const features = [
    {
      icon: <Build sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Create Dynamic Forms',
      description: 'Build forms with various field types, validations, and derived fields using a powerful visual editor.',
      path: '/create',
      buttonText: 'Start Building'
    },
    {
      icon: <Preview sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Live Preview',
      description: 'Test your forms in real-time with live validation and derived field calculations.',
      path: '/preview',
      buttonText: 'Preview Forms'
    },
    {
      icon: <List sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Manage Forms',
      description: 'View, edit, and organize all your saved forms with persistent localStorage.',
      path: '/myforms',
      buttonText: 'View Forms'
    }
  ];

  return (
    <Layout>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 700, 
              mb: 3,
              background: 'var(--primary-gradient)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Dynamic Form Builder
          </Typography>
          <Typography 
            variant="h5" 
            color="textSecondary" 
            sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
          >
            Create powerful, interactive forms with advanced validation, derived fields, and real-time preview capabilities.
          </Typography>
          <Button
            component={Link}
            to="/create"
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              background: 'var(--primary-gradient)',
              boxShadow: 'var(--shadow-lg)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 'var(--shadow-xl)',
              },
              transition: 'var(--transition-smooth)',
            }}
          >
            Get Started
          </Button>
        </Box>

        {/* Features Grid */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 4,
          mb: 6 
        }}>
          {features.map((feature, index) => (
            <Card 
              key={index}
              sx={{ 
                height: '100%',
                transition: 'var(--transition-smooth)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 'var(--shadow-lg)',
                }
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Box sx={{ mb: 3 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography color="textSecondary" sx={{ mb: 3 }}>
                  {feature.description}
                </Typography>
                <Button
                  component={Link}
                  to={feature.path}
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                >
                  {feature.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Tech Stack */}
        <Paper sx={{ p: 4, textAlign: 'center', background: 'var(--background-secondary)' }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Built with Modern Technologies
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
            {[
              'React',
              'TypeScript', 
              'Material-UI',
              'Redux Toolkit',
              'React Router',
              'localStorage',
              'Form Validation'
            ].map((tech) => (
              <Chip 
                key={tech} 
                label={tech} 
                variant="outlined" 
                sx={{ 
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  fontWeight: 500
                }} 
              />
            ))}
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
};

export default Index;