import React from 'react';
import {ToggleButtonGroup} from "@material-ui/lab";
import {ToggleButton} from "@material-ui/lab";
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import Tooltip from '@material-ui/core/Tooltip';
import {makeStyles} from "@material-ui/core/styles";

const toggleStyle = makeStyles((theme) => ({
    toggleButton: {
        "& .MuiToggleButton-root": {
            color: "#d3d3d3",
            border: "1px solid #605f5f",
            fontSize: "9px",
            height: 30,
            maxWidth: 100,

        },
        "& .Mui-selected":{
            color: "black",
            backgroundColor: "#ECECEC"
        },
        "& .Mui-disabled":{
            color: "#d3d3d3"
        }
    },

}))
const Toolbar = ({ dataType, onSelectionChange }) => {

    const classes = toggleStyle();
    const [selectionType, setSelectionType] = React.useState("original");

    const handleSelection = (event, newSelection) => {
        if(newSelection === null){
            onSelectionChange(dataType, selectionType);
        }
        else{
            setSelectionType(newSelection);
            onSelectionChange(dataType, newSelection);
        }
    }


    return(
      <div style={{ paddingRight: "7px",}}>
          <div style={{fontFamily: "Arial", fontSize: "14px", paddingBottom: "5px"}}>
              {dataType === "node" ? "Nodes" : "Edges "}
          </div>
          <ToggleButtonGroup
            size={"small"}
            classes={{root: classes.toggleButton}}
            value={selectionType}
            exclusive
            onChange={handleSelection}
          >
              <ToggleButton value={"original"}>
                  <Tooltip title={<div style={{fontSize: "14px", padding: "3px"}}>Return to original</div>}>
                      <SettingsBackupRestoreIcon />
                  </Tooltip>
              </ToggleButton>

              <ToggleButton value={"hidden"}>
                  <Tooltip title={<div style={{fontSize: "14px", padding: "3px"}}>Hide selected</div>}>
                      <VisibilityOffIcon />
                  </Tooltip>
              </ToggleButton>

              <ToggleButton value={"removed"}>
                  <Tooltip title={<div style={{fontSize: "14px", padding: "3px"}}>Remove selected</div>}>
                      <RemoveCircleOutlineIcon />
                  </Tooltip>

              </ToggleButton>

              <ToggleButton value={"other"}>
                  <Tooltip title={<div style={{fontSize: "14px", padding: "3px"}}>{dataType === "node" ? "Select all edges containing selected nodes " : "Select all nodes in selected edges"}</div>}>
                      <BubbleChartIcon />
                  </Tooltip>

              </ToggleButton>


          </ToggleButtonGroup>

      </div>
    )
}

export default Toolbar
