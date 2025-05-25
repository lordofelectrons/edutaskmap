// frontend/src/components/ClassCard.js
import { Card, CardContent, Typography, Box } from '@mui/material';

export default function ClassCard({ classItem }) {
  return (
    <Card sx={{ mt: 1 }}>
      <Box sx={{ backgroundColor: '#facc15', px: 2, py: 0.5, fontWeight: 'bold' }}>ПРЕДМЕТ</Box>
      <CardContent>
        <Typography fontWeight="bold">{classItem.name}</Typography>
        {/* Add more fields if needed */}
      </CardContent>
    </Card>
  );
}