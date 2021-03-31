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
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  customSelect: {
    paddingRight:"5px",
    "& .MuiSelect-root": {
      width: 100,

    },
  },
  colorItem: {
    "& .MuiSelect-root": {
      width: 270
    },
  }
}));



const ColorPalette = ({type, data, defaultColors, onPaletteChange, currGroup, currPalette, onCurrDataChange}) => {

  const classes = useStyles();

  const [group, setGroup] = React.useState(currGroup);
  const [palette, setPalette] = React.useState(currPalette);
  // const [type, setType] = React.useState(currType);
  const [openSelect, setOpenSelect] = React.useState(false);
  const [paletteColor, setColor] = React.useState("#000000");
  const [paletteOpen, setPaletteOpen] = React.useState(false);

  const handlePalette = event => {
    setPalette(event.target.value);

  }
  const handleOpen = (event) => {
    setOpenSelect(true);
    if(paletteOpen){
      event.stopPropagation();
      event.preventDefault();
    }
  }

  const handleGroup = event => {
    setGroup(event.target.value);
  }

  // const handleType = event => {
  //   setType(event.target.value);
  // }


  const handleClick = (event) => {
    setPaletteOpen(!paletteOpen);
      // event.stopPropagation();
      // event.preventDefault();
  }
  const handleClose = (event) => {
    // console.log("HERE")
    // setOpenSelect(false);
    if(event !== undefined){
      if(event.currentTarget.getAttribute('data-value') === "user") {
        if(paletteColor !== "#000000"){
          setOpenSelect(false);
          setPaletteOpen(false);
        }
      }
      else{
        setOpenSelect(false);
      }
    }


  }
  const handleChangeColor = (color) => {
    // onEachColorChange(label, color.rgb);
    setColor(color.hex);
  }

  const getEachColors = (group, palette, data) => {

    const colorMap = new Map();
    if(group === "each"){
      const bins = Object.values(data).length;
      var scheme = range(bins).map(x => getScheme(palette)((x+1)/bins));
      scheme = scheme.map(x => rgbToHex(x));
      // if(scheme.every(x => x.startsWith("#"))){
      //   scheme = scheme.map(x => hexToRgb(x));
      // }
      // else{
      //   scheme = scheme.map(x => x.replace('rgb', 'rgba').replace(')', ', 0.9)'));
      // }
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
      // if(scheme.every(x => x.startsWith("#"))){
      //   scheme = scheme.map(x => hexToRgb(x));
      // }
      // else{
      //   scheme = scheme.map(x => x.replace('rgb', 'rgba').replace(')', ', 0.9)'));
      // }

      uniqueValues.map((x,i) => {
        colorPalette.push([x, scheme[i]]);
      });
      const idxArr = colorPalette.map(c => c[0]);
      Object.entries(data).map((x,i) => {
        let idx = idxArr.indexOf(x[1]);
        colorMap.set(x[0], colorPalette[idx][1]);
      });
    }
    // else{
    //   console.log(group, palette, data);
    // }
    return colorMap
  }

  const handleSubmit = event => {
    if(palette === "default"){
      // const defaultMap = new Map();
      if(type === "node"){
        // Object.keys(data).map(x => defaultMap.set(x, "rgba(105, 105, 105, 1)"));
        onPaletteChange(type, defaultColors);
        // console.log(defaultColors);
      }
      else{
        // Object.keys(data).map(x => defaultMap.set(x, "rgba(0, 0, 0, 1)"));
        onPaletteChange(type, defaultColors);
      }
    }
    else if(palette === "user"){
      const userMap = new Map();
      if(type === "node"){
        Object.keys(data).map(x => userMap.set(x, hexToRgb(paletteColor)));
        onPaletteChange(type, Object.fromEntries(userMap));
      }
    }
    else{

      if(type === "node"){
        const nodeColorPalette = getEachColors(group, palette, data);
        onPaletteChange(type, Object.fromEntries(nodeColorPalette))
        onCurrDataChange(group, palette, type);
      }
      else{
        const edgeColorPalette = getEachColors(group, palette, data);
        onPaletteChange(type, Object.fromEntries(edgeColorPalette));
        onCurrDataChange(group, palette, type);
      }
    }
  }

  const getColorArray = (name) => {
    const colorScheme = getScheme(name);
    const k = [0.2, 0.4, 0.6, 0.8, 1];
    const result = k.map(x => colorScheme(x));
    return result
  }



  // console.log(paletteOpen);
  return <div style={{padding: "5px", width:"100%"}}>
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
            <MenuItem classes={{root: classes.menuItem}} value={"each"}>Each</MenuItem>
            <MenuItem classes={{root: classes.menuItem}} value={"degree/size"}>{type === "node" ? "Degree" : "Size"}</MenuItem>
            {/*<MenuItem classes={{root: classes.menuItem}} value={"all"}>All</MenuItem>*/}
          </Select>
        </FormControl>

        <FormControl classes={{root: classes.colorItem}}>
          <InputLabel>Color palette</InputLabel>
          <Select
            value={palette}
            onChange={handlePalette}
            // open={openSelect}
            // onOpen={handleOpen}
            // onClose={handleClose}
          >

                <MenuItem classes={{root: classes.menuItem}} value={"default"}>Default</MenuItem>

            {/*  <MenuItem value={"user"}>*/}
            {/*    <IconButton style={{padding:'2px'}} onClick={handleClick}>*/}
            {/*      <Palette fontSize="small" style={{  fill:paletteColor}}/>*/}
            {/*    </IconButton>*/}
            {/*    {paletteColor === "#000000" ? "Choose" : paletteColor}*/}
            {/*    {paletteOpen ?*/}
            {/*      <div className="popover-menu">*/}
            {/*        <div className="cover" />*/}
            {/*        <ChromePicker color={paletteColor} onChange={(c) => handleChangeColor(c)}/>*/}
            {/*      </div> : null*/}
            {/*    }*/}

            {/*</MenuItem>*/}
            {allPalettes.map(c => <MenuItem classes={{root: classes.menuItem}} key={c} value={c}>
                <Colorscale onClick={() => {}}
                  colorscale={getColorArray(c)} maxWidth={80} label={c}
                />

              </MenuItem>)}
          </Select>
        </FormControl>

      <div className="colorButtonCont">
        <Button onClick={handleSubmit} type="button" variant="outlined" color="primary">Update</Button>
        {/*<Button onClick={handleReset} type="button" variant="outlined" color="primary">Reset</Button>*/}
      </div>
    </div>


}

export default ColorPalette
