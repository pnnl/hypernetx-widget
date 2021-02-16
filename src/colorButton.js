import React from 'react';
import { ChromePicker } from 'react-color';
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
    sendColor(label, color.rgb);
    setColor(color.rgb);
  }

  return <div>
      <Button onClick={() => handleClick()}><Palette fontSize="small"
        style={{  fill:color}}/></Button>
      {palette ?
        <div className="popover">
          <div className="cover" onClick={() => handleClose()}/>
          <ChromePicker color={paletteColor} onChange={(c) => handleChangeColor(label, c)}/>
        </div> : null
      }
    </div>
}

export default ColorButton;
