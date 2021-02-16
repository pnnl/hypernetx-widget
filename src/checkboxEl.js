import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';

const CheckboxEl = ({ label, checkState, sendCheck }) => {
  const [check, setCheck] = React.useState(checkState);

  const handleCheck = (e) => {
    setCheck(e);
    sendCheck(label, e);
  }

  return (
    <div>
      <Checkbox size="small" checked={checkState} onChange={(event) => handleCheck(event.currentTarget.checked)}/>
    </div>
  )
}

export default CheckboxEl
