import { React, useState } from 'react';
import { Card,
  CardContent,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  Divider, } from '@mui/material';

const grades = [
  { grade: '5 клас', color: '#fb923c' },
  { grade: '6 клас', color: '#facc15' },
  { grade: '7 клас', color: '#f472b6' },
  { grade: '8 клас', color: '#fb923c' },
  { grade: '9 клас', color: '#facc15' },
  { grade: '10 клас', color: '#f472b6' },
  { grade: '11 клас', color: '#fb923c' },
];

const competencies = [
  { id: 1, title: 'КОМПЕТЕНТНІСТЬ', color: '#fb923c' },
  { id: 2, title: 'Компетентність', color: '#f472b6' },
  { id: 3, title: 'Компетентність', color: '#facc15' },
  { id: 4, title: 'Компетентність', color: '#fb923c' },
];

const schools = ['Тестова Філія', 'Школа №1', 'Ліцей "Надія"'];

export default function EduTaskMap() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState('Тестова Філія');

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleSchoolSelect = (school) => {
    setSelectedSchool(school);
    setDrawerOpen(false);
  };
  return (
    <Box sx={{ p: 6, backgroundColor: '#f1e3d4', minHeight: '100vh' }}>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {schools.map((school, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => handleSchoolSelect(school)}>
                  <ListItemText primary={school} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Button variant="outlined" fullWidth onClick={() => alert('Додати новий заклад')}>Додати новий</Button>
          </Box>
        </Box>
      </Drawer>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 8 }}>
        <Button sx={{ backgroundColor: '#facc15', color: 'black', fontWeight: 'bold', fontSize: '1.25rem' }} onClick={toggleDrawer(true)}>
          Заклад освіти
        </Button>
        <Typography variant="body2">{selectedSchool}</Typography>
      </Box>

      <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
        КЛАСТЕР ГРОМАДЯНСЬКИХ КОМПЕТЕНТНОСТЕЙ
      </Typography>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Box sx={{ display: 'inline-block', backgroundColor: '#facc15', px: 2, py: 0.5, fontWeight: 'bold' }}>МАПА ВПРАВ</Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 10 }}>
        {competencies.map(comp => (
          <Card key={comp.id} sx={{ maxWidth: 275 }}>
            <Box sx={{ backgroundColor: comp.color, color: '#fff', px: 2, py: 1, fontWeight: 'bold' }}>{comp.id}</Box>
            <CardContent>
              <Typography align="center">{comp.title}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, textAlign: 'center' }}>
        {grades.map((grade, idx) => (
          <Box key={idx}>
            <Box sx={{ backgroundColor: grade.color, color: '#fff', fontWeight: 'bold', py: 1 }}>{grade.grade}</Box>
            <Card sx={{ mt: 1 }}>
              <Box sx={{ backgroundColor: '#facc15', px: 2, py: 0.5, fontWeight: 'bold' }}>ПРЕДМЕТ</Box>
              <CardContent>
                <Typography fontWeight="bold">ВПРАВА</Typography>
                <a href="#" style={{ color: '#1d4ed8', textDecoration: 'underline' }}>Лінк на вправу</a>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
