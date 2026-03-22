import { useState } from 'react';
import { Card, CardContent, Typography, Box, IconButton, Tooltip, CircularProgress } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import TaskList from './TaskList';
import { deleteClass } from '../requests/classes';
import ConfirmDialog from '../dialog/ConfirmDialog';

export default function ClassCard({ classItem, onClassDeleted, preloadedTasks = [], onDataChange }) {
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = async () => {
    setConfirmOpen(false);
    setDeleting(true);
    try {
      await deleteClass(classItem.id);
      if (onClassDeleted) onClassDeleted(classItem.id);
      if (onDataChange) onDataChange();
    } catch (error) {
      console.error('Error deleting class:', error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Card sx={{
        borderRadius: 2,
        boxShadow: 2,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)',
          '& .delete-btn': { opacity: 1 }
        }
      }}>
        <Box sx={{
          background: '#f3f4f6',
          borderLeft: `4px solid ${classItem.gradeColor || '#fbbf24'}`,
          color: '#374151',
          px: 3,
          py: 1.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="subtitle2" fontWeight="bold">
            ПРЕДМЕТ
          </Typography>
          <Tooltip title="Видалити предмет">
            <IconButton
              className="delete-btn"
              size="small"
              onClick={(e) => { e.stopPropagation(); setConfirmOpen(true); }}
              disabled={deleting}
              sx={{
                opacity: 0,
                transition: 'opacity 0.2s ease',
                color: 'error.main',
                '&:hover': {
                  backgroundColor: 'error.light',
                  color: 'white'
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
        <CardContent sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              mb: 2,
              color: '#1f2937',
              fontSize: '1.1rem'
            }}
          >
            {classItem.name}
          </Typography>
          <TaskList classId={classItem.id} preloadedTasks={preloadedTasks} onDataChange={onDataChange} />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title="Видалити предмет"
        message="Ви впевнені, що хочете видалити цей предмет? Всі пов'язані завдання будуть втрачені."
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
