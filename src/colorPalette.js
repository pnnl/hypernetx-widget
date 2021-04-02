import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import {range} from 'd3-array';
import { getScheme, hexToRgb, allPalettes, rgbToHex } from './functions.js';
import {Colorscale} from 'react-colorscales';
import {ChromePicker} from "react-color";
import { Palette } from '@material-ui/icons';
import {IconButton} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    // minWidth: 120,
    paddingLeft: "15px"
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  customSelect: {
    // paddingLeft: "15px",
    paddingRight:"5px",
    "& .MuiSelect-root": {
      // width: 100,

    },
  },
  colorItem: {
    "& .MuiSelect-root": {
      minWidth: 150,
      width: 200,
    },
  }
}));



const ColorPalette = ({type, data, defaultColors, onPaletteChange, currGroup, currPalette, onCurrDataChange}) => {

  const classes = useStyles();

  const [group, setGroup] = React.useState(currGroup);
  const [palette, setPalette] = React.useState(currPalette);
  // const [type, setType] = React.useState(currType);
  // const [paletteColor, setColor] = React.useState("#000000");
  const [paletteOpen, setPaletteOpen] = React.useState(false);

  const handlePalette = event => {
    setPalette(event.target.value);

    if(event.target.value === 'default'){
      onPaletteChange(type, defaultColors);
    }
    else{
      if(type === 'node'){
        const nodeColorPalette = getEachColors(group, event.target.value, data);
        onPaletteChange(type, Object.fromEntries(nodeColorPalette))
        onCurrDataChange(group, event.target.value, type);
      }
      else{
        const edgeColorPalette = getEachColors(group, event.target.value, data);
        onPaletteChange(type, Object.fromEntries(edgeColorPalette));
        onCurrDataChange(group, event.target.value, type);
      }
    }
  }

  const handleGroup = event => {
    setGroup(event.target.value);
  }

  const getEachColors = (group, palette, data) => {
    const colorMap = new Map();
    if(group === "each"){
      const bins = Object.values(data).length;
      var scheme = range(bins).map(x => getScheme(palette)((x+1)/bins));
      scheme = scheme.map(x => rgbToHex(x));
      Object.keys(data).map((x,i) => {
        colorMap.set(x, scheme[i]);
      });
    }
    else {
      const colorPalette = [];
      const uniqueValues = Array.from(new Set(Object.values(data))).sort();
      const bins = uniqueValues.length;
      var scheme = range(bins).map(x => getScheme(palette)((x+1)/bins));
      scheme = scheme.map(x => rgbToHex(x));
      uniqueValues.map((x,i) => {
        colorPalette.push([x, scheme[i]]);
      });
      const idxArr = colorPalette.map(c => c[0]);
      Object.entries(data).map((x,i) => {
        let idx = idxArr.indexOf(x[1]);
        colorMap.set(x[0], colorPalette[idx][1]);
      });
    }

    return colorMap
  }

  // const handleSubmit = event => {
  //   if(palette === "default"){
  //     if(type === "node"){
  //       onPaletteChange(type, defaultColors);
  //     }
  //     else{
  //       onPaletteChange(type, defaultColors);
  //     }
  //   }
  //   else{
  //     if(type === "node"){
  //       const nodeColorPalette = getEachColors(group, palette, data);
  //       onPaletteChange(type, Object.fromEntries(nodeColorPalette))
  //       onCurrDataChange(group, palette, type);
  //     }
  //     else{
  //       const edgeColorPalette = getEachColors(group, palette, data);
  //       onPaletteChange(type, Object.fromEntries(edgeColorPalette));
  //       onCurrDataChange(group, palette, type);
  //     }
  //   }
  // }

  const getColorArray = (name) => {
    const colorScheme = getScheme(name);
    const k = [0.2, 0.4, 0.6, 0.8, 1];
    const result = k.map(x => colorScheme(x));
    return result
  }

  return <div style={{padding: "5px", width:"100%"}}>
    <div style={{fontFamily: "Arial", fontSize: "15px", paddingTop: "8px", paddingBottom: "8px"}}>{"Colors"}</div>

    {/*<FormControl classes={{root: classes.customSelect}}>*/}
        {/*  <InputLabel>Data</InputLabel>*/}
        {/*  <Select value={type} onChange={handleType}>*/}
        {/*    <MenuItem classes={{root: classes.menuItem}} value={"node"}>Nodes</MenuItem>*/}
        {/*    <MenuItem classes={{root: classes.menuItem}} value={"edge"}>Edges</MenuItem>*/}
        {/*  </Select>*/}
        {/*</FormControl>*/}

        <FormControl classes={{root: classes.customSelect}}>
          <InputLabel>Group by</InputLabel>
          <Select value={group} onChange={handleGroup}>
            <MenuItem value={"each"}>Each</MenuItem>
            <MenuItem value={"degree/size"}>{type === "node" ? "Degree" : "Size"}</MenuItem>
          </Select>
        </FormControl>

        <FormControl classes={{root: classes.colorItem}}>
          <InputLabel>Color palette</InputLabel>
          <Select value={palette} onChange={handlePalette}>
            <MenuItem value={"default"}>Default</MenuItem>
            {allPalettes.map(c => <MenuItem key={c} value={c}>
                <Colorscale onClick={() => {}}
                  colorscale={getColorArray(c)} maxWidth={80} label={c}
                />
              </MenuItem>)}
          </Select>
        </FormControl>

      {/*<div className="colorButtonCont">*/}
      {/*  <Button onClick={handleSubmit} type="button" variant="outlined" color="primary">Update</Button>*/}
      {/*  /!*<Button onClick={handleReset} type="button" variant="outlined" color="primary">Reset</Button>*!/*/}
      {/*</div>*/}
    </div>


}

export default ColorPalette
