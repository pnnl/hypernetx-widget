import React from 'react';
import { ChromePicker } from 'react-color';
import { Palette } from '@material-ui/icons';
import {IconButton} from '@material-ui/core';
import './css/hnxStyle.css';
import {rgbToHex} from "./functions";

const ColorButton = ({ label, color, onEachColorChange }) => {
  // console.log('color', color);
  const [paletteColor, setColor] = React.useState("#000000ff");
  const [palette, setPalette] = React.useState(false);

  const handleClick = () => {
    setPalette(!palette);
  }
  const handleClose = () => {
    setPalette(false);
  }

  const handleChangeColor = (label, color) => {
    const RGB = color.rgb;
    // console.log("RGB", RGB);
    const rgbaStr = "rgba(" + RGB.r + ", " + RGB.g + ", " + RGB.b + ", " + RGB.a + ")";
    // console.log("rgbaStr", rgbaStr);
    onEachColorChange(label, rgbaStr);
    // console.log(rgbToHex(rgbaStr));
    setColor(rgbToHex(rgbaStr));
  }

  return <div className="hoverShowButton">
      <div className={color !== "#000000ff"  ? "showButton" : "hideButton"}>
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
