// LocalStorage utilities for form persistence
import { FormSchema } from '../types/formBuilder';

const FORMS_STORAGE_KEY = 'formBuilder_savedForms';

export const localStorageUtils = {
  // Save forms to localStorage
  saveForms: (forms: FormSchema[]): void => {
    try {
      localStorage.setItem(FORMS_STORAGE_KEY, JSON.stringify(forms));
    } catch (error) {
      console.error('Failed to save forms to localStorage:', error);
    }
  },

  // Load forms from localStorage
  loadForms: (): FormSchema[] => {
    try {
      const stored = localStorage.getItem(FORMS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load forms from localStorage:', error);
      return [];
    }
  },

  // Save a single form
  saveForm: (form: FormSchema): void => {
    const forms = localStorageUtils.loadForms();
    const existingIndex = forms.findIndex(f => f.id === form.id);
    
    if (existingIndex >= 0) {
      forms[existingIndex] = form;
    } else {
      forms.push(form);
    }
    
    localStorageUtils.saveForms(forms);
  },

  // Delete a form
  deleteForm: (formId: string): void => {
    const forms = localStorageUtils.loadForms();
    const filteredForms = forms.filter(f => f.id !== formId);
    localStorageUtils.saveForms(filteredForms);
  },

  // Clear all forms
  clearForms: (): void => {
    try {
      localStorage.removeItem(FORMS_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear forms from localStorage:', error);
    }
  },
};