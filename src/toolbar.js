import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import {
  VisibilityOutlined,
  VisibilityOff,
  SettingsBackupRestore,
  PictureInPicture,
  SelectAll,
  Clear,
  FlipCameraAndroid,
  BubbleChart,
  LinearScale,
  Navigation,
  ZoomIn,
  ZoomOut,
  OpenWith,
  Transform,
  ZoomOutMap,
  HelpOutlined,
  LocationOff,
  RemoveCircleOutlineOutlined,
  CallMadeOutlined,
} from "@material-ui/icons";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";
import IconWithTooltip from "./iconWithTooltip";

const toggleStyle = makeStyles((theme) => ({
  toggleButton: {
    "& .MuiToggleButton-root": {
      // color: "#d3d3d3",
      // border: "1px solid #605f5f",
      fontSize: "9px",
      height: 30,
      maxWidth: 100,
    },
    "& .Mui-selected": {
      color: "black",
      // backgroundColor: "#ECECEC"
    },
    "& .Mui-disabled": {
      pointerEvents: "auto",
      // color: "#d3d3d3"
    },
  },
}));
const Toolbar = ({ category, dataType, selectionState, onSelectionChange }) => {
  const classes = toggleStyle();
  const [selectionType, setSelectionType] = React.useState(
    category === "Data"
      ? "original"
      : category === "Graph"
      ? "undo"
      : category === "Selection"
      ? "cursor"
      : "zoom in"
  );

  const handleSelection = (event, newSelection) => {
    if (newSelection === null) {
      onSelectionChange(dataType, selectionType);
    } else {
      setSelectionType(newSelection);
      onSelectionChange(dataType, newSelection);
    }
  };

  return (
    <div style={{ paddingTop: "5px", paddingRight: "7px" }}>
      <div
        style={{ fontFamily: "Arial", fontSize: "14px", paddingBottom: "5px" }}
      >
        {category === "Data" ? dataType : category}
      </div>
      {category === "Data" && (
        <ToggleButtonGroup
          size={"small"}
          classes={{ root: classes.toggleButton }}
          value={selectionType}
          exclusive
          onChange={handleSelection}
        >
          <ToggleButton value={"original"}>
            <IconWithTooltip
              text={"Return to original"}
              iconImage={<SettingsBackupRestore />}
            />
          </ToggleButton>
          <ToggleButton
            value={"hidden"}
            disabled={!Object.values(selectionState).includes(true)}
          >
            <IconWithTooltip
              text={"Hide selected"}
              iconImage={
                Object.values(selectionState).includes(true) ? (
                  <VisibilityOff />
                ) : (
                  <VisibilityOutlined />
                )
              }
            />
          </ToggleButton>
          <ToggleButton
            value={"removed"}
            disabled={!Object.values(selectionState).includes(true)}
          >
            <IconWithTooltip
              text={"Remove selected"}
              iconImage={<RemoveCircleOutlineOutlined />}
            />
          </ToggleButton>
          <ToggleButton
            value={"other"}
            disabled={!Object.values(selectionState).includes(true)}
          >
            <IconWithTooltip
              text={
                dataType === "Nodes"
                  ? "Select all edges containing selected nodes"
                  : "Select all nodes in selected edges"
              }
              iconImage={<PictureInPicture />}
            />
          </ToggleButton>
          <ToggleButton value={"all"}>
            <IconWithTooltip text={"Select all"} iconImage={<SelectAll />} />
          </ToggleButton>
          <ToggleButton
            value={"none"}
            disabled={!Object.values(selectionState).includes(true)}
          >
            <IconWithTooltip text={"Unselect all"} iconImage={<Clear />} />
          </ToggleButton>
          <ToggleButton
            value={"reverse"}
            disabled={!Object.values(selectionState).includes(true)}
          >
            <IconWithTooltip
              text={"Reverse selection"}
              iconImage={<FlipCameraAndroid />}
            />
          </ToggleButton>
          {dataType === "Nodes" && (
            <ToggleButton value={"unpin"}>
              <IconWithTooltip text={"Unpin all"} iconImage={<LocationOff />} />
            </ToggleButton>
          )}
        </ToggleButtonGroup>
      )}

      {category === "Graph" && (
        <ToggleButtonGroup
          size={"small"}
          classes={{ root: classes.toggleButton }}
          value={selectionType}
          exclusive
          onChange={handleSelection}
        >
          <ToggleButton value={"undo"}>
            <IconWithTooltip
              text={"Return to original"}
              iconImage={<SettingsBackupRestore />}
            />
          </ToggleButton>
          <ToggleButton value={"collapse"}>
            <IconWithTooltip
              text={"Collapse nodes"}
              iconImage={<BubbleChart />}
            />
          </ToggleButton>
          <ToggleButton value={"bipartite"}>
            <IconWithTooltip
              text={"Convert to bipartite"}
              iconImage={<LinearScale />}
            />
          </ToggleButton>
        </ToggleButtonGroup>
      )}

      {category === "Selection" && (
        <ToggleButtonGroup
          size={"small"}
          classes={{ root: classes.toggleButton }}
          value={selectionType}
          exclusive
          onChange={handleSelection}
        >
          <ToggleButton value={"cursor"}>
            <IconWithTooltip
              text={"Mouse cursor select"}
              iconImage={<Navigation />}
            />
          </ToggleButton>
          <ToggleButton value={"node-brush"}>
            <IconWithTooltip
              text={"Brush select nodes"}
              iconImage={<Transform />}
            />
          </ToggleButton>
          <ToggleButton value={"edge-brush"}>
            <IconWithTooltip
              text={"Brush select edges"}
              iconImage={<CallMadeOutlined />}
            />
          </ToggleButton>
        </ToggleButtonGroup>
      )}

      {category === "Navigation" && (
        <ToggleButtonGroup
          size={"small"}
          classes={{ root: classes.toggleButton }}
          value={selectionType}
          exclusive
          onChange={handleSelection}
        >
          <ToggleButton value={"zoom in"}>
            <IconWithTooltip text={"Zoom in"} iconImage={<ZoomIn />} />
          </ToggleButton>
          <ToggleButton value={"zoom out"}>
            <IconWithTooltip text={"Zoom out"} iconImage={<ZoomOut />} />
          </ToggleButton>
          <ToggleButton value={"pan"}>
            <IconWithTooltip text={"Pan"} iconImage={<OpenWith />} />
          </ToggleButton>
          <ToggleButton value={"fullscreen"}>
            <IconWithTooltip
              text={"View fullscreen"}
              iconImage={<ZoomOutMap />}
            />
          </ToggleButton>
          <ToggleButton value={"help"}>
            <IconWithTooltip
              text={"View help menu"}
              iconImage={<HelpOutlined />}
            />
          </ToggleButton>
        </ToggleButtonGroup>
      )}
    </div>
  );
};

export default Toolbar;
