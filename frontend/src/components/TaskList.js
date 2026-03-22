import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  ListItemText,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Card,
  CardContent,
  CardMedia
} from '@mui/material'
import { Delete as DeleteIcon, Link as LinkIcon } from '@mui/icons-material'
import { deleteTask } from '../requests/tasks'
import AddTaskDialog from '../dialog/AddTaskDialog';
import ConfirmDialog from '../dialog/ConfirmDialog';
import { useThemeMode } from '../theme/ThemeContext';

const TaskCard = ({ task, onDelete, isDeleting }) => {
  const hasMetadata = task.url && task.metadata_fetched;
  const hasImage = hasMetadata && task.image_url;
  const { t } = useThemeMode();

  const handleLinkClick = () => {
    if (task.url) {
      window.open(task.url, '_blank', 'noopener,noreferrer');
    }
  };

  if (hasMetadata) {
    return (
      <Card
        sx={{
          mb: 1,
          cursor: task.url ? 'pointer' : 'default',
          background: t.bgCardInner,
          border: `1px solid ${t.borderSubtle}`,
          transition: 'all 0.2s ease',
          '&:hover': task.url ? {
            boxShadow: t.shadowCard,
            transform: 'translateY(-1px)',
            border: `1px solid ${t.borderMedium}`,
            '& .delete-btn': { opacity: 1 }
          } : {
            '& .delete-btn': { opacity: 1 }
          }
        }}
        onClick={handleLinkClick}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            {hasImage && (
              <CardMedia
                component="img"
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 1,
                  objectFit: 'cover',
                  border: `1px solid ${t.borderSubtle}`,
                }}
                image={task.image_url}
                alt={task.title || 'Link preview'}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: t.textPrimary,
                      mb: 0.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {task.title || task.description}
                  </Typography>
                  {task.title && task.description !== task.title && (
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.85rem',
                        color: t.textDim,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {task.description}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    {task.site_name && (
                      <Chip
                        label={task.site_name}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: '0.75rem',
                          height: 20,
                          borderColor: t.chipBorder,
                          color: t.textMuted,
                          '& .MuiChip-label': { px: 1 }
                        }}
                      />
                    )}
                    <LinkIcon sx={{ fontSize: 16, color: t.linkColor }} />
                  </Box>
                </Box>
                <Tooltip title="Видалити завдання">
                  <IconButton
                    className="delete-btn"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(task.id);
                    }}
                    disabled={isDeleting}
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
                    {isDeleting ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <DeleteIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: t.bgCardInner,
        border: `1px solid ${t.borderSubtle}`,
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: t.bgHover,
          border: `1px solid ${t.borderMedium}`,
          '& .delete-btn': { opacity: 1 }
        }
      }}
    >
      <ListItemText
        primary={task.description}
        sx={{
          '& .MuiListItemText-primary': {
            fontSize: '0.9rem',
            fontWeight: 500,
            color: t.textSecondary
          }
        }}
      />
      <Tooltip title="Видалити завдання">
        <IconButton
          className="delete-btn"
          size="small"
          onClick={() => onDelete(task.id)}
          disabled={isDeleting}
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
          {isDeleting ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            <DeleteIcon fontSize="small" />
          )}
        </IconButton>
      </Tooltip>
    </Paper>
  );
};

const TaskList = ({ classId, preloadedTasks = [], onDataChange }) => {
  const tasks = Array.isArray(preloadedTasks) ? preloadedTasks : []
  const [showAddForm, setShowAddForm] = useState(false)
  const [deletingTaskId, setDeletingTaskId] = useState(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const { t } = useThemeMode();

  const handleTaskAdded = () => {
    if (onDataChange) onDataChange();
    setShowAddForm(false);
  }

  const handleDeleteTask = async () => {
    const taskId = confirmDeleteId;
    setConfirmDeleteId(null);
    setDeletingTaskId(taskId);
    try {
      await deleteTask(taskId);
      if (onDataChange) onDataChange();
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setDeletingTaskId(null);
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ color: t.accentPrimary, letterSpacing: '0.05em' }}>
          Завдання
        </Typography>
        <Chip
          label={`${tasks.length} завдань`}
          size="small"
          variant="outlined"
          sx={{
            borderColor: t.chipBorder,
            color: t.accentPrimary,
          }}
        />
      </Box>

      {tasks.length === 0 ? (
        <Typography
          variant="body2"
          sx={{ textAlign: 'center', py: 2, fontStyle: 'italic', color: t.textDimmer }}
        >
          Поки що немає завдань
        </Typography>
      ) : (
        <Box sx={{ mt: 1 }}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={(id) => setConfirmDeleteId(id)}
              isDeleting={deletingTaskId === task.id}
            />
          ))}
        </Box>
      )}

      <Box sx={{ pt: 2 }}>
        {showAddForm ? (
          <>
            <AddTaskDialog classId={classId} onTaskAdded={handleTaskAdded} />
            <Button
              variant="outlined"
              size="small"
              onClick={() => setShowAddForm(false)}
              sx={{
                width: '100%',
                borderColor: t.borderMedium,
                color: t.textMuted,
                '&:hover': { borderColor: t.accentPrimary, color: t.accentPrimary },
              }}
            >
              Скасувати
            </Button>
          </>
        ) : (
          <Button
            variant="outlined"
            size="small"
            onClick={() => setShowAddForm(true)}
            sx={{
              width: '100%',
              borderColor: t.borderMedium,
              color: t.textMuted,
              '&:hover': { borderColor: t.accentPrimary, color: t.accentPrimary },
            }}
          >
            Додати завдання
          </Button>
        )}
      </Box>

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Видалити завдання"
        message="Ви впевнені, що хочете видалити це завдання?"
        onConfirm={handleDeleteTask}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </Box>
  )
}

export default TaskList
