import React from 'react';
import {ToggleButtonGroup} from "@material-ui/lab";
import {ToggleButton} from "@material-ui/lab";
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import Tooltip from '@material-ui/core/Tooltip';
import {Paper} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const toggleStyle = makeStyles((theme) => ({
    toggleButton: {
        "& .MuiToggleButton-root": {
            color: "#d3d3d3",
            border: "1px solid #605f5f",
            fontSize: "10px",
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
        // if(newSelection === "other"){
        //     if(dataType === "node"){
        //         onSelectionChange("edges in nodes", newSelection);
        //     }
        //     else{
        //         onSelectionChange("nodes in edges", newSelection);
        //     }
        // }
        // else{
        //     onSelectionChange(dataType, newSelection);
        // }

    }


    return(
      <div style={{ padding: "5px",}}>
          <div style={{textAlign: 'center', fontFamily: "Arial", fontSize: "14px", padding: "5px"}}>
              {dataType === "node" ? "Nodes" : "Edges"}
          </div>
          <ToggleButtonGroup
            size={"small"}
            classes={{root: classes.toggleButton}}
            value={selectionType}
            exclusive
            onChange={handleSelection}
          >
              <ToggleButton value={"original"}>
                  <Tooltip title={"Return to original"}>
                      <SettingsBackupRestoreIcon />
                  </Tooltip>
              </ToggleButton>

              <ToggleButton value={"hidden"}>
                  <Tooltip title={"Hide selected"}>
                      <VisibilityOffIcon />
                  </Tooltip>
              </ToggleButton>

              <ToggleButton value={"removed"}>
                  <Tooltip title={"Remove selected"}>
                      <RemoveCircleOutlineIcon />
                  </Tooltip>

              </ToggleButton>

              <ToggleButton value={"other"}>
                  <Tooltip title={dataType === "Nodes" ? "Select all edges containing selected nodes " : "Select all nodes in selected edges"}>
                      <BubbleChartIcon />
                  </Tooltip>

              </ToggleButton>


          </ToggleButtonGroup>

      </div>
    )
}

export default Toolbar
