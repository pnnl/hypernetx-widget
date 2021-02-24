import React from 'react';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
// import FormHelperText from '@material-ui/core/FormHelperText';
// import FormLabel from '@material-ui/core/FormLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles, createMuiTheme, createStyles } from '@material-ui/core/styles';
import {range} from 'd3-array';
import { getScheme, hexToRgb, allPalettes } from './functions.js';
import {Colorscale} from 'react-colorscales';
import * as scale from 'd3-scale-chromatic';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  customSelect: {
    // paddingLeft: "5px",
    paddingRight:"5px",
    "& .MuiSelect-root": {
      // fontSize: "15px",
      width: 100,

    },
  },
  menuItem: {
      // fontSize: "14px",
  },
  colorItem: {
    "& .MuiSelect-root": {
      // fontSize: "15px",
      width: 270
    },
  }
}));



const ColorPalette = ({nodeData, edgeData, sendNodePalette, sendEdgePalette, currGroup, currPalette, currType, sendCurrData}) => {

  const classes = useStyles();

  const [group, setGroup] = React.useState(currGroup);
  const [palette, setPalette] = React.useState(currPalette);
  const [type, setType] = React.useState(currType);

  const handlePalette = event => {
    setPalette(event.target.value);
  }

  const handleGroup = event => {
    setGroup(event.target.value);
  }

  const handleType = event => {
    setType(event.target.value);
  }



  const getEachColors = (group, palette, data) => {
    const colorMap = new Map();
    if(group === "each"){
      const bins = Object.values(data).length;
      var scheme = range(bins).map(x => getScheme(palette)((x+1)/bins));
      if(scheme.every(x => x.startsWith("#"))){
        scheme = scheme.map(x => hexToRgb(x));
      }
      else{
        scheme = scheme.map(x => x.replace('rgb', 'rgba').replace(')', ', 0.9)'));
      }
      Object.keys(data).map((x,i) => {
        colorMap.set(x, scheme[i]);
      });
    }
    else {
      const colorPalette = [];
      const uniqueValues = Array.from(new Set(Object.values(data))).sort();
      const bins = uniqueValues.length;
      var scheme = range(bins).map(x => getScheme(palette)((x+1)/bins));
      if(scheme.every(x => x.startsWith("#"))){
        scheme = scheme.map(x => hexToRgb(x));
      }
      else{
        scheme = scheme.map(x => x.replace('rgb', 'rgba').replace(')', ', 0.9)'));
      }

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


  const handleSubmit = event => {
    if(palette !== "black"){
      if(type === "node"){
        const nodeColorPalette = getEachColors(group, palette, nodeData);
        sendNodePalette(Object.fromEntries(nodeColorPalette));
        sendCurrData(group, palette, type);
      }
      else{
        const edgeColorPalette = getEachColors(group, palette, edgeData);
        sendEdgePalette(Object.fromEntries(edgeColorPalette));
        sendCurrData(group, palette, type);
      }
    }
  }

  const handleReset = event => {
    setPalette("black");
    const defaultMap = new Map();
    if(type === "node"){
      Object.keys(nodeData).map(x => defaultMap.set(x, "rgba(0, 0, 0, 1)"));
      sendNodePalette(Object.fromEntries(defaultMap));
    }
    else{
      Object.keys(edgeData).map(x => defaultMap.set(x, "rgba(0, 0, 0, 1)"));
      sendEdgePalette(Object.fromEntries(defaultMap));
    }
  }
  const viridisColorscale = ['#fafa6e', '#9cdf7c', '#4abd8c', '#00968e', '#106e7c', '#2a4858'];
  const getColorArray = (name) => {
    const colorScheme = getScheme(name);
    const k = [0.2, 0.4, 0.6, 0.8, 1]
    const result = k.map(x => colorScheme(x));
    return result
  }

  // getColorArray("Blues");
  return <div style={{padding: "5px", width:"100%"}}>
        <FormControl classes={{root: classes.customSelect}}>
          <InputLabel>Data</InputLabel>
          <Select value={type} onChange={handleType}>
            <MenuItem classes={{root: classes.menuItem}} value={"node"}>Nodes</MenuItem>
            <MenuItem classes={{root: classes.menuItem}} value={"edge"}>Edges</MenuItem>
          </Select>
        </FormControl>

        <FormControl classes={{root: classes.customSelect}}>
          <InputLabel>Group</InputLabel>
          <Select value={group} onChange={handleGroup}>
            <MenuItem classes={{root: classes.menuItem}} value={"each"}>Each</MenuItem>
            <MenuItem classes={{root: classes.menuItem}} value={"degree/size"}>{type === "node" ? "Degree" : "Size"}</MenuItem>
          </Select>
        </FormControl>

        <FormControl classes={{root: classes.colorItem}}>
          <InputLabel>Color palette</InputLabel>
          <Select
            value={palette}
            onChange={handlePalette}
          >
            <MenuItem classes={{root: classes.menuItem}} value={"black"} disabled>Black (default)</MenuItem>
            {allPalettes.map(c => <MenuItem classes={{root: classes.menuItem}} key={c} value={c}>
                <Colorscale onClick={() => {}}
                  colorscale={getColorArray(c)} maxWidth={80} label={c}
                />

              </MenuItem>)}
          </Select>
        </FormControl>

      <div className="colorButtonCont">
        <Button onClick={handleSubmit} type="button" variant="outlined" color="primary">Update</Button>
        <Button onClick={handleReset} type="button" variant="outlined" color="primary">Reset</Button>
      </div>
    </div>


}

export default ColorPalette
