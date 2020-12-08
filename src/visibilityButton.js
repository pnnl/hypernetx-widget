import React from 'react';
import { Button } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

const VisibilityButton = ({ label, visibility, sendVisibility }) => {

  const [show, setShow] = React.useState(true);
  const handleShow = () => {
    setShow(!show);
    sendVisibility(label, !show);
  }

  // console.log([node, show]);
  return(
    <div className="show">
      <Button color="primary" onClick={handleShow}>
        {visibility ? <Visibility style={{fill: "black"}} /> : <VisibilityOff style={{fill: "black"}} />}
      </Button>
    </div>
  )
}

export default VisibilityButton
