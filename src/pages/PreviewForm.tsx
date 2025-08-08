// Preview Form page - renders forms for end-users
import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { loadForm, loadSavedForms } from '../store/slices/formBuilderSlice';
import { localStorageUtils } from '../utils/localStorage';
import Layout from '../components/Layout';
import FormRenderer from '../components/FormRenderer';

const PreviewForm = () => {
  const { formId } = useParams<{ formId: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentForm, savedForms } = useSelector((state: RootState) => state.formBuilder);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFormData = async () => {
      try {
        // Load saved forms from localStorage
        const savedForms = localStorageUtils.loadForms();
        dispatch(loadSavedForms(savedForms));

        if (formId) {
          // Load specific form
          const form = savedForms.find(f => f.id === formId);
          if (form) {
            dispatch(loadForm(formId));
          }
        }
      } catch (error) {
        console.error('Error loading form:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFormData();
  }, [formId, dispatch]);

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (!currentForm && formId) {
    return (
      <Layout>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Alert severity="error" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
            Form not found. The form may have been deleted or the link is invalid.
          </Alert>
          <Button
            variant="contained"
            onClick={() => navigate('/myforms')}
            sx={{ background: 'var(--primary-gradient)' }}
          >
            View My Forms
          </Button>
        </Box>
      </Layout>
    );
  }

  if (!currentForm) {
    return (
      <Layout>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
            Preview Forms
          </Typography>
          <Typography color="textSecondary" sx={{ mb: 4 }}>
            No form selected for preview. Choose a form from your saved forms.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/myforms')}
            sx={{ background: 'var(--primary-gradient)' }}
          >
            View My Forms
          </Button>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
              {currentForm.name}
            </Typography>
            {currentForm.description && (
              <Typography color="textSecondary" sx={{ mb: 2 }}>
                {currentForm.description}
              </Typography>
            )}
            <Typography variant="body2" color="textSecondary">
              Form Preview • {currentForm.fields.length} fields
            </Typography>
          </CardContent>
        </Card>

        <FormRenderer form={currentForm} />
      </Box>
    </Layout>
  );
};

export default PreviewForm;