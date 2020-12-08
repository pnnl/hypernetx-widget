import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import { max } from 'd3-array';
import VisibilityButton from './visibilityButton.js';
import ColorButton from './colorButton.js';
import { makeStyles } from '@material-ui/core/styles';
import { Visibility, VisibilityOff } from '@material-ui/icons';


import './css/hnxStyle.css';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {

  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {id: 'uid', disablePadding: false, label: 'Labels'},
  {id: 'value', disablePadding: false, label: 'Degree'},
  {id: 'show', disablePadding: true, label: 'Visibility'},
  {id: 'color', disablePadding: true, label: 'Color'}
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'center'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  numSelected: PropTypes.number.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({

  table: {
    // minWidth: 750,
    // width:"90%"
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));



const DataTable = ({ data }) => {
  // console.log(data);
  // const temp = data.map(x => x['show'] = 1);
  // console.log("new", data);
  const calcBar = i => {
    const values = data.map(x => x.value);
    return String(100 * (i/max(values)))+"%";
  }

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const classes = useStyles();

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('label');
  const [selected, setSelected] = React.useState([]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.uid);
      // console.log(newSelecteds);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);

    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const dataMap = new Map();
  data.map(x => {
    if(!dataMap.has(x.uid)){
      dataMap.set(x.uid, 1)
    }
  })
  const [vis, setVis] = React.useState(Object.fromEntries(dataMap));

  const getVisibility = (x) => {
    // console.log(x[0])
    setVis({...vis, [x[0].uid]:x[1]});
  }

  const newData = data.map(x => ({...x, show: vis[x.uid]}));
  // console.log(newData);


  return <div>
  <TableContainer component={Paper} style={{maxWidth:"490px", maxHeight:"350px"}}>
    <Table stickyHeader aria-label="sticky table" size="small">

      <EnhancedTableHead
        classes={classes}
        order={order}
        orderBy={orderBy}
        numSelected={selected.length}
        onSelectAllClick={handleSelectAllClick}
        onRequestSort={handleRequestSort}
        rowCount={data.length}
      />
      <TableBody>
        {stableSort(newData, getComparator(order, orderBy))
          .map((x, i) => {
            const isItemSelected = isSelected(x.uid);
            return (
              <TableRow
                className="listitem"
                key={i}
                selected={isItemSelected}
              >
                <TableCell padding="checkbox">
                <Checkbox
                  checked={isItemSelected}
                  onChange={(event) => handleClick(event, x.uid)}
                />
                </TableCell>
                <TableCell>

                  <div className="hbar">
                    <div style={{ width: calcBar(x.value), minWidth:"1px", height:"7px", backgroundColor:"gray" }}/>
                  </div>
                  <div style={{display:"inline-block"}}>{x.uid}</div>
                </TableCell>
                <TableCell>{x.value}</TableCell>
                <TableCell>{x.show}<VisibilityButton node={x} sendVisibility={getVisibility}/></TableCell>
                <TableCell><ColorButton /></TableCell>
              </TableRow>
            )
          })
        }
      </TableBody>
    </Table>
  </TableContainer>
  </div>

}

export default DataTable
