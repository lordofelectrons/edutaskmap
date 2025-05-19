import { React, useState } from 'react';
import { Typography,
  Box,
  Button,
} from '@mui/material';
import SchoolDrawer from './SchoolDrawer';

export default function SchoolSelection ({ schools, selectedSchool, setSelectedSchool }) {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleSchoolSelect = (school) => {
        setSelectedSchool(school);
        setDrawerOpen(false);
    };

    return <>
        <SchoolDrawer schools={schools} drawerOpen={drawerOpen} handleSchoolSelect={handleSchoolSelect} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 8 }}>
            <Button sx={{ backgroundColor: '#facc15', color: 'black', fontWeight: 'bold', fontSize: '1.25rem' }} onClick={() => setDrawerOpen(true)}>
            Заклад освіти
            </Button>
            <Typography variant="body2">{selectedSchool}</Typography>
        </Box>
    </>
}