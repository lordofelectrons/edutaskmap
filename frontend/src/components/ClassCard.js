// frontend/src/components/ClassCard.js
import { useState } from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton, Tooltip, CircularProgress, useTheme, useMediaQuery } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import TaskList from './TaskList';
import { deleteClass } from '../requests/classes';

export default function ClassCard({ classItem, onClassDeleted, preloadedTasks = [], onDataChange }) {
  const [deleting, setDeleting] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDelete = async (event) => {
    event.stopPropagation();
    if (window.confirm('Ви впевнені, що хочете видалити цей предмет? Всі пов\'язані завдання будуть втрачені.')) {
      setDeleting(true);
      try {
        await deleteClass(classItem.id, (data) => {
          if (onClassDeleted) {
            onClassDeleted(classItem.id);
          }
          // Trigger full data refresh
          if (onDataChange) {
            onDataChange();
          }
        });
      } catch (error) {
        console.error('Error deleting class:', error);
        alert('Помилка при видаленні предмета');
      } finally {
        setDeleting(false);
      }
    }
  };

  return (
    <Card sx={{ 
      borderRadius: 2,
      boxShadow: 2,
      transition: 'all 0.2s ease',
      height: isMobile ? 'auto' : 'min(500px, 60vh)',
      maxHeight: isMobile ? 'none' : 'min(500px, 60vh)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      '&:hover': {
        boxShadow: 4,
        transform: 'translateY(-2px)'
      }
    }}>
      <Box sx={{ 
        background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
        color: '#92400e',
        px: 3,
        py: 1.5,
        fontWeight: 'bold',
        fontSize: '0.9rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="subtitle2" fontWeight="bold">
          ПРЕДМЕТ
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip 
            label="Активний" 
            size="small" 
            sx={{ 
              backgroundColor: 'rgba(146, 64, 14, 0.2)',
              color: '#92400e',
              fontWeight: 'bold',
              fontSize: '0.7rem'
            }}
          />
          <Tooltip title="Видалити предмет">
            <IconButton
              size="small"
              onClick={handleDelete}
              disabled={deleting}
              sx={{
                color: '#92400e',
                '&:hover': {
                  backgroundColor: 'rgba(146, 64, 14, 0.2)',
                  color: '#92400e'
                }
              }}
            >
              {deleting ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <DeleteIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <CardContent sx={{ 
        p: 2, 
        flex: 1,
        overflowY: isMobile ? 'visible' : 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Typography 
          variant="h6" 
          fontWeight="bold" 
          sx={{ 
            mb: 2,
            color: '#1f2937',
            fontSize: '1.1rem',
            flexShrink: 0
          }}
        >
          {classItem.name}
        </Typography>
        <TaskList classId={classItem.id} preloadedTasks={preloadedTasks} onDataChange={onDataChange} />
      </CardContent>
    </Card>
  );
}