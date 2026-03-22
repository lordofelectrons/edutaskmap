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
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import AddSchoolDialog from '../dialog/AddSchoolDialog.js';
import { deleteSchool } from '../requests/schools.js';
import ConfirmDialog from '../dialog/ConfirmDialog';
import { useThemeMode } from '../theme/ThemeContext';

export default function SchoolDrawer ({ schools, drawerOpen, handleSchoolSelect, onSchoolAdded, onSchoolDeleted, loadingSchools = false }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deletingSchoolId, setDeletingSchoolId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const { t } = useThemeMode();

  const handleSchoolAddition = (school) => {
    if (onSchoolAdded) onSchoolAdded(school);
    setDialogOpen(false);
  }

  const handleDeleteSchool = async () => {
    const schoolId = confirmDeleteId;
    setConfirmDeleteId(null);
    setDeletingSchoolId(schoolId);
    try {
      await deleteSchool(schoolId);
      if (onSchoolDeleted) onSchoolDeleted(schoolId);
    } catch (error) {
      console.error('Error deleting school:', error);
    } finally {
      setDeletingSchoolId(null);
    }
  }

  return <>
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={() => handleSchoolSelect(false)}
      PaperProps={{
        sx: {
          width: { xs: '85vw', sm: '60vw', md: '40vw', lg: '30vw' },
          height: '100vh',
          maxHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: t.bgDrawer,
          borderRight: `1px solid ${t.borderSubtle}`,
        }
      }}
    >
      <Box sx={{ p: 3, color: 'white', flexShrink: 0 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, letterSpacing: '0.05em', textShadow: t.titleGlow }}>
          Шкільні команди
        </Typography>
        <Typography variant="body2" sx={{ color: t.textDim }}>
          Оберіть шкільну команду для роботи
        </Typography>
        <Box sx={{ width: 40, height: 2, background: t.accentGradient, mt: 1.5, borderRadius: 1 }} />
      </Box>

      <Box sx={{
        background: t.bgInput,
        flex: 1,
        minHeight: 0,
        overflow: 'auto',
        borderRadius: '20px 0 0 0',
        borderTop: `1px solid ${t.divider}`,
      }}>
        {loadingSchools ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress sx={{ color: t.accentPrimary }} />
          </Box>
        ) : (
          <>
            <List sx={{ pt: 2 }}>
              {schools.map((school) => (
              <ListItem key={school?.id} disablePadding sx={{ px: 2 }}>
                <ListItemButton
                  onClick={() => handleSchoolSelect(school)}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    mb: 1,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: t.bgHover,
                      transform: 'translateX(4px)',
                      '& .delete-btn': { opacity: 1 }
                    }
                  }}
                >
                  <Avatar sx={{
                    background: t.btnGradient,
                    width: 32,
                    height: 32,
                    mr: 2,
                    fontSize: '0.85rem',
                    fontWeight: 700,
                  }}>
                    {school?.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <ListItemText
                    primary={school?.name}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontWeight: 500,
                        color: t.textSecondary
                      }
                    }}
                  />
                  <Tooltip title="Видалити шкільну команду">
                    <IconButton
                      className="delete-btn"
                      size="small"
                      onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(school.id); }}
                      disabled={deletingSchoolId === school.id}
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
                      {deletingSchoolId === school.id ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <DeleteIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ mx: 3, my: 2, borderColor: t.divider }} />

          <Box sx={{ p: 3 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setDialogOpen(true)}
              sx={{
                background: t.btnGradient,
                borderRadius: 2,
                py: 1.5,
                fontWeight: 600,
                letterSpacing: '0.03em',
                boxShadow: t.shadowGlow,
                '&:hover': {
                  background: t.btnGradientHover,
                  boxShadow: t.shadowGlowHover,
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
    <ConfirmDialog
      open={confirmDeleteId !== null}
      title="Видалити шкільну команду"
      message="Ви впевнені, що хочете видалити цю шкільну команду? Всі пов'язані дані будуть втрачені."
      onConfirm={handleDeleteSchool}
      onCancel={() => setConfirmDeleteId(null)}
    />
  </>
}
