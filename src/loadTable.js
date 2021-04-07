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
import CheckboxEl from './checkboxEl.js';
import ColorButton from './colorButton.js';
import VisibilityButton from './visibilityButton.js';
import { makeStyles } from '@material-ui/core/styles';
import { max } from 'd3-array';
import {getComparator, rgbToHex, stableSort} from './functions.js';
import RemoveButton from "./removeButton";
import { ChromePicker } from 'react-color';
import { Palette } from '@material-ui/icons';
import PaletteOutlinedIcon from '@material-ui/icons/PaletteOutlined';
import {IconButton} from '@material-ui/core';
import './css/hnxStyle.css';


const tableStyles = makeStyles((theme) => ({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      whitespace: "nowrap",
      padding: "0px 0px 0px 0px",
      fontSize: "10px",
      fontWeight: 400,
      margin: "0px",
      // height: 5

    },
    "& .MuiTableCell-paddingNone": {
      // padding: "0px 0px 5px 15px",
      fontSize: "12px",
      fontWeight: 500,
      align: "center",
    },
    "& .MuiTableCell-alignLeft": {
      paddingLeft: "10px"
    },
    "& .MuiButton-text": {
      padding: "0px 0px 0px 0px",
    },
    "& .MuiTableSortLabel-icon": {
      fontSize: "14px",
      padding: "0px 0px 0px 0px",
      margin: "0px"
    },
    "& .MuiTableSortLabel-root": {
      fontSize: "12px"
    }
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

function EnhancedTableHead(props) {
  const { datatype, data, classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, onAllPaletteChange } = props;
  const sameColors = Array.from(new Set(data.map(d => d.color))).length === 1;


  const [paletteColor, setColor] = React.useState(sameColors ? data[0].color : "#000000ff");

  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const handleClick = () => {
    setPaletteOpen(!paletteOpen);
  }

  const handleClose = () => {
    setPaletteOpen(false);
  }

  const handleChangeColor = (color) => {
    const RGB = color.rgb;
    const rgbaStr = "rgba(" + RGB.r + ", " + RGB.g + ", " + RGB.b + ", " + RGB.a + ")";
    setColor(rgbToHex(rgbaStr));
    onAllPaletteChange(rgbToHex(rgbaStr));
  }

  const createSortHandler = (property) => (event) => {
     onRequestSort(event, property, paletteOpen);

  };

  const headCells = [
    {id: 'uid', label: 'Label'},
    {id: 'value', label: datatype === "node" ? "Degree" : "Size"},
    {id: 'hidden', label: 'Visibility'},
    {id: 'removed', label: 'Remove'},
    {id: 'color', label: 'Color'}
  ];

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="default">
          <Checkbox
            size="small"
            onChange={onSelectAllClick}
            checked={!data.map(x => x.selected === true).includes(false) }
            indeterminate={data.map(x => x.selected === true).includes(false) && data.map(x => x.selected === true).includes(true)}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            padding="none"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={!paletteOpen ? createSortHandler(headCell.id) : null}
            >
              {headCell.label}
              {headCell.id === 'color' &&
                <div>
                  <IconButton style={{padding:'2px'}} onClick={handleClick}>
                    {sameColors ? <Palette style={{ fill:paletteColor, fontSize: "x-large"}}/> : <PaletteOutlinedIcon style={{color: "black", fontSize:"x-large"}}/> }
                  </IconButton>
                </div>
              }
              {(paletteOpen && headCell.id === "color") ?
                <div className="popover-menu">
                  <div className={"cover"} onClick={() => handleClose()}/>
                  <ChromePicker color={paletteColor} onChange={(c) => handleChangeColor(c)}/>
                </div> : null
              }

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
  datatype: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  onAllPaletteChange: PropTypes.func.isRequired
};


const LoadTable = ({ type, data, onColorChange, onVisibleChange, onSelectedChange, onRemovedChange, onSelectAllChange, onAllColorChange }) => {
  const classes = tableStyles();
  const calcBar = i => {
    const values = data.map(x => x.value);
    return String(100 * (i/max(values)))+"%";
  }

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('label');

  const handleRequestSort = (event, property) => {

    const isAsc = orderBy === property && order === 'asc';

    // if(paletteState){
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    // }

  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      onSelectAllChange(type, true);
    }
    else{
      onSelectAllChange(type, false);
    }
  };

  const getColor = (label, color) => {
    onColorChange(type, label, color);
  }

  const getVisibility = (label, visibility) => {
    onVisibleChange(type, label, visibility);
  }

  const getCheck = (label, check) => {
    onSelectedChange(type, label, check);
  }

  const getRemove = (label, remove) =>{
    onRemovedChange(type, label, remove);
  }


  return <div style={{ margin: "0px", padding:"0px", }}>
  <TableContainer component={Paper} style={{ maxWidth: "100%", height:"265px", border: "1px solid lightgray",}}>
    <Table classes={{root: classes.customTable}} style={{tableLayout: "auto", }} stickyHeader size="small">
      <EnhancedTableHead
        datatype={type}
        data={data}
        classes={classes}
        order={order}
        orderBy={orderBy}
        onSelectAllClick={handleSelectAllClick}
        onRequestSort={handleRequestSort}
        rowCount={data.length}
        onAllPaletteChange={c => onAllColorChange(c, type)}
      />
      <TableBody>
        {stableSort(data, getComparator(order, orderBy))
          .map((x, i) =>
              <TableRow key={i}>
                <TableCell><CheckboxEl label={x.uid} checkState={x.selected === true} sendCheck={getCheck}/></TableCell>
                <TableCell align="left">
                    <div style={{ display: "inline-block"}}>{x.uid}</div>
                </TableCell>
                <TableCell align={type === "node" ? "left" : "center"}>
                    <div className="hbarCont">
                      <div className="hbar" style={{ width: calcBar(x.value) }}/>
                    </div>

                  <div style={{display: "inline-block"}}>{x.value}</div>

                </TableCell>
                <TableCell align="left"><VisibilityButton label={x.uid} visibility={!x.hidden} sendVisibility={getVisibility}/></TableCell>
                <TableCell align="left"><RemoveButton label={x.uid} remove={x.removed} onRemoveChange={getRemove}/></TableCell>
                <TableCell align="left"><ColorButton label={x.uid} color={x.color} onEachColorChange={getColor}/></TableCell>

              </TableRow>
            )
        }
      </TableBody>
    </Table>
  </TableContainer>
  </div>

}

export default LoadTable
