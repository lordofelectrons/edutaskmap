import { React, useState, useEffect } from 'react';
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
import { fetchSchools } from './requests/schools.js';
import SchoolSelection from './components/SchoolSelection.js';

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

export default function EduTaskMap() {
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    fetchSchools((data) => {
      setSchools(data);
      if (data.length > 0) {
        setSelectedSchool(data[0]); // Set the first school as selected by default
      }
    });
  }, []);

  return (
    <Box sx={{ p: 6, backgroundColor: '#f1e3d4', minHeight: '100vh' }}>
      <SchoolSelection schools={schools} selectedSchool={selectedSchool} setSelectedSchool={setSelectedSchool}/>

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
