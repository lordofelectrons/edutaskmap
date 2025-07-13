import React, { useEffect, useState } from 'react'
import { 
  Box, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  ListItemText,
  Paper,
  Chip
} from '@mui/material'
import { fetchTasks } from '../requests/tasks'
import AddTaskDialog from '../dialog/AddTaskDialog';

const TaskList = ({ classId }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const fetchTasksAsync = async () => {
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
  };

  useEffect(() => {
    fetchTasksAsync();
  }, [classId]);

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

  return (
    <Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <div className="loading-spinner"></div>
        </Box>
      ) : error ? (
        <Typography variant="body2" color="error" sx={{ textAlign: 'center', py: 2 }}>
          Завдання не знайдені!
        </Typography>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
          
          {!Array.isArray(tasks) || tasks.length === 0 ? (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ textAlign: 'center', py: 2, fontStyle: 'italic' }}
            >
              Поки що немає завдань
            </Typography>
          ) : (
            <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <List sx={{ py: 0 }}>
                {tasks.map((task, index) => (
                  <ListItem 
                    key={task.id}
                    sx={{ 
                      borderBottom: index < tasks.length - 1 ? '1px solid #f3f4f6' : 'none',
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
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </>
      )}
      
      {showAddForm ? (
        <>
          <AddTaskDialog classId={classId} onTaskAdded={handleTaskAdded} />
          <Button
            variant="outlined"
            size="small"
            onClick={() => setShowAddForm(false)}
            sx={{ mt: 1, width: '100%' }}
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
            mt: 2, 
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
  )
}

export default TaskList