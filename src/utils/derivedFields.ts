// Utilities for calculating derived fields
import { FormField, DerivedFieldFormula } from '../types/formBuilder';

// Simple formula evaluation engine
export const evaluateDerivedField = (
  formula: DerivedFieldFormula, 
  formData: Record<string, any>,
  fields: FormField[]
): any => {
  try {
    // Get dependent field values
    const context: Record<string, any> = {};
    
    for (const fieldId of formula.dependsOn) {
      const field = fields.find(f => f.id === fieldId);
      if (field) {
        context[field.label.toLowerCase().replace(/\s+/g, '_')] = formData[fieldId];
      }
    }

    // Add common utility functions
    context.today = () => new Date();
    context.age = (birthDate: string | Date) => {
      const birth = new Date(birthDate);
      const now = new Date();
      return Math.floor((now.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    };
    context.sum = (...values: number[]) => values.reduce((a, b) => (a || 0) + (b || 0), 0);
    context.avg = (...values: number[]) => {
      const sum = values.reduce((a, b) => (a || 0) + (b || 0), 0);
      return sum / values.length;
    };
    context.min = Math.min;
    context.max = Math.max;
    context.round = Math.round;
    context.floor = Math.floor;
    context.ceil = Math.ceil;

    // Simple expression evaluation for common formulas
    return evaluateExpression(formula.expression, context);
  } catch (error) {
    console.error('Error evaluating derived field formula:', error);
    return null;
  }
};

// Basic expression evaluator for simple formulas
const evaluateExpression = (expression: string, context: Record<string, any>): any => {
  // Handle simple age calculation
  if (expression.includes('age(')) {
    const birthDateMatch = expression.match(/age\((\w+)\)/);
    if (birthDateMatch) {
      const fieldName = birthDateMatch[1];
      const birthDate = context[fieldName];
      if (birthDate) {
        return context.age(birthDate);
      }
    }
  }

  // Handle simple arithmetic operations
  if (expression.includes('+') || expression.includes('-') || expression.includes('*') || expression.includes('/')) {
    // Replace field names with their values
    let evaluableExpression = expression;
    
    for (const [key, value] of Object.entries(context)) {
      if (typeof value === 'number') {
        evaluableExpression = evaluableExpression.replace(new RegExp(`\\b${key}\\b`, 'g'), value.toString());
      }
    }

    // Basic arithmetic evaluation (simple cases only)
    try {
      // Only allow safe mathematical operations
      const safeExpression = evaluableExpression.replace(/[^0-9+\-*/.() ]/g, '');
      if (safeExpression === evaluableExpression) {
        return Function(`"use strict"; return (${safeExpression})`)();
      }
    } catch (error) {
      console.error('Error evaluating arithmetic expression:', error);
    }
  }

  // Handle function calls
  const functionMatch = expression.match(/(\w+)\((.*)\)/);
  if (functionMatch) {
    const funcName = functionMatch[1];
    const args = functionMatch[2].split(',').map(arg => {
      const trimmed = arg.trim();
      // If it's a field reference, get the value
      if (context.hasOwnProperty(trimmed)) {
        return context[trimmed];
      }
      // If it's a number, parse it
      const num = parseFloat(trimmed);
      if (!isNaN(num)) {
        return num;
      }
      // Otherwise return as string
      return trimmed.replace(/['"]/g, '');
    });

    if (context[funcName] && typeof context[funcName] === 'function') {
      return context[funcName](...args);
    }
  }

  // If no complex expression, try direct field reference
  if (context.hasOwnProperty(expression)) {
    return context[expression];
  }

  return null;
};

export const updateDerivedFields = (
  fields: FormField[], 
  formData: Record<string, any>
): Record<string, any> => {
  const updatedData = { ...formData };
  
  // Find all derived fields
  const derivedFields = fields.filter(field => field.type === 'derived' && field.formula);
  
  // Calculate derived field values
  for (const field of derivedFields) {
    if (field.formula) {
      const value = evaluateDerivedField(field.formula, updatedData, fields);
      if (value !== null) {
        updatedData[field.id] = value;
      }
    }
  }
  
  return updatedData;
};
