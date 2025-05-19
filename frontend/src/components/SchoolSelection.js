import { React, useState } from 'react';
import { Typography,
  Box,
  Button,
} from '@mui/material';
import SchoolDrawer from './SchoolDrawer';

export default function SchoolSelection (selectedSchool, setSelectedSchool) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    return <>
        <SchoolDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} selectedSchool={selectedSchool} setSelectedSchool={setSelectedSchool} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 8 }}>
            <Button sx={{ backgroundColor: '#facc15', color: 'black', fontWeight: 'bold', fontSize: '1.25rem' }} onClick={setDrawerOpen(true)}>
            Заклад освіти
            </Button>
            <Typography variant="body2">{selectedSchool}</Typography>
        </Box>
    </>
}