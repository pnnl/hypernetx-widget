import React from 'react';
import { Button } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

const VisibilityButton = ({ label, visibility, sendVisibility }) => {
  const [show, setShow] = React.useState(true);
  const handleShow = () => {
    setShow(!show);
    sendVisibility(label, !show);
  }

  return(
    <div className="show">
      <Button color="primary" onClick={handleShow}>
        {visibility ? <Visibility fontSize="small" style={{fill: "black"}} /> : <VisibilityOff fontSize="small" style={{fill: "black"}} />}
      </Button>
    </div>
  )
}

export default VisibilityButton
