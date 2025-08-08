// Field Builder component for creating and editing form fields
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  IconButton,
  Divider,
  Alert
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { FormField, FieldType, ValidationRule, FieldOption, DerivedFieldFormula } from '../types/formBuilder';

interface FieldBuilderProps {
  open: boolean;
  onClose: () => void;
  onSave: (field: Omit<FormField, 'id' | 'order'>) => void;
  field?: FormField;
  currentForm?: { fields: FormField[] };
}

const FieldBuilder: React.FC<FieldBuilderProps> = ({ open, onClose, onSave, field, currentForm }) => {
  const [fieldType, setFieldType] = useState<FieldType>(field?.type || 'text');
  const [label, setLabel] = useState(field?.label || '');
  const [placeholder, setPlaceholder] = useState(field?.placeholder || '');
  const [required, setRequired] = useState(field?.required || false);
  const [defaultValue, setDefaultValue] = useState(field?.defaultValue || '');
  const [validations, setValidations] = useState<ValidationRule[]>(field?.validations || []);
  const [options, setOptions] = useState<FieldOption[]>(field?.options || []);
  const [newOption, setNewOption] = useState({ label: '', value: '' });
  
  // Derived field states
  const [parentFields, setParentFields] = useState<string[]>(field?.formula?.dependsOn || []);
  const [formula, setFormula] = useState(field?.formula?.expression || '');
  const [formulaPreview, setFormulaPreview] = useState<string>('');

  // Update form when editing existing field
  useEffect(() => {
    if (field) {
      setFieldType(field.type);
      setLabel(field.label);
      setPlaceholder(field.placeholder || '');
      setRequired(field.required || false);
      setDefaultValue(field.defaultValue || '');
      setValidations(field.validations || []);
      setOptions(field.options || []);
      setParentFields(field.formula?.dependsOn || []);
      setFormula(field.formula?.expression || '');
    }
  }, [field]);

  // Update formula preview when formula or parent fields change
  useEffect(() => {
    if (fieldType === 'derived' && formula && parentFields.length > 0) {
      setFormulaPreview(`Formula: ${formula}`);
    } else {
      setFormulaPreview('');
    }
  }, [formula, parentFields, fieldType]);

  const fieldTypes: { value: FieldType; label: string }[] = [
    { value: 'text', label: 'Text Input' },
    { value: 'number', label: 'Number Input' },
    { value: 'date', label: 'Date Picker' },
    { value: 'select', label: 'Select Dropdown' },
    { value: 'radio', label: 'Radio Buttons' },
    { value: 'checkbox', label: 'Checkboxes' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'derived', label: 'Derived Field' },
  ];

  const validationTypes = [
    { value: 'required', label: 'Required' },
    { value: 'minLength', label: 'Minimum Length' },
    { value: 'maxLength', label: 'Maximum Length' },
    { value: 'email', label: 'Email Format' },
    { value: 'password', label: 'Strong Password' },
    { value: 'min', label: 'Minimum Value' },
    { value: 'max', label: 'Maximum Value' },
    { value: 'custom', label: 'Custom Regex' },
  ];

  const handleSave = () => {
    const newField: Omit<FormField, 'id' | 'order'> = {
      type: fieldType,
      label: label.trim(),
      placeholder: placeholder.trim() || undefined,
      required,
      defaultValue: defaultValue.trim() || undefined,
      validations,
      ...(needsOptions() && { options }),
      ...(fieldType === 'derived' && {
        formula: {
          expression: formula,
          dependsOn: parentFields
        }
      }),
    };

    onSave(newField);
    handleClose();
  };

  const handleClose = () => {
    // Reset form
    setFieldType('text');
    setLabel('');
    setPlaceholder('');
    setRequired(false);
    setDefaultValue('');
    setValidations([]);
    setOptions([]);
    setNewOption({ label: '', value: '' });
    setParentFields([]);
    setFormula('');
    setFormulaPreview('');
    onClose();
  };

  const needsOptions = () => {
    return ['select', 'radio', 'checkbox'].includes(fieldType);
  };

  const addValidation = (type: ValidationRule['type']) => {
    const newValidation: ValidationRule = {
      type,
      message: getDefaultValidationMessage(type),
    };
    setValidations([...validations, newValidation]);
  };

  const removeValidation = (index: number) => {
    setValidations(validations.filter((_, i) => i !== index));
  };

  const updateValidation = (index: number, updates: Partial<ValidationRule>) => {
    const updated = [...validations];
    updated[index] = { ...updated[index], ...updates };
    setValidations(updated);
  };

  const getDefaultValidationMessage = (type: ValidationRule['type']): string => {
    switch (type) {
      case 'required': return 'This field is required';
      case 'minLength': return 'Must be at least X characters';
      case 'maxLength': return 'Must be no more than X characters';
      case 'email': return 'Please enter a valid email address';
      case 'password': return 'Password must be at least 8 characters with uppercase, lowercase, and number';
      case 'min': return 'Value must be at least X';
      case 'max': return 'Value must be no more than X';
      case 'custom': return 'Invalid format';
      default: return 'Invalid value';
    }
  };

  const addOption = () => {
    if (newOption.label.trim() && newOption.value.trim()) {
      setOptions([...options, { ...newOption }]);
      setNewOption({ label: '', value: '' });
    }
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const addFormulaTemplate = (template: string) => {
    setFormula(template);
  };

  const formulaTemplates = [
    { label: 'Age from Birth Date', formula: 'age(birthDate)' },
    { label: 'Sum of Numbers', formula: 'sum(field1, field2)' },
    { label: 'Average of Numbers', formula: 'avg(field1, field2, field3)' },
    { label: 'Today\'s Date', formula: 'today()' },
  ];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {field ? 'Edit Field' : 'Add New Field'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {/* Basic Field Configuration */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Field Type</InputLabel>
                <Select
                  value={fieldType}
                  onChange={(e) => setFieldType(e.target.value as FieldType)}
                  label="Field Type"
                >
                  {fieldTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={required}
                    onChange={(e) => setRequired(e.target.checked)}
                  />
                }
                label="Required Field"
              />
            </Box>
            <TextField
              fullWidth
              label="Field Label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Placeholder Text"
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
            />
            <TextField
              fullWidth
              label="Default Value"
              value={defaultValue}
              onChange={(e) => setDefaultValue(e.target.value)}
              helperText="This value will be pre-filled when the form is displayed"
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Derived Field Configuration */}
          {fieldType === 'derived' && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Derived Field Configuration
              </Typography>
              
              {/* Parent Fields Selection */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Parent Fields</InputLabel>
                <Select
                  multiple
                  value={parentFields}
                  onChange={(e) => setParentFields(e.target.value as string[])}
                  label="Parent Fields"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const field = currentForm?.fields.find(f => f.id === value);
                        return (
                          <Chip key={value} label={field?.label || value} size="small" />
                        );
                      })}
                    </Box>
                  )}
                >
                  {currentForm?.fields
                    .filter(f => f.id !== field?.id && f.type !== 'derived')
                    .map((f) => (
                      <MenuItem key={f.id} value={f.id}>
                        {f.label} ({f.type})
                      </MenuItem>
                    ))}
                </Select>
                <Typography variant="caption" color="textSecondary">
                  Select the fields this derived field depends on
                </Typography>
              </FormControl>

              {/* Formula Input */}
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Formula"
                value={formula}
                onChange={(e) => setFormula(e.target.value)}
                placeholder="Example: age(birthDate) or sum(field1, field2)"
                helperText="Use field labels and functions like age(), sum(), avg(), today()"
                sx={{ mb: 2 }}
              />

              {/* Formula Templates */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  Common formula templates:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formulaTemplates.map((template) => (
                    <Chip
                      key={template.label}
                      label={template.label}
                      onClick={() => addFormulaTemplate(template.formula)}
                      variant="outlined"
                      size="small"
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Formula Preview */}
              {formulaPreview && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  {formulaPreview}
                </Alert>
              )}

              {/* Validation for derived fields */}
              {parentFields.length === 0 && (
                <Alert severity="warning">
                  Please select at least one parent field for the derived field.
                </Alert>
              )}
              {formula.trim() === '' && (
                <Alert severity="warning">
                  Please enter a formula for the derived field.
                </Alert>
              )}
            </Box>
          )}

          {/* Options for select/radio/checkbox fields */}
          {needsOptions() && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Field Options
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                <TextField
                  size="small"
                  label="Option Label"
                  value={newOption.label}
                  onChange={(e) => setNewOption({ ...newOption, label: e.target.value })}
                  sx={{ flex: 1 }}
                />
                <TextField
                  size="small"
                  label="Option Value"
                  value={newOption.value}
                  onChange={(e) => setNewOption({ ...newOption, value: e.target.value })}
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="contained"
                  onClick={addOption}
                  disabled={!newOption.label.trim() || !newOption.value.trim()}
                  sx={{ minWidth: 'auto' }}
                >
                  <Add />
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {options.map((option, index) => (
                  <Chip
                    key={index}
                    label={option.label}
                    onDelete={() => removeOption(index)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Validations */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Validations
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Add validation rules:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {validationTypes.map((validation) => (
                  <Chip
                    key={validation.value}
                    label={validation.label}
                    onClick={() => addValidation(validation.value as ValidationRule['type'])}
                    variant="outlined"
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </Box>
            {validations.map((validation, index) => (
              <Card key={index} sx={{ mb: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ minWidth: 120 }}>
                      {validationTypes.find(v => v.value === validation.type)?.label}
                    </Typography>
                    {['minLength', 'maxLength', 'min', 'max'].includes(validation.type) && (
                      <TextField
                        size="small"
                        type="number"
                        label="Value"
                        value={validation.value || ''}
                        onChange={(e) => updateValidation(index, { value: parseInt(e.target.value) })}
                        sx={{ width: 120 }}
                      />
                    )}
                    {validation.type === 'custom' && (
                      <TextField
                        size="small"
                        label="Regex Pattern"
                        value={validation.value || ''}
                        onChange={(e) => updateValidation(index, { value: e.target.value })}
                        sx={{ flex: 1 }}
                      />
                    )}
                    <TextField
                      size="small"
                      label="Error Message"
                      value={validation.message}
                      onChange={(e) => updateValidation(index, { message: e.target.value })}
                      sx={{ flex: 1 }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeValidation(index)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={!label.trim() || (fieldType === 'derived' && (parentFields.length === 0 || formula.trim() === ''))}
          sx={{ background: 'var(--primary-gradient)' }}
        >
          {field ? 'Update Field' : 'Add Field'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FieldBuilder;