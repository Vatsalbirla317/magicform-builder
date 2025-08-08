// Form name confirmation dialog for saving
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';

interface FormNameDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  currentName?: string;
}

const FormNameDialog: React.FC<FormNameDialogProps> = ({
  open,
  onClose,
  onSave,
  currentName = ''
}) => {
  const [formName, setFormName] = useState(currentName);

  useEffect(() => {
    setFormName(currentName);
  }, [currentName, open]);

  const handleSave = () => {
    if (formName.trim()) {
      onSave(formName.trim());
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Save Form</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Form Name"
          fullWidth
          variant="outlined"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          placeholder="Enter a name for your form"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={!formName.trim()}
          sx={{ background: 'var(--primary-gradient)' }}
        >
          Save Form
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormNameDialog;