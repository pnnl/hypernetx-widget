import React from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Checkbox,
  Tooltip,
} from "@material-ui/core";
import CheckboxEl from "./checkboxEl.js";
import ColorButton from "./colorButton.js";
import VisibilityButton from "./visibilityButton.js";
import RemoveButton from "./removeButton";
import { makeStyles } from "@material-ui/core/styles";
import { max } from "d3-array";
import { getComparator, stableSort } from "./functions.js";
import "./css/hnxStyle.css";
import {
  VisibilityOutlined,
  RemoveCircleOutlineOutlined,
  PaletteOutlined,
} from "@material-ui/icons";

const tableStyles = makeStyles((theme) => ({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      whitespace: "nowrap",
      padding: "0px 0px 0px 0px",
      fontSize: "10px",
      fontWeight: 400,
      margin: "0px",
    },
    "& .MuiTableCell-paddingNone": {
      fontSize: "12px",
      fontWeight: 500,
      align: "center",
    },
    "& .MuiButton-text": {
      padding: "0px 0px 0px 0px",
    },
    "& .MuiTableSortLabel-icon": {
      fontSize: "14px",
      padding: "0px 0px 0px 0px",
      margin: "0px",
    },
    "& .MuiTableSortLabel-root": {
      fontSize: "12px",
    },
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

function EnhancedTableHead(props) {
  const {
    datatype,
    data,
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    { id: "value", label: datatype === "node" ? "Degree" : "Size" },
    { id: "uid", label: "Label" },
    { id: "hidden", label: "Visibility" },
    { id: "removed", label: "Remove" },
    { id: "color", label: "Color" },
  ];

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="default">
          <Checkbox
            size="small"
            onChange={onSelectAllClick}
            checked={!data.map((x) => x.selected === true).includes(false)}
            indeterminate={
              data.map((x) => x.selected === true).includes(false) &&
              data.map((x) => x.selected === true).includes(true)
            }
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
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {(headCell.id === "uid" || headCell.id === "value") && (
                <div style={{ textAlign: "center" }}>{headCell.label}</div>
              )}
              {headCell.id === "hidden" && (
                <Tooltip
                  title={
                    <div style={{ fontSize: "14px", padding: "3px" }}>
                      {"Hide/show " + datatype + "s"}
                    </div>
                  }
                >
                  <VisibilityOutlined size={"small"} />
                </Tooltip>
              )}
              {headCell.id === "removed" && (
                <Tooltip
                  title={
                    <div style={{ fontSize: "14px", padding: "3px" }}>
                      {"Remove/show " + datatype + "s"}
                    </div>
                  }
                >
                  <RemoveCircleOutlineOutlined size={"small"} />
                </Tooltip>
              )}

              {headCell.id === "color" && (
                <Tooltip
                  title={
                    <div style={{ fontSize: "14px", padding: "3px" }}>
                      {"Color " + datatype + "s"}
                    </div>
                  }
                >
                  <PaletteOutlined />
                </Tooltip>
              )}

              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
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
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const LoadTable = ({
  type,
  data,
  onColorChange,
  onVisibleChange,
  onSelectedChange,
  onRemovedChange,
  onSelectAllChange,
}) => {
  const classes = tableStyles();
  const calcBar = (i) => {
    const values = data.map((x) => x.value);
    return String(100 * (i / max(values))) + "%";
  };

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("label");

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      onSelectAllChange(type, true);
    } else {
      onSelectAllChange(type, false);
    }
  };

  const getColor = (label, color) => {
    onColorChange(type, label, color);
  };

  const getVisibility = (label, visibility) => {
    onVisibleChange(type, label, visibility);
  };

  const getCheck = (label, check) => {
    onSelectedChange(type, label, check);
  };

  const getRemove = (label, remove) => {
    onRemovedChange(type, label, remove);
  };

  return (
    <div style={{ margin: "0px", padding: "0px" }}>
      <TableContainer
        component={Paper}
        style={{
          maxWidth: "100%",
          height: "265px",
          border: "1px solid lightgray",
        }}
      >
        <Table
          classes={{ root: classes.customTable }}
          style={{ tableLayout: "auto" }}
          stickyHeader
          size="small"
        >
          <EnhancedTableHead
            datatype={type}
            data={data}
            classes={classes}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
          />
          <TableBody>
            {stableSort(data, getComparator(order, orderBy)).map((x, i) => (
              <TableRow key={i}>
                <TableCell>
                  <CheckboxEl
                    label={x.uid}
                    checkState={x.selected === true}
                    sendCheck={getCheck}
                  />
                </TableCell>

                <TableCell>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div className="hbarCont">
                      <div
                        className="hbar"
                        style={{ width: calcBar(x.value) }}
                      />
                    </div>

                    <div style={{ display: "inline-block" }}>{x.value}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div
                    style={{
                      display: "inline-block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: "40px",
                      textAlign: "center",
                    }}
                  >
                    {x.uid}
                  </div>
                </TableCell>
                <TableCell align="left">
                  <VisibilityButton
                    label={x.uid}
                    visibility={!x.hidden}
                    onVisibilityChange={getVisibility}
                  />
                </TableCell>
                <TableCell align="left">
                  <RemoveButton
                    label={x.uid}
                    remove={x.removed}
                    onRemoveChange={getRemove}
                  />
                </TableCell>
                <TableCell align="left">
                  <ColorButton
                    label={x.uid}
                    color={x.color}
                    onEachColorChange={getColor}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default LoadTable;
