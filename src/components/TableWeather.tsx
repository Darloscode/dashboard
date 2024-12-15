import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Item from '../interface/Item';
import { useEffect, useState } from 'react';

interface MyProp {
  itemsIn: Item[];
}
{/*
function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}


const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];*/}

export default function BasicTable(props: MyProp) {
  {/* Variable de estado y función de actualización */ }
  const [rows, setRows] = useState<Item[]>([]);

  {/* Hook: useEffect useEffect para actualizar rows cuando el prop itemsIn cambie */}
  useEffect(() => {
    setRows(props.itemsIn);
  }, [props.itemsIn]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Hora de Inicio</TableCell>
            <TableCell align="center">Hora de Fin</TableCell>
            <TableCell align="center">Precipitación</TableCell>
            <TableCell align="center">Humedad</TableCell>
            <TableCell align="center">Nubosidad</TableCell>
            <TableCell align="center">Temperatura</TableCell>
            <TableCell align="center">Visibilidad</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow
              key={idx}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" align="center" scope="row">{row.dateStart.replace("T"," - ")}</TableCell>
              <TableCell align="center">{row.dateEnd.replace("T"," - ")}</TableCell>
              <TableCell align="center">{row.precipitation+"%"}</TableCell>
              <TableCell align="center">{row.humidity+"%"}</TableCell>
              <TableCell align="center">{row.clouds+"%"}</TableCell>
              <TableCell align="center">{row.temperature+" °K"}</TableCell>
              <TableCell align="center">{row.visibility}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}