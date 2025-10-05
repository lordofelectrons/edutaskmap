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
  Link as MuiLink
} from '@mui/material'
import { Link as LinkIcon } from '@mui/icons-material'
import { addTask } from '../requests/tasks'

const detectUrl = (text) => {
  if (!text || typeof text !== 'string') return null;
  
  const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`\[\]]+)/gi;
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [detectedUrl, setDetectedUrl] = useState(null)

  useEffect(() => {
    const url = detectUrl(description);
    setDetectedUrl(url);
  }, [description]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!description.trim()) return

    setIsSubmitting(true)
    try {
      addTask({ description, classId }, () => {
        setDescription('')
        onTaskAdded()
      });
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
          borderRadius: 3
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(45deg, #10b981, #059669)',
        color: 'white',
        fontWeight: 'bold'
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
                borderRadius: 2
              }
            }}
          />
          
          {detectedUrl && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LinkIcon fontSize="small" />
                Знайдено посилання:
              </Typography>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#f9fafb'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Chip 
                    label="Автоматичне розпізнавання" 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    sx={{ fontSize: '0.75rem' }}
                  />
                </Box>
                <MuiLink 
                  href={detectedUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{ 
                    wordBreak: 'break-all',
                    fontSize: '0.85rem',
                    color: 'primary.main'
                  }}
                >
                  {detectedUrl}
                </MuiLink>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  Після збереження система автоматично отримає заголовок, опис та зображення з цього посилання.
                </Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => onTaskAdded()} 
            disabled={isSubmitting}
            variant="outlined"
          >
            Скасувати
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || !description.trim()}
            variant="contained"
            startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
            sx={{
              background: 'linear-gradient(45deg, #10b981, #059669)',
              '&:hover': {
                background: 'linear-gradient(45deg, #059669, #047857)'
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