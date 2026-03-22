import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress } from '@mui/material';
import { useThemeMode } from '../theme/ThemeContext';

export default function AddCompetencyDialog({
  open,
  onClose,
  onAdd,
  value,
  onChange,
  disabled,
  loading = false
}) {
  const { t } = useThemeMode();

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        Додати нову компетентність
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <TextField
          autoFocus
          margin="dense"
          label="Назва компетентності"
          fullWidth
          value={value}
          onChange={onChange}
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
        <Button onClick={onClose} disabled={loading} sx={{ color: t.textMuted }}>Скасувати</Button>
        <Button
          onClick={onAdd}
          disabled={disabled}
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
