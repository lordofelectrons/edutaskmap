// frontend/src/components/CompetencyCard.js
import { Card, Box, CardContent, Typography, Chip } from '@mui/material';

export default function CompetencyCard({ competency }) {
  return (
    <Card sx={{ 
      maxWidth: 350,
      height: '100%',
      borderRadius: 3,
      boxShadow: 3,
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: 8,
        '& .competency-header': {
          background: `${competency.color}dd`,
        }
      }
    }}>
      <Box 
        className="competency-header"
        sx={{ 
          background: competency.color || '#ef4444',
          color: '#fff',
          px: 3,
          py: 2,
          fontWeight: 'bold',
          fontSize: '1.1rem',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Компетенція {competency.id}
        </Typography>
        <Chip 
          label="Активна" 
          size="small" 
          sx={{ 
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            fontWeight: 'bold'
          }}
        />
      </Box>
      <CardContent sx={{ p: 3 }}>
        <Typography 
          variant="body1" 
          align="center" 
          sx={{ 
            fontSize: '1.1rem',
            fontWeight: 500,
            lineHeight: 1.4,
            color: '#374151'
          }}
        >
          {competency.name}
        </Typography>
      </CardContent>
    </Card>
  );
}