import React from "react";
import { IconButton } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";

const VisibilityButton = ({ label, visibility, onVisibilityChange }) => {
  const handleShow = () => {
    // setShow(!show);
    onVisibilityChange(label, !visibility);
  };

  return (
    <div className="hoverShowButton">
      <div className={visibility === false ? "showButton" : "hideButton"}>
        <IconButton style={{ padding: "2px" }} onClick={handleShow}>
          {visibility ? (
            <Visibility fontSize="small" style={{ fill: "black" }} />
          ) : (
            <VisibilityOff fontSize="small" style={{ fill: "black" }} />
          )}
        </IconButton>
      </div>
    </div>
  );
};

export default VisibilityButton;
