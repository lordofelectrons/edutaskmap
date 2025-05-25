// frontend/src/components/CompetencyCard.js
import { Card, Box, CardContent, Typography } from '@mui/material';

export default function CompetencyCard({ competency }) {
  return (
    <Card sx={{ maxWidth: 275 }}>
      <Box sx={{ backgroundColor: competency.color || '#fb923c', color: '#fff', px: 2, py: 1, fontWeight: 'bold' }}>
        {competency.id}
      </Box>
      <CardContent>
        <Typography align="center">{competency.name}</Typography>
      </CardContent>
    </Card>
  );
}