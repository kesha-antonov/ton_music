import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const rows = [
  {name: 'day', HourseOfListening: 2, NumberOfSounds: 20, CostInUsualMusicApps: 0.2, TONMusic: 0.1 },
  {name: 'month', HourseOfListening: 60, NumberOfSounds: 600, CostInUsualMusicApps: 6, TONMusic: 3},
];

export default function TablePrice() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: '50px' }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="center">Hourse of listening</TableCell>
            <TableCell align="center">Number of sounds</TableCell>
            <TableCell align="center">Cost in usual music apps</TableCell>
            <TableCell align="center">TON Music</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="center">{row.HourseOfListening}</TableCell>
              <TableCell align="center">{row.NumberOfSounds}</TableCell>
              <TableCell align="center">{row.CostInUsualMusicApps}</TableCell>
              <TableCell align="center">{row.TONMusic}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}