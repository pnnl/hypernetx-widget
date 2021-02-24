import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { showButtonStyles } from './functions.js';

const ShowButton = ({ type, sendButton, currButton }) => {
  const classes = showButtonStyles();
  const [selectedValue, setSelectedValue] = React.useState(currButton);

  const handleChange = (event, newValue) => {
    setSelectedValue(newValue);
    sendButton(type, newValue);
  }


  return <div style={{paddingTop: "10px", paddingLeft: "5px", display:"flex", justifyContent: "center"}}>
  <ToggleButtonGroup classes={{root: classes.customButton}}
    size="small"
    value={selectedValue}
    exclusive
    onChange={handleChange}
  >
    <ToggleButton value="selected">
    Show selected
    </ToggleButton>

    <ToggleButton value="hidden">
    Show hidden
    </ToggleButton>

    <ToggleButton value="default">
    None
    </ToggleButton>
  </ToggleButtonGroup>

  </div>
}

export default ShowButton
