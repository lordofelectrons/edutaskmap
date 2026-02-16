// frontend/src/components/CompetencyCard.js
import { useState } from 'react';
import { Card, Box, CardContent, Typography, Chip, IconButton, Tooltip, CircularProgress } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { deleteCompetency } from '../requests/competencies';

export default function CompetencyCard({ competency, onCompetencyDeleted }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (event) => {
    event.stopPropagation();
    if (window.confirm('Ви впевнені, що хочете видалити цю компетентність?')) {
      setDeleting(true);
      try {
        await deleteCompetency(competency.id, (data) => {
          if (onCompetencyDeleted) {
            onCompetencyDeleted(competency.id);
          }
        });
      } catch (error) {
        console.error('Error deleting competency:', error);
        alert('Помилка при видаленні компетентності');
      } finally {
        setDeleting(false);
      }
    }
  };

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
          Компетентність
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip 
            label="Активна" 
            size="small" 
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 'bold'
            }}
          />
          <Tooltip title="Видалити компетентність">
            <IconButton
              size="small"
              onClick={handleDelete}
              disabled={deleting}
              sx={{
                color: 'rgba(255,255,255,0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white'
                }
              }}
            >
              {deleting ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <DeleteIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Box>
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