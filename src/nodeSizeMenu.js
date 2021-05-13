import React from "react";
import FormControl from "@material-ui/core/FormControl";
import { InputLabel, MenuItem, Select } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  customSelect: {
    "& .MuiFormLabel-root": {
      fontSize: "13px",
    },
    // "& .MuiSelect-select.MuiSelect-select": {
    //   fontSize: "13px",
    // },
  },
}));

const NodeSizeMenu = ({ currGroup, metadata, onGroupChange }) => {
  const classes = useStyles();
  const [group, setGroup] = React.useState(currGroup);
  const handleSize = (event) => {
    setGroup(event.target.value);
    onGroupChange(event.target.value, metadata);
  };

  const columns =
    metadata !== undefined
      ? Object.keys(Object.values(metadata)[0]).concat("None")
      : ["None", "Degree"];

  return (
    <div style={{ padding: "5px", width: "100%", display: "flex" }}>
      <div
        style={{
          fontFamily: "Arial",
          fontSize: "13px",
          padding: "3px",
          // paddingTop: "8px",
          paddingRight: "8px",
        }}
      >
        {"Node size"}
      </div>
      <FormControl classes={{ root: classes.customSelect }}>
        <Select value={group} onChange={handleSize}>
          {columns.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default NodeSizeMenu;
