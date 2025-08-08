// TypeScript types for the Dynamic Form Builder

export type FieldType = 
  | 'text' 
  | 'number' 
  | 'date' 
  | 'select' 
  | 'radio' 
  | 'checkbox' 
  | 'textarea'
  | 'derived';

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'password' | 'min' | 'max' | 'custom';
  value?: string | number;
  message: string;
}

export interface FieldOption {
  label: string;
  value: string;
}

export interface DerivedFieldFormula {
  expression: string; // e.g., "age = today() - birthDate"
  dependsOn: string[]; // Field IDs this formula depends on
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  validations: ValidationRule[];
  options?: FieldOption[]; // For select, radio
  defaultValue?: string | number | string[] | Date;
  formula?: DerivedFieldFormula; // For derived fields
  order: number;
}

export interface FormSchema {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}

export interface FormBuilderState {
  currentForm: FormSchema | null;
  savedForms: FormSchema[];
  isLoading: boolean;
  error: string | null;
}

export interface FormSubmission {
  formId: string;
  data: Record<string, string | number | string[] | Date>;
  submittedAt: string;
}

// Validation error structure
export interface FieldError {
  fieldId: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: FieldError[];
}