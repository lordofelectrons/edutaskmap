import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress } from '@mui/material';
import { addSchool } from '../requests/schools'
import { useThemeMode } from '../theme/ThemeContext';

export default function AddSchoolDialog({ open, onClose, onSchoolAdded }) {
  const [schoolName, setSchoolName] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useThemeMode();

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
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: t.bgDialog,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${t.borderSubtle}`,
        }
      }}
    >
      <DialogTitle sx={{
        background: `linear-gradient(135deg, ${t.accentPrimary}20, ${t.accentSecondary}20)`,
        color: t.textPrimary,
        fontWeight: 700,
        letterSpacing: '0.03em',
        borderBottom: `1px solid ${t.divider}`,
      }}>
        Додати нову шкільну команду
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <TextField
          autoFocus
          margin="dense"
          label="Назва шкільної команди"
          fullWidth
          value={schoolName}
          onChange={e => setSchoolName(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              color: t.textPrimary,
              '& fieldset': { borderColor: t.borderMedium },
              '&:hover fieldset': { borderColor: t.accentPrimary },
              '&.Mui-focused fieldset': { borderColor: t.borderFocus },
            },
            '& .MuiInputLabel-root': { color: t.textDim },
            '& .MuiInputLabel-root.Mui-focused': { color: t.accentPrimary },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={loading} sx={{ color: t.textMuted }}>Скасувати</Button>
        <Button
          onClick={handleAdd}
          disabled={loading || !schoolName.trim()}
          variant="contained"
          startIcon={loading ? <CircularProgress size={16} /> : null}
          sx={{
            background: t.btnGradient,
            fontWeight: 600,
            '&:hover': {
              background: t.btnGradientHover,
            }
          }}
        >
          {loading ? 'Додавання...' : 'Додати'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
