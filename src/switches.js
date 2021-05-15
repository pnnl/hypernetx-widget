import React, { useState } from "react";
import { FormControlLabel, FormGroup, Switch } from "@material-ui/core";

const Switches = ({ dataType, onSwitchChange }) => {
  // const [showLabels, setShowLabels] = useState(true);
  // const [collapseNodes, setCollapseNodes] = useState(false);
  // const [linegraph, setLinegraph] = useState(false);

  const [state, setState] = useState({
    showLabels: true,
    collapseNodes: false,
    bipartite: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
    onSwitchChange(dataType, {
      ...state,
      [event.target.name]: event.target.checked,
    });
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "5px",
        // flexDirection: "column",
      }}
    >
      {/*<FormGroup>*/}
      <FormControlLabel
        control={
          <Switch
            checked={state.showLabels}
            onChange={handleChange}
            color={"primary"}
            name={"showLabels"}
            size={"small"}
          />
        }
        label={<div style={{ fontSize: "13px" }}>Show labels</div>}
      />
      {dataType === "node" && (
        <FormControlLabel
          control={
            <Switch
              checked={state.collapseNodes}
              onChange={handleChange}
              color={"primary"}
              name={"collapseNodes"}
              size={"small"}
            />
          }
          label={<div style={{ fontSize: "13px" }}>Collapse nodes</div>}
        />
      )}
      {dataType === "edge" && (
        <FormControlLabel
          control={
            <Switch
              checked={state.bipartite}
              onChange={handleChange}
              color={"primary"}
              name={"bipartite"}
              size={"small"}
            />
          }
          label={<div style={{ fontSize: "13px" }}>Bipartite</div>}
        />
      )}
      {/*</FormGroup>*/}
    </div>
  );
};

export default Switches;
