import React, { useEffect, useState, useCallback } from 'react'
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
import { fetchTasks, deleteTask } from '../requests/tasks'
import AddTaskDialog from '../dialog/AddTaskDialog';

// Component for rendering individual task cards
const TaskCard = ({ task, onDelete, isDeleting }) => {
  const hasMetadata = task.url && task.metadata_fetched;
  const hasImage = hasMetadata && task.image_url;

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
          '&:hover': task.url ? {
            boxShadow: 3,
            transform: 'translateY(-1px)',
            transition: 'all 0.2s ease-in-out'
          } : {}
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
                  objectFit: 'cover'
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
                      color: '#1f2937',
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
                      color="text.secondary"
                      sx={{
                        fontSize: '0.85rem',
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
                          '& .MuiChip-label': { px: 1 }
                        }}
                      />
                    )}
                    <LinkIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  </Box>
                </Box>
                <Tooltip title="Видалити завдання">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(task.id);
                    }}
                    disabled={isDeleting}
                    sx={{
                      color: 'error.main',
                      '&:hover': {
                        backgroundColor: 'error.light',
                        color: 'white'
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

  // Fallback for tasks without metadata
  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 2, 
        mb: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        '&:hover': {
          backgroundColor: '#f9fafb'
        }
      }}
    >
      <ListItemText
        primary={task.description}
        sx={{
          '& .MuiListItemText-primary': {
            fontSize: '0.9rem',
            fontWeight: 500,
            color: '#374151'
          }
        }}
      />
      <Tooltip title="Видалити завдання">
        <IconButton
          size="small"
          onClick={() => onDelete(task.id)}
          disabled={isDeleting}
          sx={{
            color: 'error.main',
            '&:hover': {
              backgroundColor: 'error.light',
              color: 'white'
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

const TaskList = ({ classId }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [deletingTaskId, setDeletingTaskId] = useState(null)

  const fetchTasksAsync = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await fetchTasks(classId, (data) => {
        // Ensure data is always an array
        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          console.error('Expected array but got:', data);
          setTasks([]);
          setError('Invalid data format received');
        }
      });
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    fetchTasksAsync();
  }, [fetchTasksAsync]);

  const handleTaskAdded = () => {
    fetchTasks(classId, (data) => {
      // Ensure data is always an array
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        console.error('Expected array but got:', data);
        setTasks([]);
      }
    });
    setShowAddForm(false);
  }

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Ви впевнені, що хочете видалити це завдання?')) {
      setDeletingTaskId(taskId);
      try {
        await deleteTask(taskId, (data) => {
          setTasks(prev => prev.filter(task => task.id !== taskId));
        });
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Помилка при видаленні завдання');
      } finally {
        setDeletingTaskId(null);
      }
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography variant="body2" color="error" sx={{ textAlign: 'center', py: 2 }}>
          Завдання не знайдені!
        </Typography>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexShrink: 0 }}>
            <Typography variant="subtitle2" fontWeight="bold" color="primary">
              Завдання
            </Typography>
            <Chip 
              label={`${Array.isArray(tasks) ? tasks.length : 0} завдань`}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
          
          <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden' }}>
            {!Array.isArray(tasks) || tasks.length === 0 ? (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ textAlign: 'center', py: 2, fontStyle: 'italic' }}
              >
                Поки що немає завдань
              </Typography>
            ) : (
              <Box sx={{ mt: 1 }}>
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={handleDeleteTask}
                    isDeleting={deletingTaskId === task.id}
                  />
                ))}
              </Box>
            )}
          </Box>
        </>
      )}
      
      <Box sx={{ flexShrink: 0, pt: 2 }}>
        {showAddForm ? (
          <>
            <AddTaskDialog classId={classId} onTaskAdded={handleTaskAdded} />
            <Button
              variant="outlined"
              size="small"
              onClick={() => setShowAddForm(false)}
              sx={{ width: '100%' }}
            >
              Скасувати
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            size="small"
            onClick={() => setShowAddForm(true)}
            sx={{ 
              width: '100%',
              background: 'linear-gradient(45deg, #10b981, #059669)',
              '&:hover': {
                background: 'linear-gradient(45deg, #059669, #047857)'
              }
            }}
          >
            Додати завдання
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default TaskList