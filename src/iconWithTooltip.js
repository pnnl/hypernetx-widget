import React from "react";
import Tooltip from "@material-ui/core/Tooltip";

const IconWithTooltip = ({ text, iconImage }) => {
  return (
    <div style={{ paddingTop: "5px" }}>
      <Tooltip
        title={<div style={{ fontSize: "14px", padding: "3px" }}>{text}</div>}
      >
        {iconImage}
      </Tooltip>
    </div>
  );
};

export default IconWithTooltip;
