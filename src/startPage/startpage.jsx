import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { CardMedia, Grid } from '@mui/material';
import TablePrice from './tablePrice';
import albom1 from '../assets/img/albom1.jpeg'
import albom2 from '../assets/img/albom2.jpeg'
import albom3 from '../assets/img/albom3.jpeg'


export default function StartPage() {
  return (
    <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
    >
        <Grid
          container
          direction="column"
          justifyContent="flex-end"
          alignItems="center"
>
    <Typography sx={style.head} display="inline" variant="h4" component="h4">
        million of songs...
    </Typography>
    <Typography sx={style.head} variant="h4" component="h4">
        but cheaper*
    </Typography>
    <CardMedia/>
    <Grid>
    <Box
        component="img"
        sx={{
          height: 500,
          width: 200,
          maxHeight: { xs: 233, md: 167 },
          maxWidth: { xs: 350, md: 250 },
          transform: 'rotate(-8deg)',
          mr: -2,
          mb: -2,
          borderRadius: 6,
        }}
        alt="The house from the offer."
        src={albom2}
      />
    <Box
        component="img"
        sx={{
          height: 500,
          width: 200,
          maxHeight: { xs: 233, md: 167 },
          maxWidth: { xs: 350, md: 250 },
          borderRadius: 6,
        }}
        alt="The house from the offer."
        src={albom1}
      />
        <Box
        component="img"
        sx={{
          height: 500,
          width: 200,
          maxHeight: { xs: 233, md: 167 },
          maxWidth: { xs: 350, md: 250 },
          transform: 'rotate(8deg)',
          m: -2,
          borderRadius: 6,
        }}
        alt="The house from the offer."
        src={albom3}
      />
      </Grid>
    </Grid>
    <Grid sx={{ mt: 8, width: '500px'}}>
    <Typography>
      *based on your listening:
    </Typography>
    <TablePrice/>
    </Grid>
    </Grid>
  );
}

const style = {
  head: {
    fontWeight: 800,
    fontSize: 40,
    marginBottom: '8px',
    mt: 1,
  },
  button: {
    mt: 8,
  },
}