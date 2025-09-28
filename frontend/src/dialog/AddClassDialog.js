import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress } from '@mui/material';

export default function AddClassDialog({ open, onClose, onAdd, value, onChange, disabled, loading = false }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Class</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Class Name"
          fullWidth
          value={value}
          onChange={onChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button 
          onClick={onAdd} 
          disabled={disabled}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? 'Adding...' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}