import { useState } from 'react';
import { Card, Box, CardContent, Typography, IconButton, Tooltip, CircularProgress } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { deleteCompetency } from '../requests/competencies';
import ConfirmDialog from '../dialog/ConfirmDialog';
import { useThemeMode } from '../theme/ThemeContext';

export default function CompetencyCard({ competency, onCompetencyDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { t } = useThemeMode();

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
        background: t.bgSurfaceSolid,
        border: `1px solid ${competency.color || t.accentPrimary}25`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 8px 30px ${competency.color || t.accentPrimary}20`,
          border: `1px solid ${competency.color || t.accentPrimary}50`,
          '& .competency-header': {
            boxShadow: `inset 0 -2px 15px ${competency.color || t.accentPrimary}15`,
          },
          '& .delete-btn': {
            opacity: 1
          }
        }
      }}>
        <Box
          className="competency-header"
          sx={{
            background: `linear-gradient(135deg, ${competency.color || t.accentPrimary}cc, ${competency.color || t.accentPrimary}88)`,
            color: '#fff',
            px: 3,
            py: 2,
            fontWeight: 'bold',
            fontSize: '1.1rem',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transition: 'all 0.3s ease',
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: '0.03em' }}>
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
              color: t.textSecondary
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
