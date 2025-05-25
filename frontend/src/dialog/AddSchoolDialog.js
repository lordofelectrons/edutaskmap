import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

export default function AddSchoolDialog({ open, onClose, onSchoolAdded }) {
  const [schoolName, setSchoolName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!schoolName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: schoolName }),
      });
      if (res.ok) {
        onSchoolAdded(schoolName);
        setSchoolName('');
        onClose();
      } else {
        // handle error as needed
      }
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
        <Button onClick={handleAdd} disabled={loading || !schoolName.trim()}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}