import { useState } from 'react';
import { Card, Box, CardContent, Typography, IconButton, Tooltip, CircularProgress } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { deleteCompetency } from '../requests/competencies';
import ConfirmDialog from '../dialog/ConfirmDialog';

export default function CompetencyCard({ competency, onCompetencyDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = async () => {
    setConfirmOpen(false);
    setDeleting(true);
    try {
      await deleteCompetency(competency.id);
      if (onCompetencyDeleted) onCompetencyDeleted(competency.id);
    } catch (error) {
      console.error('Error deleting competency:', error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Card sx={{
        height: '100%',
        borderRadius: 3,
        boxShadow: 3,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: 8,
          '& .competency-header': {
            background: `${competency.color}dd`,
          },
          '& .delete-btn': {
            opacity: 1
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
          <Tooltip title="Видалити компетентність">
            <IconButton
              className="delete-btn"
              size="small"
              onClick={(e) => { e.stopPropagation(); setConfirmOpen(true); }}
              disabled={deleting}
              sx={{
                opacity: 0,
                transition: 'opacity 0.2s ease',
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

      <ConfirmDialog
        open={confirmOpen}
        title="Видалити компетентність"
        message="Ви впевнені, що хочете видалити цю компетентність?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
