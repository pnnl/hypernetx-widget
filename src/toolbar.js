import React from 'react';
import {ToggleButtonGroup} from "@material-ui/lab";
import {ToggleButton} from "@material-ui/lab";
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import BlurOnIcon from '@material-ui/icons/BlurOn';
import BlurOffIcon from '@material-ui/icons/BlurOff';
import LocationOffIcon from '@material-ui/icons/LocationOff';
import Tooltip from '@material-ui/core/Tooltip';
import {makeStyles} from "@material-ui/core/styles";

const toggleStyle = makeStyles((theme) => ({
    toggleButton: {
        "& .MuiToggleButton-root": {
            // color: "#d3d3d3",
            // border: "1px solid #605f5f",
            fontSize: "9px",
            height: 30,
            maxWidth: 100,

        },
        "& .Mui-selected":{
            color: "black",
            // backgroundColor: "#ECECEC"
        },
        "& .Mui-disabled":{
            // color: "#d3d3d3"
        }
    },

}))
const Toolbar = ({ dataType, selectionState, onSelectionChange }) => {

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

              <ToggleButton value={"hidden"} disabled={!Object.values(selectionState).includes(true)}>
                  <Tooltip title={<div style={{fontSize: "14px", padding: "3px"}}>Hide selected</div>}>
                      {Object.values(selectionState).includes(true) ? <VisibilityOffIcon /> : <VisibilityIcon />}
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

              {dataType === "node" &&
                <ToggleButton value={"unpin"}>
                    <Tooltip title={<div style={{fontSize: "14px", padding: "3px"}}>Unpin all</div>}>
                        <LocationOffIcon />
                    </Tooltip>
                </ToggleButton>
              }

              <ToggleButton value={"all"}>
                  <Tooltip title={<div style={{fontSize: "14px", padding: "3px"}}>Select all</div>}>
                      <BlurOnIcon/>
                  </Tooltip>
              </ToggleButton>

              <ToggleButton value={"none"}>
                  <Tooltip title={<div style={{fontSize: "14px", padding: "3px"}}>Unselect all</div>}>
                      <BlurOffIcon/>
                  </Tooltip>
              </ToggleButton>


          </ToggleButtonGroup>

      </div>
    )
}

export default Toolbar
