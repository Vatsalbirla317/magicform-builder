// My Forms page - displays all saved forms
import React, { useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button,
  Grid,
  Chip,
  IconButton,
  Paper,
  Alert
} from '@mui/material';
import { 
  Preview, 
  Edit, 
  Delete,
  Add,
  CalendarToday,
  Description
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { loadSavedForms, deleteForm, loadForm } from '../store/slices/formBuilderSlice';
import { localStorageUtils } from '../utils/localStorage';
import Layout from '../components/Layout';

const MyForms = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { savedForms } = useSelector((state: RootState) => state.formBuilder);

  useEffect(() => {
    // Load saved forms from localStorage
    const forms = localStorageUtils.loadForms();
    dispatch(loadSavedForms(forms));
  }, [dispatch]);

  const handleEditForm = (formId: string) => {
    dispatch(loadForm(formId));
    navigate('/create');
  };

  const handlePreviewForm = (formId: string) => {
    navigate(`/preview/${formId}`);
  };

  const handleDeleteForm = (formId: string) => {
    if (window.confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      dispatch(deleteForm(formId));
      localStorageUtils.deleteForm(formId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              My Forms
            </Typography>
            <Typography color="textSecondary">
              Manage and organize your saved forms
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/create')}
            sx={{ 
              background: 'var(--primary-gradient)',
              px: 3,
              py: 1.5
            }}
          >
            Create New Form
          </Button>
        </Box>

        {savedForms.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Description sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              No forms created yet
            </Typography>
            <Typography color="textSecondary" sx={{ mb: 4 }}>
              Start building your first dynamic form with our powerful form builder.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/create')}
              sx={{ background: 'var(--primary-gradient)' }}
            >
              Create Your First Form
            </Button>
          </Paper>
        ) : (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 3 
          }}>
            {savedForms
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .map((form) => (
                <Card 
                  key={form.id}
                  sx={{ 
                    height: '100%',
                    transition: 'var(--transition-smooth)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 'var(--shadow-lg)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {form.name}
                      </Typography>
                      {form.description && (
                        <Typography 
                          variant="body2" 
                          color="textSecondary" 
                          sx={{ 
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {form.description}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                      <Chip 
                        label={`${form.fields.length} fields`} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                      <Chip 
                        icon={<CalendarToday sx={{ fontSize: 16 }} />}
                        label={formatDate(form.updatedAt)}
                        size="small" 
                        variant="outlined" 
                      />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Preview />}
                        onClick={() => handlePreviewForm(form.id)}
                        sx={{ 
                          flex: 1,
                          background: 'var(--primary-gradient)',
                        }}
                      >
                        Preview
                      </Button>
                      <IconButton
                        size="small"
                        onClick={() => handleEditForm(form.id)}
                        sx={{ 
                          color: 'primary.main',
                          border: '1px solid',
                          borderColor: 'primary.main',
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteForm(form.id)}
                        sx={{ 
                          color: 'error.main',
                          border: '1px solid',
                          borderColor: 'error.main',
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default MyForms;