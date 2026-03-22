import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress } from '@mui/material';
import { addSchool } from '../requests/schools'

export default function AddSchoolDialog({ open, onClose, onSchoolAdded }) {
  const [schoolName, setSchoolName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!schoolName.trim()) return;
    setLoading(true);
    try {
      const data = await addSchool({ name: schoolName });
      onSchoolAdded(data);
      setSchoolName('');
      onClose();
    } catch (err) {
      console.error('Error adding school:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSchoolName('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New School</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="School Name"
          fullWidth
          value={schoolName}
          onChange={e => setSchoolName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>Cancel</Button>
        <Button 
          onClick={handleAdd} 
          disabled={loading || !schoolName.trim()}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? 'Adding...' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}