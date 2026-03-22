import { useState } from 'react';
import { Card, CardContent, Typography, Box, IconButton, Tooltip, CircularProgress } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import TaskList from './TaskList';
import { deleteClass } from '../requests/classes';
import ConfirmDialog from '../dialog/ConfirmDialog';
import { useThemeMode } from '../theme/ThemeContext';

export default function ClassCard({ classItem, onClassDeleted, preloadedTasks = [], onDataChange }) {
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { t } = useThemeMode();

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
        background: t.bgCard,
        border: `1px solid ${t.borderSubtle}`,
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        '&:hover': {
          boxShadow: t.shadowCard,
          transform: 'translateY(-2px)',
          border: `1px solid ${t.borderMedium}`,
          '& .delete-btn': { opacity: 1 }
        }
      }}>
        <Box sx={{
          background: t.bgHeaderSubtle,
          borderLeft: `4px solid ${classItem.gradeColor || t.accentPrimary}`,
          color: t.textMuted,
          px: 3,
          py: 1.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ letterSpacing: '0.08em', fontSize: '0.7rem' }}>
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
                color: t.accentDanger,
                '&:hover': {
                  backgroundColor: `${t.accentDanger}20`,
                  color: t.accentDangerHover
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
              color: t.textPrimary,
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
