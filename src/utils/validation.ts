// Form validation utilities
import { FormField, ValidationRule, FieldError, FormValidationResult } from '../types/formBuilder';

export const validateField = (field: FormField, value: any): FieldError[] => {
  const errors: FieldError[] = [];

  // Check required validation
  if (field.required && (value === null || value === undefined || value === '')) {
    errors.push({
      fieldId: field.id,
      message: `${field.label} is required`,
    });
    return errors; // If required and empty, no need to check other validations
  }

  // If field is empty and not required, skip other validations
  if (value === null || value === undefined || value === '') {
    return errors;
  }

  // Apply each validation rule
  for (const rule of field.validations) {
    const error = applyValidationRule(field, value, rule);
    if (error) {
      errors.push(error);
    }
  }

  return errors;
};

const applyValidationRule = (field: FormField, value: any, rule: ValidationRule): FieldError | null => {
  switch (rule.type) {
    case 'required':
      if (value === null || value === undefined || value === '') {
        return { fieldId: field.id, message: rule.message };
      }
      break;

    case 'minLength':
      if (typeof value === 'string' && rule.value && typeof rule.value === 'number' && value.length < rule.value) {
        return { fieldId: field.id, message: rule.message };
      }
      break;

    case 'maxLength':
      if (typeof value === 'string' && rule.value && typeof rule.value === 'number' && value.length > rule.value) {
        return { fieldId: field.id, message: rule.message };
      }
      break;

    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (typeof value === 'string' && !emailRegex.test(value)) {
        return { fieldId: field.id, message: rule.message };
      }
      break;

    case 'password':
      // Basic password validation: at least 8 chars, 1 uppercase, 1 lowercase, 1 number
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
      if (typeof value === 'string' && !passwordRegex.test(value)) {
        return { fieldId: field.id, message: rule.message };
      }
      break;

    case 'min':
      if (typeof value === 'number' && rule.value && typeof rule.value === 'number' && value < rule.value) {
        return { fieldId: field.id, message: rule.message };
      }
      break;

    case 'max':
      if (typeof value === 'number' && rule.value && typeof rule.value === 'number' && value > rule.value) {
        return { fieldId: field.id, message: rule.message };
      }
      break;

    case 'custom':
      // For custom validation, the rule.value should contain a regex pattern
      if (rule.value && typeof value === 'string') {
        try {
          const customRegex = new RegExp(rule.value as string);
          if (!customRegex.test(value)) {
            return { fieldId: field.id, message: rule.message };
          }
        } catch (error) {
          console.error('Invalid custom validation regex:', rule.value);
        }
      }
      break;
  }

  return null;
};

export const validateForm = (fields: FormField[], formData: Record<string, any>): FormValidationResult => {
  const allErrors: FieldError[] = [];

  for (const field of fields) {
    if (field.type !== 'derived') { // Skip validation for derived fields
      const fieldErrors = validateField(field, formData[field.id]);
      allErrors.push(...fieldErrors);
    }
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
};