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

const sizeArr = [1, 3, 5, 7, 9];

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
    <div style={{ padding: "5px", width: "100%" }}>
      <div
        style={{
          fontFamily: "Arial",
          fontSize: "15px",
          paddingTop: "8px",
          paddingBottom: "8px",
        }}
      >
        {"Node size"}
      </div>
      <FormControl classes={{ root: classes.customSelect }}>
        <InputLabel> Group by </InputLabel>
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
