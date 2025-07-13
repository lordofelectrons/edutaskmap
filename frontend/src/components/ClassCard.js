// frontend/src/components/ClassCard.js
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import TaskList from './TaskList';

export default function ClassCard({ classItem }) {
  return (
    <Card sx={{ 
      borderRadius: 2,
      boxShadow: 2,
      transition: 'all 0.2s ease',
      '&:hover': {
        boxShadow: 4,
        transform: 'translateY(-2px)'
      }
    }}>
      <Box sx={{ 
        background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
        color: '#92400e',
        px: 3,
        py: 1.5,
        fontWeight: 'bold',
        fontSize: '0.9rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="subtitle2" fontWeight="bold">
          ПРЕДМЕТ
        </Typography>
        <Chip 
          label="Активний" 
          size="small" 
          sx={{ 
            backgroundColor: 'rgba(146, 64, 14, 0.2)',
            color: '#92400e',
            fontWeight: 'bold',
            fontSize: '0.7rem'
          }}
        />
      </Box>
      <CardContent sx={{ p: 2 }}>
        <Typography 
          variant="h6" 
          fontWeight="bold" 
          sx={{ 
            mb: 2,
            color: '#1f2937',
            fontSize: '1.1rem'
          }}
        >
          {classItem.name}
        </Typography>
        <TaskList classId={classItem.id} />
      </CardContent>
    </Card>
  );
}