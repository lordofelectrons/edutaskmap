import { React, useState } from 'react';
import { 
  Typography,
  Box,
  Button,
  Chip,
  Avatar
} from '@mui/material';
import SchoolDrawer from './SchoolDrawer';

export default function SchoolSelection ({ schools, selectedSchool, setSelectedSchool, syncSchoolList }) {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleSchoolSelect = (school) => {
        if (school) {
            setSelectedSchool(school);
        }
        setDrawerOpen(false);
    };

    const handleSchoolSelectionOpening = () => {
        syncSchoolList();
        setDrawerOpen(true);
    }

    return <>
        <SchoolDrawer schools={schools} drawerOpen={drawerOpen} handleSchoolSelect={handleSchoolSelect} />
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
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                boxShadow: 3,
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a67d8, #6b46c1)',
                  transform: 'translateY(-2px)',
                  boxShadow: 6
                }
              }}
            >
              Заклад освіти
            </Button>
            
            {selectedSchool && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ 
                  bgcolor: 'primary.main',
                  width: 40,
                  height: 40
                }}>
                  {selectedSchool.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {selectedSchool.name}
                  </Typography>
                  <Chip 
                    label="Активний заклад" 
                    size="small" 
                    color="success" 
                    variant="outlined"
                  />
                </Box>
              </Box>
            )}
        </Box>
    </>
}