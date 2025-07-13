import React, { useState } from 'react'
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button,
  Box
} from '@mui/material'
import { addTask } from '../requests/tasks'

const AddTaskDialog = ({ classId, onTaskAdded }) => {
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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
            label="Назва завдання"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
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