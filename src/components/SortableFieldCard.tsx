// Draggable sortable field card component
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  IconButton
} from '@mui/material';
import { DragIndicator, Edit, Delete } from '@mui/icons-material';
import { FormField } from '../types/formBuilder';

interface SortableFieldCardProps {
  field: FormField;
  onEdit: (field: FormField) => void;
  onDelete: (fieldId: string) => void;
}

const SortableFieldCard: React.FC<SortableFieldCardProps> = ({ field, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className="field-preview"
      sx={{
        cursor: isDragging ? 'grabbing' : 'default',
        '&:hover': {
          transform: isDragging ? 'none' : 'translateY(-2px)',
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <DragIndicator 
            sx={{ 
              color: 'text.secondary', 
              cursor: 'grab',
              '&:active': { cursor: 'grabbing' }
            }} 
            {...attributes} 
            {...listeners}
          />
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
              {field.defaultValue && (
                <Chip 
                  label="Has default value" 
                  size="small" 
                  color="success" 
                  variant="outlined" 
                />
              )}
            </Box>
            {field.placeholder && (
              <Typography variant="body2" color="textSecondary">
                Placeholder: {field.placeholder}
              </Typography>
            )}
            {field.defaultValue && (
              <Typography variant="body2" color="textSecondary">
                Default: {field.defaultValue}
              </Typography>
            )}
          </Box>
          <IconButton 
            size="small" 
            color="primary"
            onClick={() => onEdit(field)}
          >
            <Edit />
          </IconButton>
          <IconButton 
            size="small" 
            color="error"
            onClick={() => onDelete(field.id)}
          >
            <Delete />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SortableFieldCard;