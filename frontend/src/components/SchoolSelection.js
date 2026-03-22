import { React, useState } from 'react';
import {
  Typography,
  Box,
  Button,
  Avatar
} from '@mui/material';
import SchoolDrawer from './SchoolDrawer';
import { clearSavedSchoolId } from '../utils/schoolStorage.js';
import { useThemeMode } from '../theme/ThemeContext';

export default function SchoolSelection ({ schools, selectedSchool, setSelectedSchool, syncSchoolList, loadingSchools = false }) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { t } = useThemeMode();

    const handleSchoolSelect = (school) => {
        if (school) {
            setSelectedSchool(school);
        }
        setDrawerOpen(false);
    };

    const handleSchoolAdded = (school) => {
        setSelectedSchool(school);
        setDrawerOpen(false);
        syncSchoolList();
    };

    const handleSchoolSelectionOpening = () => {
        if (schools.length === 0) {
            syncSchoolList();
        }
        setDrawerOpen(true);
    }

    const handleSchoolDeleted = (deletedSchoolId) => {
        if (selectedSchool && selectedSchool.id === deletedSchoolId) {
            setSelectedSchool(null);
            clearSavedSchoolId();
        }
        syncSchoolList();
    }

    return <>
        <SchoolDrawer
            schools={schools}
            drawerOpen={drawerOpen}
            handleSchoolSelect={handleSchoolSelect}
            onSchoolAdded={handleSchoolAdded}
            onSchoolDeleted={handleSchoolDeleted}
            loadingSchools={loadingSchools}
        />
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2
        }}>
            <Button
              variant="contained"
              onClick={handleSchoolSelectionOpening}
              sx={{
                background: t.btnGradient,
                color: 'white',
                fontWeight: '700',
                fontSize: '1.1rem',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                letterSpacing: '0.04em',
                boxShadow: t.shadowGlow,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: t.btnGradientHover,
                  transform: 'translateY(-2px)',
                  boxShadow: t.shadowGlowHover,
                }
              }}
            >
              Шкільна команда
            </Button>

            {selectedSchool && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{
                  background: t.btnGradient,
                  width: 40,
                  height: 40,
                  fontWeight: 700,
                  boxShadow: t.shadowGlow,
                }}>
                  {selectedSchool.name.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h6" fontWeight="bold" sx={{ color: t.textPrimary }}>
                  {selectedSchool.name}
                </Typography>
              </Box>
            )}
        </Box>
    </>
}
