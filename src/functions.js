import * as scale from 'd3-scale-chromatic';
import { makeStyles } from '@material-ui/core/styles';

export const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}


export const hexToRgb = hex => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  const a = 0.9;
  return result ? `rgba(${r}, ${g}, ${b}, ${a})`: null;
}

export const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export const getRGB = (strRGB) => {
  let split = strRGB.split(/[()]+/).filter(function(e) { return e; });
  let rgbVal = split[1].split(", ");
  return rgbVal
}

export const getNodeDegree = (nodeData, edgeData, uid) => {
  const degrees = Array.from({length: nodeData.length}, (x, i) => 0);
  edgeData.map(e => e.elements.map(v => {
      degrees[v] += 1;
    })
  )
  const nodeBySuperIdx = nodeData.map((n,i) => [i, n.elements.map(x => x.uid)]);
  var deg = null;
  nodeBySuperIdx.map((x,i) => {
    if(x[1].includes(uid)){
       deg = degrees[i];
    }
  })
  return deg
}

export const getEdgeSize = (nodeData, edgeData, edgeIdx) => {
  const nodeElems = edgeData[edgeIdx].elements;
  var edgeSize = 0
  nodeElems.map(x => {
    edgeSize += nodeData[x].elements.length;
  })
  return edgeSize
}

export const getValueFreq = (obj) => {
  let results = []
  const valueMap = new Map();
  Object.values(obj).map(x => {
    if(!valueMap.has(x)){
      valueMap.set(x, 1);
    }
    else{
      let currCt = valueMap.get(x);
      valueMap.set(x, currCt+1);
    }
  })
  Array.from(valueMap).map(x => {
    results.push({x:x[0], y:x[1]})
  })
  return results
}

export const showButtonStyles = makeStyles((theme) => ({
  customButton: {
    // width: '100%',
    "& .MuiToggleButton-root": {
      color: "#5c6bc0",
      border: "1px solid #5c6bc0",

    },
    "& .Mui-selected":{
      backgroundColor: "#ECECEC"
    }
  }
}))

export const accordianStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    "& .MuiAccordionDetails-root": {
      padding: "3px 3px 3px 3px"
    },
    "& .MuiAccordianSummary-root.Mui-expanded": {
      minHeight: "30px",
    }
  },
  

}));

export const allPalettes = ["Blues", "Greens", "Greys", "Oranges", "Purples", "Reds", "Bu-Gn", "Bu-Pu", "Gn-Bu",
"Or-Rd", "Pu-Bu-Gn", "Pu-Bu", "Pu-Rd", "Rd-Pu", "Yl-Gn-Bu", "Yl-Gn", "Yl-Or-Bn", "Yl-Or-Rd",
"Bn-BuGn", "PuRd-Gn", "Pink-YlGn", "Pu-Or", "Rd-Bu", "Rd-Grey", "Rd-Yl-Bu", "Spectral",
"Turbo", "Viridis", "Inferno", "Plasma", "Cividis", "Warm", "Cool", "Rainbow", "Sinebow"];

export const getScheme = color => {
  if(color === "Blues"){
    return scale.interpolateBlues
  }
  else if(color === "Greens"){
    return scale.interpolateGreens
  }
  else if(color === "Greys"){
    return scale.interpolateGreys
  }
  else if(color === "Oranges"){
    return scale.interpolateOranges
  }
  else if(color === "Purples"){
    return scale.interpolatePurples
  }
  else if(color === "Reds"){
    return scale.interpolateReds
  }
  else if(color === "Bu-Gn"){
    return scale.interpolateBuGn
  }
  else if(color === "Bu-Pu"){
    return scale.interpolateBuPu
  }
  else if(color === "Gn-Bu"){
    return scale.interpolateGnBu
  }
  else if(color === "Or-Rd"){
    return scale.interpolateOrRd
  }
  else if(color === "Pu-Bu-Gn"){
    return scale.interpolatePuBuGn
  }
  else if(color === "Pu-Bu"){
    return scale.interpolatePuBu
  }
  else if(color === "Pu-Rd"){
    return scale.interpolatePuRd
  }
  else if(color === "Rd-Pu"){
    return scale.interpolateRdPu
  }
  else if(color === "Yl-Gn-Bu"){
    return scale.interpolateYlGnBu
  }
  else if(color === "Yl-Gn"){
    return scale.interpolateYlGn
  }
  else if(color === "Yl-Or-Bn"){
    return scale.interpolateYlOrBr
  }
  else if(color === "Yl-Or-Rd"){
    return scale.interpolateYlOrRd
  }
  else if(color === "Bn-BuGn"){
    return scale.interpolateBrBG
  }
  else if(color === "PuRd-Gn"){
    return scale.interpolatePRGn
  }
  else if(color === "Pink-YlGn"){
    return scale.interpolatePiYG
  }
  else if(color === "Pu-Or"){
    return scale.interpolatePuOr
  }
  else if(color === "Rd-Bu"){
    return scale.interpolateRdBu
  }
  else if(color === "Rd-Grey"){
    return scale.interpolateRdGy
  }
  else if(color === "Rd-Yl-Bu"){
    return scale.interpolateRdYlBu
  }
  else if(color === "Spectral"){
    return scale.interpolateSpectral
  }
  else if(color === "Turbo"){
    return scale.interpolateTurbo
  }
  else if(color === "Viridis"){
    return scale.interpolateViridis
  }
  else if(color === "Inferno"){
    return scale.interpolateInferno
  }
  else if(color === "Plasma"){
    return scale.interpolatePlasma
  }
  else if(color === "Cividis"){
    return scale.interpolateCividis
  }
  else if(color === "Warm"){
    return scale.interpolateWarm
  }
  else if(color === "Cool"){
    return scale.interpolateCool
  }
  else if(color === "Cubehelix"){
    return scale.interpolateCubehelixDefault
  }
  else if(color === "Rainbow"){
    return scale.interpolateRainbow
  }
  else if(color === "Sinebow"){
    return scale.interpolateSinebow
  }
}
