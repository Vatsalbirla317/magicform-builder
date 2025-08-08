// Form Builder Redux slice
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormBuilderState, FormSchema, FormField } from '../../types/formBuilder';
import { v4 as uuidv4 } from 'uuid';

const initialState: FormBuilderState = {
  currentForm: null,
  savedForms: [],
  isLoading: false,
  error: null,
};

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    // Form management
    createNewForm: (state, action: PayloadAction<{ name: string; description?: string }>) => {
      const newForm: FormSchema = {
        id: uuidv4(),
        name: action.payload.name,
        description: action.payload.description,
        fields: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.currentForm = newForm;
    },

    loadForm: (state, action: PayloadAction<string>) => {
      const form = state.savedForms.find(f => f.id === action.payload);
      if (form) {
        state.currentForm = { ...form };
      }
    },

    saveCurrentForm: (state) => {
      if (state.currentForm) {
        const updatedForm = {
          ...state.currentForm,
          updatedAt: new Date().toISOString(),
        };
        
        const existingIndex = state.savedForms.findIndex(f => f.id === updatedForm.id);
        if (existingIndex >= 0) {
          state.savedForms[existingIndex] = updatedForm;
        } else {
          state.savedForms.push(updatedForm);
        }
        state.currentForm = updatedForm;
      }
    },

    loadSavedForms: (state, action: PayloadAction<FormSchema[]>) => {
      state.savedForms = action.payload;
    },

    deleteForm: (state, action: PayloadAction<string>) => {
      state.savedForms = state.savedForms.filter(f => f.id !== action.payload);
      if (state.currentForm?.id === action.payload) {
        state.currentForm = null;
      }
    },

    // Field management
    addField: (state, action: PayloadAction<FormField>) => {
      if (state.currentForm) {
        const newField = {
          ...action.payload,
          id: uuidv4(),
          order: state.currentForm.fields.length,
        };
        state.currentForm.fields.push(newField);
      }
    },

    updateField: (state, action: PayloadAction<{ fieldId: string; updates: Partial<FormField> }>) => {
      if (state.currentForm) {
        const fieldIndex = state.currentForm.fields.findIndex(f => f.id === action.payload.fieldId);
        if (fieldIndex >= 0) {
          state.currentForm.fields[fieldIndex] = {
            ...state.currentForm.fields[fieldIndex],
            ...action.payload.updates,
          };
        }
      }
    },

    deleteField: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        state.currentForm.fields = state.currentForm.fields
          .filter(f => f.id !== action.payload)
          .map((field, index) => ({
            ...field,
            order: index,
          }));
      }
    },

    reorderFields: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      if (state.currentForm) {
        const { fromIndex, toIndex } = action.payload;
        const fields = [...state.currentForm.fields];
        const [movedField] = fields.splice(fromIndex, 1);
        fields.splice(toIndex, 0, movedField);
        
        // Update order values by creating new field objects
        state.currentForm.fields = fields.map((field, index) => ({
          ...field,
          order: index,
        }));
      }
    },

    // Form metadata
    updateFormMetadata: (state, action: PayloadAction<{ name?: string; description?: string }>) => {
      if (state.currentForm) {
        if (action.payload.name !== undefined) {
          state.currentForm.name = action.payload.name;
        }
        if (action.payload.description !== undefined) {
          state.currentForm.description = action.payload.description;
        }
        state.currentForm.updatedAt = new Date().toISOString();
      }
    },

    // UI state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    clearCurrentForm: (state) => {
      state.currentForm = null;
    },
  },
});

export const {
  createNewForm,
  loadForm,
  saveCurrentForm,
  loadSavedForms,
  deleteForm,
  addField,
  updateField,
  deleteField,
  reorderFields,
  updateFormMetadata,
  setLoading,
  setError,
  clearCurrentForm,
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;