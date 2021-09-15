import React from "react";
import FormControl from "@material-ui/core/FormControl";
import { InputLabel, MenuItem, Select } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  customSelect: {
    "& .MuiFormLabel-root": {
      fontSize: "15px",
    },
  },
}));
const sizeArr = [
  "hide labels",
  8,
  10,
  12,
  14,
  16,
  18,
  20,
  22,
  24,
  26,
  28,
  36,
  48,
];

const FontSizeMenu = ({ type, currSize, onSizeChange }) => {
  const classes = useStyles();

  const [size, setSize] = React.useState(currSize[type]);
  const handleSize = (event) => {
    setSize(event.target.value);
    onSizeChange(type, event.target.value);
  };
  return (
    <div style={{ padding: "5px", width: "100%", display: "flex" }}>
      <div
        style={{
          fontFamily: "Arial",
          fontSize: "13px",
          padding: "3px",
          paddingRight: "8px",
        }}
      >
        Font size
      </div>
      <FormControl classes={{ root: classes.customSelect }}>
        {/*<InputLabel> Size </InputLabel>*/}
        <Select value={size} onChange={handleSize}>
          {sizeArr.map((x) => (
            <MenuItem key={x} value={x}>
              {x}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default FontSizeMenu;
