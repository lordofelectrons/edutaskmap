import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
  Paper,
  Chip,
  Link as MuiLink,
  FormControlLabel,
  Checkbox
} from '@mui/material'
import { Link as LinkIcon } from '@mui/icons-material'
import { addTask } from '../requests/tasks'
import { useThemeMode } from '../theme/ThemeContext'

const detectUrl = (text) => {
  if (!text || typeof text !== 'string') return null;

  const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/gi;
  const matches = text.match(urlRegex);

  if (matches && matches.length > 0) {
    try {
      new URL(matches[0]);
      return matches[0];
    } catch (e) {
      return null;
    }
  }

  return null;
};

const AddTaskDialog = ({ classId, onTaskAdded }) => {
  const [description, setDescription] = useState('')
  const [surnameConfirmed, setSurnameConfirmed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [detectedUrl, setDetectedUrl] = useState(null)
  const { t } = useThemeMode();

  useEffect(() => {
    const url = detectUrl(description);
    setDetectedUrl(url);
  }, [description]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!description.trim()) return

    setIsSubmitting(true)
    try {
      await addTask({ description, classId });
      setDescription('')
      setSurnameConfirmed(false)
      onTaskAdded()
    } catch (err) {
      console.error('Failed to add task:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={true}
      onClose={() => onTaskAdded()}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: t.bgDialog,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${t.borderSuccess}`,
        }
      }}
    >
      <DialogTitle sx={{
        background: `linear-gradient(135deg, ${t.accentSuccess}20, ${t.accentSuccessHover}20)`,
        color: t.textPrimary,
        fontWeight: 700,
        letterSpacing: '0.03em',
        borderBottom: `1px solid ${t.borderSuccess}`,
      }}>
        Додати нове завдання
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Назва завдання або посилання"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            multiline
            rows={3}
            placeholder="Введіть назву завдання або вставте посилання. Система автоматично розпізнає посилання та отримає метадані."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                color: t.textPrimary,
                '& fieldset': { borderColor: `${t.accentSuccess}40` },
                '&:hover fieldset': { borderColor: `${t.accentSuccess}80` },
                '&.Mui-focused fieldset': { borderColor: t.accentSuccess },
              },
              '& .MuiInputLabel-root': { color: t.textDim },
              '& .MuiInputLabel-root.Mui-focused': { color: t.accentSuccess },
              '& .MuiOutlinedInput-input::placeholder': { color: t.textDimmer },
            }}
          />

          {detectedUrl && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5, color: t.textDim }}>
                <LinkIcon fontSize="small" sx={{ color: t.linkColor }} />
                Знайдено посилання:
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: `1px solid ${t.borderSubtle}`,
                  backgroundColor: t.bgHover,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Chip
                    label="Автоматичне розпізнавання"
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.75rem', borderColor: t.chipBorder, color: t.accentPrimary }}
                  />
                </Box>
                <MuiLink
                  href={detectedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    wordBreak: 'break-all',
                    fontSize: '0.85rem',
                    color: t.linkColor,
                    '&:hover': { color: t.accentPrimaryHover },
                  }}
                >
                  {detectedUrl}
                </MuiLink>
                <Typography variant="caption" sx={{ display: 'block', mt: 1, color: t.textDimmer }}>
                  Після збереження система автоматично отримає заголовок, опис та зображення з цього посилання.
                </Typography>
              </Paper>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={surnameConfirmed}
                    onChange={(e) => setSurnameConfirmed(e.target.checked)}
                    sx={{
                      color: `${t.accentSuccess}60`,
                      '&.Mui-checked': { color: t.accentSuccess },
                    }}
                  />
                }
                label="Я додав(ла) своє прізвище до документа"
                sx={{ mt: 1.5, '& .MuiFormControlLabel-label': { color: t.textSecondary } }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => onTaskAdded()}
            disabled={isSubmitting}
            variant="outlined"
            sx={{
              borderColor: `${t.textMuted}40`,
              color: t.textMuted,
              '&:hover': { borderColor: t.textMuted, backgroundColor: t.bgHover },
            }}
          >
            Скасувати
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !description.trim() || (detectedUrl && !surnameConfirmed)}
            variant="contained"
            startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
            sx={{
              background: t.btnSuccessGradient,
              color: t.btnSuccessText,
              fontWeight: 700,
              '&:hover': {
                background: t.btnSuccessGradientHover,
                boxShadow: `0 0 20px ${t.accentSuccess}40`,
              }
            }}
          >
            {isSubmitting ? 'Додавання...' : 'Додати'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddTaskDialog
