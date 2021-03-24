import React from 'react';
import { ChromePicker } from 'react-color';
import { Palette } from '@material-ui/icons';
import {IconButton} from '@material-ui/core';
import './css/hnxStyle.css';

const ColorButton = ({ label, color, onEachColorChange }) => {
  const [paletteColor, setColor] = React.useState("#000000");
  const [palette, setPalette] = React.useState(false);

  const handleClick = () => {
    setPalette(!palette);
  }
  const handleClose = () => {
    setPalette(false);
  }

  const handleChangeColor = (label, color) => {
    onEachColorChange(label, color.rgb);
    setColor(color.rgb);
  }

  return <div className="hoverShowButton">
      <div className={color !== "#000000" ? "showButton" : "hideButton"}>
        <IconButton style={{padding:'2px'}} onClick={handleClick}>
          <Palette fontSize="small" style={{  fill:color}}/>
        </IconButton>

        {palette ?
            <div className="palettePopUp">
              <div className="cover" onClick={() => handleClose()}/>
              <ChromePicker color={paletteColor} onChange={(c) => handleChangeColor(label, c)}/>
            </div> : null
        }
      </div>

    </div>
}

export default ColorButton;
