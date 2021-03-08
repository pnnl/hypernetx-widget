import React from 'react';
import {IconButton} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

const VisibilityButton = ({ label, visibility, sendVisibility }) => {
  const [show, setShow] = React.useState(true);
  const handleShow = () => {
    setShow(!show);
    sendVisibility(label, !show);
  }

  return(
    <div className="hoverShow">
        <div className={visibility === false ? "show" : "hide"}>
            <IconButton style={{padding: '2px'}} onClick={handleShow}>
                {visibility ? <Visibility fontSize="small" style={{fill: "black"}} /> : <VisibilityOff fontSize="small" style={{fill: "black"}} />}
            </IconButton></div>
    </div>
  )
}

export default VisibilityButton
