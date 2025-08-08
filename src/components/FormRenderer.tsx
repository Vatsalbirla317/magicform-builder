// Form Renderer component for displaying and interacting with forms
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  Button,
  Alert,
  Paper,
  Typography,
  Grid,
  Snackbar
} from '@mui/material';
// We'll use regular date input for now instead of MUI date picker to avoid dependency issues
import { FormSchema, FormField, FieldError } from '../types/formBuilder';
import { validateForm } from '../utils/validation';
import { updateDerivedFields } from '../utils/derivedFields';

interface FormRendererProps {
  form: FormSchema;
  onSubmit?: (data: Record<string, string | number | string[] | Date>) => void;
  showSubmitButton?: boolean;
}

const FormRenderer: React.FC<FormRendererProps> = ({ 
  form, 
  onSubmit, 
  showSubmitButton = true 
}) => {
  // Initialize form data with default values
  const initializeFormData = (fields: FormField[]) => {
    const initialData: Record<string, string | number | string[] | Date> = {};
    fields.forEach(field => {
      initialData[field.id] = field.defaultValue || '';
    });
    return initialData;
  };

  const [formData, setFormData] = useState<Record<string, string | number | string[] | Date>>(() => initializeFormData(form.fields));
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Update form data when form changes
  useEffect(() => {
    setFormData(initializeFormData(form.fields));
  }, [form.fields]);

  // Update derived fields whenever form data changes
  useEffect(() => {
    const updatedData = updateDerivedFields(form.fields, formData);
    if (JSON.stringify(updatedData) !== JSON.stringify(formData)) {
      setFormData(updatedData);
    }
  }, [formData, form.fields]);

  const handleFieldChange = (fieldId: string, value: string | number | string[] | Date) => {
    const newFormData = { ...formData, [fieldId]: value };
    setFormData(newFormData);
    setTouched({ ...touched, [fieldId]: true });

    // Validate the specific field
    const field = form.fields.find(f => f.id === fieldId);
    if (field) {
      const validationResult = validateForm([field], newFormData);
      setErrors(prevErrors => [
        ...prevErrors.filter(e => e.fieldId !== fieldId),
        ...validationResult.errors
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      // Validate all fields
      const validationResult = validateForm(form.fields, formData);
      setErrors(validationResult.errors);
      
      // Mark all fields as touched
      const allTouched = form.fields.reduce((acc, field) => {
        acc[field.id] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setTouched(allTouched);

      if (validationResult.isValid && onSubmit) {
        await onSubmit(formData);
        setShowSuccess(true);
        // Reset form after successful submission
        setTimeout(() => {
          setFormData(initializeFormData(form.fields));
          setTouched({});
          setErrors([]);
        }, 2000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors([{ fieldId: 'general', message: 'An error occurred while submitting the form. Please try again.' }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (fieldId: string): string | undefined => {
    const error = errors.find(e => e.fieldId === fieldId);
    return touched[fieldId] ? error?.message : undefined;
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id] || '';
    const error = getFieldError(field.id);
    const hasError = Boolean(error);

    switch (field.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            label={field.label}
            placeholder={field.placeholder}
            value={value as string}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
            error={hasError}
            helperText={error}
            disabled={isSubmitting}
          />
        );

      case 'number':
        return (
          <TextField
            fullWidth
            type="number"
            label={field.label}
            placeholder={field.placeholder}
            value={value as number}
            onChange={(e) => handleFieldChange(field.id, parseFloat(e.target.value) || '')}
            required={field.required}
            error={hasError}
            helperText={error}
            disabled={isSubmitting}
          />
        );

      case 'date':
        return (
          <TextField
            fullWidth
            type="date"
            label={field.label}
            placeholder={field.placeholder}
            value={value ? new Date(value as string).toISOString().split('T')[0] : ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value ? new Date(e.target.value).toISOString() : '')}
            required={field.required}
            error={hasError}
            helperText={error}
            InputLabelProps={{ shrink: true }}
            disabled={isSubmitting}
          />
        );

      case 'select':
        return (
          <FormControl fullWidth required={field.required} error={hasError} disabled={isSubmitting}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value as string}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              label={field.label}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {error && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                {error}
              </Typography>
            )}
          </FormControl>
        );

      case 'radio':
        return (
          <FormControl required={field.required} error={hasError} disabled={isSubmitting}>
            <FormLabel>{field.label}</FormLabel>
            <RadioGroup
              value={value as string}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
            >
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {error && (
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            )}
          </FormControl>
        );

      case 'checkbox': {
        const checkboxValues = Array.isArray(value) ? value : [];
        return (
          <FormControl required={field.required} error={hasError} disabled={isSubmitting}>
            <FormLabel>{field.label}</FormLabel>
            <FormGroup>
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      checked={checkboxValues.includes(option.value)}
                      onChange={(e) => {
                        const newValues = e.target.checked
                          ? [...checkboxValues, option.value]
                          : checkboxValues.filter(v => v !== option.value);
                        handleFieldChange(field.id, newValues);
                      }}
                    />
                  }
                  label={option.label}
                />
              ))}
            </FormGroup>
            {error && (
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            )}
          </FormControl>
        );
      }

      case 'textarea':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            label={field.label}
            placeholder={field.placeholder}
            value={value as string}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
            error={hasError}
            helperText={error}
            disabled={isSubmitting}
          />
        );

      case 'derived':
        return (
          <TextField
            fullWidth
            label={field.label}
            value={value || 'Calculating...'}
            InputProps={{ readOnly: true }}
            variant="filled"
            disabled={isSubmitting}
            sx={{ 
              '& .MuiFilledInput-root': { 
                backgroundColor: 'action.hover' 
              } 
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {[...form.fields]
              .sort((a, b) => a.order - b.order)
              .map((field) => (
                <Box key={field.id}>
                  {renderField(field)}
                </Box>
              ))}
          </Box>

          {errors.length > 0 && (
            <Alert severity="error" sx={{ mt: 3 }}>
              Please fix the following errors:
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {errors.map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
            </Alert>
          )}

          {showSubmitButton && (
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting}
                sx={{ 
                  px: 4,
                  py: 1.5,
                  background: 'var(--primary-gradient)',
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Form'}
              </Button>
            </Box>
          )}
        </form>
      </Paper>

      {/* Success Message */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        message="Form submitted successfully!"
      />
    </>
  );
};

export default FormRenderer;