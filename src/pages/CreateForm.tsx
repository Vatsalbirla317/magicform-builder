// Create Form page - main form builder interface
import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Grid,
  Chip,
  IconButton,
  Paper
} from '@mui/material';
import { 
  Add, 
  Save, 
  Preview, 
  Delete,
  DragIndicator,
  Edit
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { 
  createNewForm, 
  saveCurrentForm, 
  addField, 
  updateFormMetadata,
  loadSavedForms 
} from '../store/slices/formBuilderSlice';
import { localStorageUtils } from '../utils/localStorage';
import Layout from '../components/Layout';
import FieldBuilder from '../components/FieldBuilder';
import { FormField, FieldType } from '../types/formBuilder';

const CreateForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentForm } = useSelector((state: RootState) => state.formBuilder);
  
  const [newFormDialogOpen, setNewFormDialogOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [fieldBuilderOpen, setFieldBuilderOpen] = useState(false);

  useEffect(() => {
    // Load saved forms from localStorage on mount
    const savedForms = localStorageUtils.loadForms();
    dispatch(loadSavedForms(savedForms));
  }, [dispatch]);

  const handleCreateNewForm = () => {
    if (formName.trim()) {
      dispatch(createNewForm({
        name: formName.trim(),
        description: formDescription.trim() || undefined
      }));
      setNewFormDialogOpen(false);
      setFormName('');
      setFormDescription('');
    }
  };

  const handleSaveForm = () => {
    if (currentForm) {
      dispatch(saveCurrentForm());
      // Persist to localStorage
      const savedForms = localStorageUtils.loadForms();
      const existingIndex = savedForms.findIndex(f => f.id === currentForm.id);
      const updatedForm = {
        ...currentForm,
        updatedAt: new Date().toISOString()
      };
      
      if (existingIndex >= 0) {
        savedForms[existingIndex] = updatedForm;
      } else {
        savedForms.push(updatedForm);
      }
      
      localStorageUtils.saveForms(savedForms);
    }
  };

  const handleAddField = (field: Omit<FormField, 'id' | 'order'>) => {
    dispatch(addField(field as FormField));
    setFieldBuilderOpen(false);
  };

  const fieldTypes: { type: FieldType; label: string; color: string }[] = [
    { type: 'text', label: 'Text', color: 'primary' },
    { type: 'number', label: 'Number', color: 'secondary' },
    { type: 'date', label: 'Date', color: 'success' },
    { type: 'select', label: 'Select', color: 'warning' },
    { type: 'radio', label: 'Radio', color: 'info' },
    { type: 'checkbox', label: 'Checkbox', color: 'error' },
    { type: 'textarea', label: 'Textarea', color: 'primary' },
    { type: 'derived', label: 'Derived', color: 'secondary' },
  ];

  if (!currentForm) {
    return (
      <Layout>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
            Create a New Form
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => setNewFormDialogOpen(true)}
            sx={{ 
              px: 4, 
              py: 1.5,
              background: 'var(--primary-gradient)',
            }}
          >
            Start Building
          </Button>
        </Box>

        <Dialog open={newFormDialogOpen} onClose={() => setNewFormDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create New Form</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Form Name"
              fullWidth
              variant="outlined"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description (optional)"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNewFormDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateNewForm} variant="contained" disabled={!formName.trim()}>
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        {/* Form Header */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                  {currentForm.name}
                </Typography>
                {currentForm.description && (
                  <Typography color="textSecondary">
                    {currentForm.description}
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Preview />}
                  onClick={() => navigate(`/preview/${currentForm.id}`)}
                >
                  Preview
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSaveForm}
                  sx={{ background: 'var(--primary-gradient)' }}
                >
                  Save Form
                </Button>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip 
                label={`${currentForm.fields.length} fields`} 
                size="small" 
                color="primary" 
                variant="outlined" 
              />
              <Chip 
                label={`Created ${new Date(currentForm.createdAt).toLocaleDateString()}`} 
                size="small" 
                variant="outlined" 
              />
            </Box>
          </CardContent>
        </Card>

        {/* Field Types Palette */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Available Field Types
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {fieldTypes.map((fieldType) => (
              <Chip
                key={fieldType.type}
                label={fieldType.label}
                color={fieldType.color as any}
                onClick={() => setFieldBuilderOpen(true)}
                sx={{ 
                  px: 2, 
                  py: 1, 
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  transition: 'var(--transition-smooth)',
                }}
              />
            ))}
          </Box>
        </Paper>

        {/* Form Fields */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Form Fields ({currentForm.fields.length})
          </Typography>
          
          {currentForm.fields.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', border: '2px dashed', borderColor: 'divider' }}>
              <Typography color="textSecondary" sx={{ mb: 2 }}>
                No fields added yet. Click a field type above to start building your form.
              </Typography>
              <Button
                variant="contained"
                onClick={() => setFieldBuilderOpen(true)}
                sx={{ background: 'var(--primary-gradient)' }}
              >
                Add First Field
              </Button>
            </Paper>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {currentForm.fields
                .sort((a, b) => a.order - b.order)
                .map((field) => (
                  <Card key={field.id} className="field-preview">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <DragIndicator sx={{ color: 'text.secondary', cursor: 'grab' }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ mb: 1 }}>
                            {field.label}
                            {field.required && <span style={{ color: 'red' }}> *</span>}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                            <Chip 
                              label={field.type} 
                              size="small" 
                              color="primary" 
                              variant="outlined" 
                            />
                            {field.validations.length > 0 && (
                              <Chip 
                                label={`${field.validations.length} validations`} 
                                size="small" 
                                color="secondary" 
                                variant="outlined" 
                              />
                            )}
                          </Box>
                          {field.placeholder && (
                            <Typography variant="body2" color="textSecondary">
                              Placeholder: {field.placeholder}
                            </Typography>
                          )}
                        </Box>
                        <IconButton size="small" color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <Delete />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
            </Box>
          )}
        </Box>

        {/* Add Field FAB */}
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'var(--primary-gradient)',
          }}
          onClick={() => setFieldBuilderOpen(true)}
        >
          <Add />
        </Fab>

        {/* Field Builder Dialog */}
        <FieldBuilder
          open={fieldBuilderOpen}
          onClose={() => setFieldBuilderOpen(false)}
          onSave={handleAddField}
        />
      </Box>
    </Layout>
  );
};

export default CreateForm;