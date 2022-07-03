import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

export default function ButtonAppBar(props) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TON MUSIC
          </Typography>
          <Button onClick={() => props.setIsLoggedIn(true)} color="inherit">Sign in</Button>
          <Button onClick={() => props.setIsLoggedIn(true)} color="inherit">Sing up</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}