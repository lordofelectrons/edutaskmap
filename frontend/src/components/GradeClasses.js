import { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Chip
} from '@mui/material';
import ClassCard from './ClassCard';
import AddClassDialog from '../dialog/AddClassDialog';
import { addClass } from '../requests/classes';

export default function GradeClasses({ grade, color, school, preloadedClasses = [], onDataChange }) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [addingClass, setAddingClass] = useState(false);

  const classes = Array.isArray(preloadedClasses) ? preloadedClasses : [];

  const handleAddClass = async () => {
    if (!newClassName.trim() || !school) return;
    setAddingClass(true);
    try {
      await addClass({ grade, name: newClassName, school_id: school.id });
      setNewClassName('');
      setAddDialogOpen(false);
      if (onDataChange) onDataChange();
    } catch (err) {
      console.error('Error adding class:', err);
    } finally {
      setAddingClass(false);
    }
  };

  const handleClassDeleted = () => {
    if (onDataChange) onDataChange();
  };

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6
        }
      }}
    >
      <Box sx={{
        background: `linear-gradient(135deg, ${color}, ${color}dd)`,
        color: '#fff',
        py: 2,
        px: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0
      }}>
        <Typography variant="h6" fontWeight="bold">
          {grade} клас
        </Typography>
        <Chip
          label={`${classes.length} предметів`}
          size="small"
          sx={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            fontWeight: 'bold'
          }}
        />
      </Box>

      <Box sx={{ p: 3 }}>
        {classes.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Поки що немає предметів
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setAddDialogOpen(true)}
              sx={{
                borderColor: color,
                color: color,
                '&:hover': {
                  backgroundColor: `${color}15`,
                  borderColor: color
                }
              }}
            >
              Додайте перший предмет
            </Button>
          </Box>
        ) : (
          <>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setAddDialogOpen(true)}
              sx={{
                mb: 2,
                borderColor: color,
                color: color,
                '&:hover': {
                  backgroundColor: `${color}15`,
                  borderColor: color
                }
              }}
            >
              Додати предмет
            </Button>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {classes.map(cls => (
                <ClassCard
                  key={cls.id}
                  classItem={cls}
                  onClassDeleted={handleClassDeleted}
                  preloadedTasks={cls.tasks || []}
                  onDataChange={onDataChange}
                />
              ))}
            </Box>
          </>
        )}
      </Box>

      <AddClassDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={handleAddClass}
        value={newClassName}
        onChange={e => setNewClassName(e.target.value)}
        disabled={!newClassName.trim() || !school || addingClass}
        loading={addingClass}
      />
    </Paper>
  );
}
