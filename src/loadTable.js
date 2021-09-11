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
  MenuItem,
  Select,
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
    metadata,
    usercols,
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    onUserCol,
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const metaHeadCells = [
    { id: "value", label: datatype === "node" ? "Degree" : "Size" },
    { id: "uid", label: "Label" },
    { id: "user", label: "UserDefined" },
    { id: "hidden", label: "Visibility" },
    { id: "removed", label: "Remove" },
    { id: "color", label: "Color" },
  ];

  const headCells = [
    { id: "value", label: datatype === "node" ? "Degree" : "Size" },
    { id: "uid", label: "Label" },
    { id: "hidden", label: "Visibility" },
    { id: "removed", label: "Remove" },
    { id: "color", label: "Color" },
  ];

  const headers = metadata ? metaHeadCells : headCells;

  const [userCol, setUserCol] = React.useState(props.usercols[0] || "");

  const handleUserCol = (e) => {
    setUserCol(e.target.value);
    onUserCol(e.target.value);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="normal">
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
        {headers.map((headCell) => (
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
              {headCell.id === "user" && metadata !== undefined && (
                <div style={{ textAlign: "left", paddingRight: "0px" }}>
                  <Select
                    style={{ fontSize: "12px", minWidth: 0, maxWidth: 30 }}
                    value={userCol}
                    onChange={handleUserCol}
                  >
                    {usercols.map((c) => (
                      <MenuItem style={{ fontSize: "12px" }} key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              )}
              {(headCell.id === "uid" || headCell.id === "value") && (
                <div style={{ textAlign: "right" }}>{headCell.label}</div>
              )}
              {headCell.id === "hidden" && (
                <Tooltip
                  title={
                    <div style={{ fontSize: "14px", padding: "3px" }}>
                      {"Hide/show " + datatype + "s"}
                    </div>
                  }
                >
                  <VisibilityOutlined
                    size={"small"}
                    style={{ paddingLeft: "3px" }}
                  />
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
  metadata: PropTypes.object,
  usercols: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  onUserCol: PropTypes.func.isRequired,
};

const LoadTable = ({
  type,
  metadata,
  data,
  onColorChange,
  onVisibleChange,
  onSelectedChange,
  onRemovedChange,
  onSelectAllChange,
}) => {
  // columns from metadata to add
  const addColumns = metadata
    ? Object.keys(Object.values(metadata)[0]).filter(
        (d) => d !== "Degree" && d !== "Size"
      )
    : [];

  const fullData = [];
  if (metadata) {
    Object.entries(metadata).map((m) =>
      data.map((d) => {
        if (d.uid === m[0]) {
          let combinedObj = { ...d, ...m[1] };
          fullData.push(combinedObj);
        }
      })
    );
  }

  const classes = tableStyles();
  const calcBar = (i) => {
    const values = data.map((x) => x.value);
    return String(100 * (i / max(values))) + "%";
  };

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("label");
  const [userCol, setUserCol] = React.useState(addColumns[0] || "");

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

  const formatData = (value) => {
    if (typeof value === "number") {
      if (value % 1 !== 0) {
        return Number(value.toFixed(2));
      }
      return value;
    } else if (typeof value === "boolean") {
      return +value;
    } else {
      return value;
    }
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
            metadata={metadata}
            usercols={addColumns}
            classes={classes}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
            onUserCol={(col) => setUserCol(col)}
          />
          <TableBody>
            {stableSort(
              metadata ? fullData : data,
              getComparator(order, orderBy === "user" ? userCol : orderBy)
            ).map((x, i) => (
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

                    <div style={{ display: "inline-block" }}>{+x.value}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div
                    style={{
                      display: "inline-block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: "40px",
                      textAlign: "left",
                    }}
                  >
                    {x.uid}
                  </div>
                </TableCell>
                {metadata !== undefined && (
                  <TableCell
                    style={{ textOverflow: "ellipsis", width: "40px" }}
                  >
                    {formatData(x[userCol])}
                  </TableCell>
                )}
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

                {/*<TableCell>{x[userCol]}</TableCell>*/}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default LoadTable;
