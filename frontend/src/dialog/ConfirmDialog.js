import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material'
import { useThemeMode } from '../theme/ThemeContext'

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  const { t } = useThemeMode();

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: t.bgDialog,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${t.borderDanger}`,
        }
      }}
    >
      <DialogTitle sx={{
        color: t.textPrimary,
        fontWeight: 700,
        borderBottom: `1px solid ${t.borderDanger}`,
      }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <DialogContentText sx={{ color: t.textMuted }}>{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onCancel} sx={{ color: t.textMuted }}>Скасувати</Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            background: t.btnDangerGradient,
            fontWeight: 600,
            '&:hover': {
              background: t.btnDangerGradientHover,
              boxShadow: `0 0 15px ${t.accentDanger}40`,
            }
          }}
        >
          Видалити
        </Button>
      </DialogActions>
    </Dialog>
  )
}
