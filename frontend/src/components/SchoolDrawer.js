import { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  Divider,
} from '@mui/material'
import AddSchoolDialog from '../dialog/AddSchoolDialog.js';

export default function SchoolDrawer ({ schools, drawerOpen, handleSchoolSelect }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSchoolAddition = (school) => {
    handleSchoolSelect(school);
    setDialogOpen(false);
  }

  return <>
    <Drawer anchor="left" open={drawerOpen} onClose={() => handleSchoolSelect(false)}>
      <Box sx={{ width: 250 }} role="presentation">
        <List>
          {schools.map(school => (
            <ListItem key={school?.id} disablePadding>
              <ListItemButton onClick={() => handleSchoolSelect(school)}>
                <ListItemText primary={school?.name}/>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider/>
        <Box sx={{ p: 2 }}>
          <Button variant="outlined" fullWidth onClick={() => setDialogOpen(true)}>Додати нову</Button>
        </Box>
      </Box>
    </Drawer>
    <AddSchoolDialog
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      onSchoolAdded={handleSchoolAddition} // Implement the logic to refresh the school list after adding a new school
    />
  </>
}