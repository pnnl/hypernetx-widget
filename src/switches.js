import React from "react";
import { FormControlLabel, FormGroup, Switch } from "@material-ui/core";

const Switches = ({ currData, dataType, onSwitchChange }) => {
  const [state, setState] = React.useState({
    collapseNodes: currData.collapseState,
    bipartite: currData.bipartiteState,
  });

  React.useEffect(() => {
    setState({ ...state, collapseNodes: currData.collapseState });
  }, [currData.collapseState]);

  React.useEffect(() => {
    setState({ ...state, bipartite: currData.bipartiteState });
  }, [currData.bipartiteState]);

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
      {/*<FormControlLabel*/}
      {/*  control={*/}
      {/*    <Switch*/}
      {/*      checked={state.showLabels}*/}
      {/*      onChange={handleChange}*/}
      {/*      color={"primary"}*/}
      {/*      name={"showLabels"}*/}
      {/*      size={"small"}*/}
      {/*    />*/}
      {/*  }*/}
      {/*  label={<div style={{ fontSize: "13px" }}>Show labels</div>}*/}
      {/*/>*/}
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
