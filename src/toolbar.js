import React from 'react';
import {ToggleButtonGroup} from "@material-ui/lab";
import {ToggleButton} from "@material-ui/lab";
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import SelectAllIcon from '@material-ui/icons/SelectAll';
import ClearIcon from '@material-ui/icons/Clear';
import LocationOffIcon from '@material-ui/icons/LocationOff';
import PictureInPictureIcon from '@material-ui/icons/PictureInPicture';
import LinearScaleIcon from '@material-ui/icons/LinearScale';
import Tooltip from '@material-ui/core/Tooltip';
import {makeStyles} from "@material-ui/core/styles";
import FlipCameraAndroidIcon from '@material-ui/icons/FlipCameraAndroid';
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap";

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
            pointerEvents: "auto"
            // color: "#d3d3d3"
        }
    },

}))
const Toolbar = ({ dataType, selectionState, onSelectionChange }) => {

    const classes = toggleStyle();
    const [selectionType, setSelectionType] = React.useState(dataType !== 'graph' ? "original" : "undo");

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
      <div style={{  paddingTop: "5px", paddingRight: "7px",}}>
          <div style={{fontFamily: "Arial", fontSize: "14px", paddingBottom: "5px"}}>
              {dataType === "node" ? "Nodes" : dataType === "edge" ? "Edges " : "Graph"}
          </div>
          <ToggleButtonGroup
            size={"small"}
            classes={{root: classes.toggleButton}}
            value={selectionType}
            exclusive
            onChange={handleSelection}
          >
              {dataType !== 'graph' &&
              <ToggleButton value={"original"}>
                  <Tooltip title={<div style={{fontSize: "14px", padding: "3px"}}>Return to original</div>}>
                      <SettingsBackupRestoreIcon />
                  </Tooltip>
              </ToggleButton>
              }

              {dataType === 'graph' &&
              <ToggleButton value={"undo"}>
                  <Tooltip title={<div style={{fontSize: "14px", padding: "3px"}}>Return to original</div>}>
                      <SettingsBackupRestoreIcon />
                  </Tooltip>
              </ToggleButton>
              }

              {dataType !== 'graph' &&
                  <ToggleButton value={"hidden"} disabled={!Object.values(selectionState).includes(true)}>
                      <Tooltip title={<div style={{fontSize: "14px", padding: "3px"}}>Hide selected</div>}>
                          {Object.values(selectionState).includes(true) ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                      </Tooltip>
                  </ToggleButton>
              }

              {dataType !== 'graph' &&
                  <ToggleButton value={"removed"} disabled={!Object.values(selectionState).includes(true)}>
                      <Tooltip title={<div style={{fontSize: "14px", padding: "3px"}}>Remove selected</div>}>
                          <RemoveCircleOutlineIcon/>
                      </Tooltip>
                  </ToggleButton>
              }

              {dataType !== 'graph' &&
                  <ToggleButton value={"other"} disabled={!Object.values(selectionState).includes(true)}>
                      <Tooltip title={<div style={{
                          fontSize: "14px",
                          padding: "3px"
                      }}>{dataType === "node" ? "Select all edges containing selected nodes " : "Select all nodes in selected edges"}</div>}>
                          <PictureInPictureIcon/>
                      </Tooltip>
                  </ToggleButton>
              }

              {dataType !== 'graph' &&
                  <ToggleButton value={"all"}>
                      <Tooltip title={<div style={{fontSize: "14px", padding: "3px"}}>Select all</div>}>
                          <SelectAllIcon/>
                      </Tooltip>
                  </ToggleButton>
              }

              {dataType !== 'graph' &&
                  <ToggleButton value={"none"} disabled={!Object.values(selectionState).includes(true)}>
                      <Tooltip title={<div style={{fontSize: "14px", padding: "3px"}}>Unselect all</div>}>
                          <ClearIcon/>
                      </Tooltip>
                  </ToggleButton>
              }

              {dataType !== 'graph' &&
                  <ToggleButton value={"reverse"} disabled={!Object.values(selectionState).includes(true)}>
                      <Tooltip title={<div style={{fontSize: "14px", padding: "3px"}}>Reverse selection</div>}>
                          <FlipCameraAndroidIcon/>
                      </Tooltip>
                  </ToggleButton>
              }

              {dataType === "graph" &&
                <ToggleButton value={"fullscreen"}>
                    <Tooltip title={<div style={{fontSize: "14px", padding: "3px"}}>View fullscreen</div>}>
                        <ZoomOutMapIcon />
                    </Tooltip>
                </ToggleButton>
              }

              {dataType === "graph" &&
                <ToggleButton value={"collapse"}>
                    <Tooltip title={<div style={{fontSize: "14px", padding: "3px"}}>Collapse nodes</div>}>
                        <BubbleChartIcon />
                    </Tooltip>
                </ToggleButton>
              }

              {dataType === "graph" &&
                <ToggleButton value={"bipartite"}>
                    <Tooltip title={<div style={{fontSize: "14px", padding: "3px"}}>Convert to bipartite</div>}>
                        <LinearScaleIcon />
                    </Tooltip>
                </ToggleButton>
              }

              {/*{dataType === "node" &&*/}
              {/*<ToggleButton value={"pin"}>*/}
              {/*    <Tooltip title={<div style={{fontSize: "14px", padding: "3px"}}>Pin all</div>}>*/}
              {/*        <LocationOnIcon/>*/}
              {/*    </Tooltip>*/}
              {/*</ToggleButton>*/}
              {/*}*/}

              {dataType === "node" &&
              <ToggleButton value={"unpin"}>
                  <Tooltip title={<div style={{fontSize: "14px", padding: "3px"}}>Unpin all</div>}>
                      <LocationOffIcon />
                  </Tooltip>
              </ToggleButton>
              }



          </ToggleButtonGroup>

      </div>
    )
}

export default Toolbar
