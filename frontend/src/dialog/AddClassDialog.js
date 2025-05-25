import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

export default function AddClassDialog({ open, onClose, onAdd, value, onChange, disabled }) {
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
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onAdd} disabled={disabled}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}