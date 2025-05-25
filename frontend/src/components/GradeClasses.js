import { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import ClassCard from './ClassCard';
import AddClassDialog from '../dialog/AddClassDialog';
import { fetchClassesBySchoolAndGrade, addClass } from '../requests/classes';

export default function GradeClasses({ grade, color, school }) {
  const [classes, setClasses] = useState([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');

  useEffect(() => {
    if (school) {
      fetchClassesBySchoolAndGrade(school.name, grade, setClasses);
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
    <Box>
      <Box sx={{ backgroundColor: color, color: '#fff', fontWeight: 'bold', py: 1 }}>{grade} клас</Box>
      <Button variant="outlined" size="small" sx={{ mt: 1, mb: 1 }} onClick={() => setAddDialogOpen(true)}>
        Додати предмет
      </Button>
      {classes.map(cls => (
        <ClassCard key={cls.id} classItem={cls} />
      ))}
      <AddClassDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={handleAddClass}
        value={newClassName}
        onChange={e => setNewClassName(e.target.value)}
        disabled={!newClassName.trim() || !school}
      />
    </Box>
  );
}