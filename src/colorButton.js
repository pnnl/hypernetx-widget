import React from 'react';
import { CompactPicker, ChromePicker, SketchPicker } from 'react-color';
import { Palette } from '@material-ui/icons';
import { Button } from '@material-ui/core';
import './css/hnxStyle.css';

const ColorButton = ({ label, color, sendColor }) => {

  const [paletteColor, setColor] = React.useState("#000000");
  const [palette, setPalette] = React.useState(false);

  const handleClick = () => {
    setPalette(!palette);
  }
  const handleClose = () => {
    setPalette(false);
  }

  const handleChangeColor = (label, color) => {
    sendColor(label, color.hex);
    setColor(color.hex);
  }

  return <div style={{}}>
      <Button onClick={() => handleClick()}><Palette style={{ fill:color }}/></Button>
      {palette ?
        <div className="popover">
          <div onClick={() => handleClose()}/>
          <SketchPicker color={paletteColor} onChange={(c) => handleChangeColor(label, c)}/>
        </div> : null
      }
    </div>
}

export default ColorButton;
