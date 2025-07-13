import { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  Paper,
  Typography,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import ClassCard from './ClassCard';
import AddClassDialog from '../dialog/AddClassDialog';
import { fetchClassesBySchoolAndGrade, addClass } from '../requests/classes';

export default function GradeClasses({ grade, color, school }) {
  const [classes, setClasses] = useState([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (school) {
      setLoading(true);
      fetchClassesBySchoolAndGrade(school.name, grade, (data) => {
        setClasses(data);
        setLoading(false);
      });
    }
  }, [school, grade]);

  const handleAddClass = () => {
    if (!newClassName.trim() || !school) return;
    addClass({ grade, name: newClassName, school_id: school.id }, (newCls) => {
      setClasses(prev => [...prev, newCls]);
      setNewClassName('');
      setAddDialogOpen(false);
    });
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
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
        alignItems: 'center'
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

      {/* Content */}
      <Box sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <div className="loading-spinner"></div>
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
              gap: 2,
              maxHeight: isMobile ? 'auto' : '400px',
              overflowY: isMobile ? 'visible' : 'auto'
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
                  <ClassCard key={cls.id} classItem={cls} />
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
        disabled={!newClassName.trim() || !school}
      />
    </Paper>
  );
}