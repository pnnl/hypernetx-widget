import * as scale from "d3-scale-chromatic";
import { makeStyles } from "@material-ui/core/styles";

export const numberRange = (start, end) => {
  return new Array(end - start).fill().map((d, i) => i + start);
};
export const descendingComparator = (a, b, orderBy) => {
  a[orderBy] = a[orderBy] || false;
  b[orderBy] = b[orderBy] || false;

  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

export const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

export const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

export const rgbToHex = (rgbString) => {
  var a,
    rgb = rgbString
      .replace(/\s/g, "")
      .match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
    alpha = ((rgb && rgb[4]) || "").trim(),
    hex = rgb
      ? (rgb[1] | (1 << 8)).toString(16).slice(1) +
        (rgb[2] | (1 << 8)).toString(16).slice(1) +
        (rgb[3] | (1 << 8)).toString(16).slice(1)
      : rgbString;
  if (alpha !== "") {
    a = alpha;
  } else {
    a = 0o1;
  }

  a = ((a * 255) | (1 << 8)).toString(16).slice(1);
  hex = hex + a;

  return "#" + hex;
};

export const hslToHex = (h, s, l) => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

export const getRGB = (strRGB) => {
  let split = strRGB.split(/[()]+/).filter(function (e) {
    return e;
  });
  let rgbVal = split[1].split(", ");
  return rgbVal;
};

export const getNodeDegree = (nodeData, edgeData, uid) => {
  var degree = 0;

  edgeData.map((e) =>
    e.elements.map((v) => {
      if (v === uid) {
        degree += 1;
      }
    })
  );
  return degree;
};

export const getEdgeSize = (nodeData, edgeData, edgeIdx) => {
  const nodeElems = edgeData[edgeIdx].elements;
  return nodeElems.length;
};

export const getValueFreq = (obj) => {
  let results = [];
  const valueMap = new Map();
  Object.values(obj).map((x) => {
    if (!valueMap.has(x)) {
      valueMap.set(x, 1);
    } else {
      let currCt = valueMap.get(x);
      valueMap.set(x, currCt + 1);
    }
  });
  Array.from(valueMap).map((x) => {
    results.push({ x: x[0], y: x[1] });
  });
  return results.sort((a, b) => a.x - b.x);
};

export const showButtonStyles = makeStyles((theme) => ({
  customButton: {
    // width: '100%',
    "& .MuiToggleButton-root": {
      color: "#5c6bc0",
      border: "1px solid #5c6bc0",
    },
    "& .Mui-selected": {
      backgroundColor: "#ECECEC",
    },
  },
}));

export const accordianStyles = makeStyles((theme) => ({
  root: {
    width: "100%",

    // '& .Mui-expanded':{
    //   padding: 0
    // },
    "& .MuiAccordionDetails-root": {
      padding: 0,
    },
    "& .MuiAccordianSummary-root.Mui-expanded": {
      minHeight: "30px",
    },
  },
}));

export const allPalettes = [
  "Blues",
  "Greens",
  "Greys",
  "Oranges",
  "Purples",
  "Reds",
  "Bu-Gn",
  "Bu-Pu",
  "Gn-Bu",
  "Or-Rd",
  "Pu-Bu-Gn",
  "Pu-Bu",
  "Pu-Rd",
  "Rd-Pu",
  "Yl-Gn-Bu",
  "Yl-Gn",
  "Yl-Or-Bn",
  "Yl-Or-Rd",
  "Bn-BuGn",
  "PuRd-Gn",
  "Pink-YlGn",
  "Pu-Or",
  "Rd-Bu",
  "Rd-Grey",
  "Rd-Yl-Bu",
  "Spectral",
  "Turbo",
  "Viridis",
  "Inferno",
  "Plasma",
  "Cividis",
  "Warm",
  "Cool",
  "Rainbow",
  "Sinebow",
];

export const discretePalettes = [
  "Bn-BuGn",
  "PuRd-Gn",
  "Pink-YlGn",
  "Pu-Or",
  "Rd-Bu",
  "Rd-Grey",
  "Rd-Yl-Bu",
  "Spectral",
  "Turbo",
  "Viridis",
  "Inferno",
  "Plasma",
  "Cividis",
  "Warm",
  "Cool",
  "Rainbow",
  "Sinebow",
];

export const contPalettes = [
  "Blues",
  "Greens",
  "Greys",
  "Oranges",
  "Purples",
  "Reds",
  "Bu-Gn",
  "Bu-Pu",
  "Gn-Bu",
  "Or-Rd",
  "Pu-Bu-Gn",
  "Pu-Bu",
  "Pu-Rd",
  "Rd-Pu",
  "Yl-Gn-Bu",
  "Yl-Gn",
  "Yl-Or-Bn",
  "Yl-Or-Rd",
];

export const categoricalPalettes = [
  "Accent8",
  "Dark8",
  "Set8",
  "Pastel8",
  "Set9",
  "Pastel9",
  "Category10",
  "Tableau10",
  "Paired12",
  "Set12",
];
export const getCategoricalScheme = (color) => {
  if (color === "Accent8") {
    return scale.schemeAccent;
  } else if (color === "Dark8") {
    return scale.schemeDark2;
  } else if (color === "Set8") {
    return scale.schemeSet2;
  } else if (color === "Pastel8") {
    return scale.schemePastel2;
  } else if (color === "Set9") {
    return scale.schemeSet1;
  } else if (color === "Pastel9") {
    return scale.schemePastel1;
  } else if (color === "Category10") {
    return scale.schemeCategory10;
  } else if (color === "Tableau10") {
    return scale.schemeTableau10;
  } else if (color === "Paired12") {
    return scale.schemePaired;
  } else if (color === "Set12") {
    return scale.schemeSet3;
  }
};
export const getScheme = (color) => {
  if (color === "Blues") {
    return scale.interpolateBlues;
  } else if (color === "Greens") {
    return scale.interpolateGreens;
  } else if (color === "Greys") {
    return scale.interpolateGreys;
  } else if (color === "Oranges") {
    return scale.interpolateOranges;
  } else if (color === "Purples") {
    return scale.interpolatePurples;
  } else if (color === "Reds") {
    return scale.interpolateReds;
  } else if (color === "Bu-Gn") {
    return scale.interpolateBuGn;
  } else if (color === "Bu-Pu") {
    return scale.interpolateBuPu;
  } else if (color === "Gn-Bu") {
    return scale.interpolateGnBu;
  } else if (color === "Or-Rd") {
    return scale.interpolateOrRd;
  } else if (color === "Pu-Bu-Gn") {
    return scale.interpolatePuBuGn;
  } else if (color === "Pu-Bu") {
    return scale.interpolatePuBu;
  } else if (color === "Pu-Rd") {
    return scale.interpolatePuRd;
  } else if (color === "Rd-Pu") {
    return scale.interpolateRdPu;
  } else if (color === "Yl-Gn-Bu") {
    return scale.interpolateYlGnBu;
  } else if (color === "Yl-Gn") {
    return scale.interpolateYlGn;
  } else if (color === "Yl-Or-Bn") {
    return scale.interpolateYlOrBr;
  } else if (color === "Yl-Or-Rd") {
    return scale.interpolateYlOrRd;
  } else if (color === "Bn-BuGn") {
    return scale.interpolateBrBG;
  } else if (color === "PuRd-Gn") {
    return scale.interpolatePRGn;
  } else if (color === "Pink-YlGn") {
    return scale.interpolatePiYG;
  } else if (color === "Pu-Or") {
    return scale.interpolatePuOr;
  } else if (color === "Rd-Bu") {
    return scale.interpolateRdBu;
  } else if (color === "Rd-Grey") {
    return scale.interpolateRdGy;
  } else if (color === "Rd-Yl-Bu") {
    return scale.interpolateRdYlBu;
  } else if (color === "Spectral") {
    return scale.interpolateSpectral;
  } else if (color === "Turbo") {
    return scale.interpolateTurbo;
  } else if (color === "Viridis") {
    return scale.interpolateViridis;
  } else if (color === "Inferno") {
    return scale.interpolateInferno;
  } else if (color === "Plasma") {
    return scale.interpolatePlasma;
  } else if (color === "Cividis") {
    return scale.interpolateCividis;
  } else if (color === "Warm") {
    return scale.interpolateWarm;
  } else if (color === "Cool") {
    return scale.interpolateCool;
  } else if (color === "Cubehelix") {
    return scale.interpolateCubehelixDefault;
  } else if (color === "Rainbow") {
    return scale.interpolateRainbow;
  } else if (color === "Sinebow") {
    return scale.interpolateSinebow;
  }
};
