import { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  Divider,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import AddSchoolDialog from '../dialog/AddSchoolDialog.js';
import { deleteSchool } from '../requests/schools.js';

export default function SchoolDrawer ({ schools, drawerOpen, handleSchoolSelect, onSchoolDeleted, loadingSchools = false }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deletingSchoolId, setDeletingSchoolId] = useState(null);

  const handleSchoolAddition = (school) => {
    handleSchoolSelect(school);
    setDialogOpen(false);
  }

  const handleDeleteSchool = async (schoolId, event) => {
    event.stopPropagation(); // Prevent triggering the school selection
    if (window.confirm('Ви впевнені, що хочете видалити цю шкільну команду? Всі пов\'язані дані будуть втрачені.')) {
      setDeletingSchoolId(schoolId);
      try {
        await deleteSchool(schoolId, (data) => {
          if (onSchoolDeleted) {
            onSchoolDeleted(schoolId);
          }
        });
      } catch (error) {
        console.error('Error deleting school:', error);
        alert('Помилка при видаленні шкільної команди');
      } finally {
        setDeletingSchoolId(null);
      }
    }
  }

  return <>
    <Drawer 
      anchor="left" 
      open={drawerOpen} 
      onClose={() => handleSchoolSelect(false)}
      PaperProps={{
        sx: {
          width: '40vw',
          height: '100vh',
          maxHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }
      }}
    >
      <Box sx={{ p: 3, color: 'white', flexShrink: 0 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Шкільні команди
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Оберіть шкільну команду для роботи
        </Typography>
      </Box>
      
      <Box sx={{ 
        background: 'rgba(255, 255, 255, 0.95)',
        flex: 1,
        minHeight: 0,
        overflow: 'auto',
        borderRadius: '20px 0 0 0'
      }}>
        {loadingSchools ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <List sx={{ pt: 2 }}>
              {schools.map((school, index) => (
              <ListItem key={school?.id} disablePadding sx={{ px: 2 }}>
                <ListItemButton 
                  onClick={() => handleSchoolSelect(school)}
                  sx={{ 
                    borderRadius: 2,
                    mx: 1,
                    mb: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                      transform: 'translateX(4px)'
                    }
                  }}
                >
                  <Avatar sx={{ 
                    bgcolor: 'primary.main',
                    width: 32,
                    height: 32,
                    mr: 2
                  }}>
                    {school?.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <ListItemText 
                    primary={school?.name}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontWeight: 500,
                        color: '#1f2937'
                      }
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip 
                      label="Активний" 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                    <Tooltip title="Видалити шкільну команду">
                      <IconButton
                        size="small"
                        onClick={(e) => handleDeleteSchool(school.id, e)}
                        disabled={deletingSchoolId === school.id}
                        sx={{
                          color: 'error.main',
                          '&:hover': {
                            backgroundColor: 'error.light',
                            color: 'white'
                          }
                        }}
                      >
                        {deletingSchoolId === school.id ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : (
                          <DeleteIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          
          <Divider sx={{ mx: 3, my: 2 }} />
          
          <Box sx={{ p: 3 }}>
            <Button 
              variant="contained" 
              fullWidth 
              onClick={() => setDialogOpen(true)}
              sx={{ 
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                borderRadius: 2,
                py: 1.5,
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a67d8, #6b46c1)'
                }
              }}
            >
              Додати нову шкільну команду
            </Button>
          </Box>
          </>
        )}
      </Box>
    </Drawer>
    <AddSchoolDialog
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      onSchoolAdded={handleSchoolAddition}
    />
  </>
}