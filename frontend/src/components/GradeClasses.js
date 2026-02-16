import { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  Paper,
  Typography,
  Chip,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import ClassCard from './ClassCard';
import AddClassDialog from '../dialog/AddClassDialog';
import { addClass } from '../requests/classes';

export default function GradeClasses({ grade, color, school, preloadedClasses = [], onDataChange }) {
  const [classes, setClasses] = useState([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [loading, setLoading] = useState(false);
  const [addingClass, setAddingClass] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Use only preloaded data
  useEffect(() => {
    if (school && preloadedClasses) {
      // Filter preloaded classes by grade
      const gradeClasses = preloadedClasses.filter(cls => cls.grade === grade);
      setClasses(gradeClasses);
      setLoading(false);
    } else {
      setClasses([]);
      setLoading(false);
    }
  }, [school, grade, preloadedClasses]);

  const handleAddClass = () => {
    if (!newClassName.trim() || !school) return;
    setAddingClass(true);
    addClass({ grade, name: newClassName, school_id: school.id }, (newCls) => {
      // Add new class with empty tasks array
      const newClassWithTasks = { ...newCls, tasks: [] };
      setClasses(prev => [...prev, newClassWithTasks]);
      setNewClassName('');
      setAddDialogOpen(false);
      setAddingClass(false);
    });
  };

  const handleClassDeleted = (deletedClassId) => {
    // Trigger full data refresh
    if (onDataChange) {
      onDataChange();
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        height: isMobile ? 'auto' : 'min(70vh, 600px)',
        maxHeight: isMobile ? 'none' : 'min(70vh, 600px)',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6
        }
      }}
    >
      {/* Grade Header */}
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

      {/* Content - Scrollable */}
      <Box sx={{ 
        p: 3,
        flex: 1,
        minHeight: 0,
        overflowY: isMobile ? 'visible' : 'auto',
        overflowX: 'hidden'
      }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress />
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
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2
            }}>
              {classes.length === 0 ? (
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ textAlign: 'center', py: 2 }}
                >
                  Поки що немає предметів
                </Typography>
              ) : (
                classes.map(cls => (
                  <ClassCard 
                    key={cls.id} 
                    classItem={cls} 
                    onClassDeleted={handleClassDeleted}
                    preloadedTasks={cls.tasks || []}
                    onDataChange={onDataChange}
                  />
                ))
              )}
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