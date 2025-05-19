import { Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  Divider, } from '@mui/material';

export default function SchoolDrawer ({ schools, drawerOpen, handleSchoolSelect }) {
    return <Drawer anchor="left" open={drawerOpen} onClose={() => handleSchoolSelect(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {schools.map((school, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => handleSchoolSelect(school)}>
                  <ListItemText primary={school} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Button variant="outlined" fullWidth onClick={() => alert('Додати новий заклад')}>Додати новий</Button>
          </Box>
        </Box>
      </Drawer>
}