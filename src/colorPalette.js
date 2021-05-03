import React from "react";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";
import { range } from "d3-array";
import {
  getScheme,
  rgbToHex,
  discretePalettes,
  contPalettes,
} from "./functions.js";
import { Colorscale } from "react-colorscales";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    // minWidth: 120,
    paddingLeft: "15px",
  },
  // selectEmpty: {
  //   marginTop: theme.spacing(2),
  // },
  customSelect: {
    // paddingLeft: "15px",
    paddingRight: "5px",
    "& .MuiSelect-root": {
      // width: 55,
    },
    "& .MuiSelect-selectMenu": {
      overflow: "visible",
    },
    "& .MuiFormLabel-root": {
      fontSize: "15px",
    },
  },
  colorItem: {
    "& .MuiSelect-root": {
      width: 230,
    },

    // "& .MuiSelect-selectMenu": {
    //   // whiteSpace: "normal",
    //   height: 'fit-content'
    //
    // },

    "& .MuiFormLabel-root": {
      fontSize: "15px",
    },
  },
  menuItem: {
    // "& .MuiMenuItem-root": {
    //   padding: "0px",
    paddingLeft: "2px",
    paddingRight: "2px",
    whiteSpace: "normal",
    // },
  },
}));

const ColorPalette = ({
  type,
  data,
  metadata,
  defaultColors,
  onPaletteChange,
  currGroup,
  currPalette,
  onCurrDataChange,
}) => {
  // console.log(metadata);

  const columns =
    metadata !== undefined
      ? Object.keys(Object.values(metadata)[0]).concat("Id")
      : ["Id", "Degree"];

  const classes = useStyles();
  const [group, setGroup] = React.useState(currGroup);

  const createDataObj = (data, metadata) => {
    const obj = {};
    if (metadata !== undefined) {
      if (group === "Id") {
        Object.keys(metadata).map((d) => {
          obj[d] = d;
        });
      } else {
        Object.entries(metadata).map((d) => {
          obj[d[0]] = d[1][group];
        });
      }
      return obj;
    } else {
      if (group === "Id") {
        Object.keys(data).map((d) => {
          obj[d] = d;
        });
        return obj;
      } else {
        return data;
      }
    }
  };
  const dataObj = createDataObj(data, metadata);
  const isDiscrete = (dataObj) => {
    const values = Object.values(dataObj);
    if (typeof values[0] === "number") {
      return new Set(values).size === values.size;
    } else {
      return true;
    }
  };
  const myPalette = isDiscrete(dataObj) ? discretePalettes : contPalettes;

  const [palette, setPalette] = React.useState(currPalette);
  // console.log(palette);
  const handlePalette = (event) => {
    setPalette(event.target.value);
    if (event.target.value === "default") {
      onPaletteChange(type, defaultColors);
    } else {
      if (type === "node") {
        const nodeColorPalette = assignColors(group, event.target.value);
        onPaletteChange(type, nodeColorPalette);
        onCurrDataChange(group, event.target.value, type);
      } else {
        const edgeColorPalette = assignColors(group, event.target.value);
        onPaletteChange(type, edgeColorPalette);
        onCurrDataChange(group, event.target.value, type);
      }
    }
  };

  const handleGroup = (event) => {
    setGroup(event.target.value);
    setPalette("default");
  };

  const assignColors = (group, palette) => {
    const schemeObj = {};
    const colorObj = {};
    const values = Object.values(dataObj);
    const unique = Array.from(new Set(values)).sort();

    const bins = unique.length;

    range(bins).map((x, i) => {
      schemeObj[unique[i]] = rgbToHex(getScheme(palette)((x + 1) / bins));
    });

    Object.entries(dataObj).map((d) => {
      colorObj[d[0]] = schemeObj[d[1]];
    });

    return colorObj;
  };

  // const getEachColors = (group, palette, data) => {
  //   // console.log(data);
  //   const colorMap = new Map();
  //   if (group === "each") {
  //     const bins = Object.values(data).length;
  //     console.log("bins", bins);
  //     var scheme = range(bins).map((x) => getScheme(palette)((x + 1) / bins));
  //     console.log("scheme", scheme);
  //     scheme = scheme.map((x) => rgbToHex(x));
  //     Object.keys(data).map((x, i) => {
  //       colorMap.set(x, scheme[i]);
  //     });
  //   } else {
  //     const colorPalette = [];
  //     const uniqueValues = Array.from(new Set(Object.values(data))).sort();
  //     const bins = uniqueValues.length;
  //     var scheme = range(bins).map((x) => getScheme(palette)((x + 1) / bins));
  //     scheme = scheme.map((x) => rgbToHex(x));
  //     uniqueValues.map((x, i) => {
  //       colorPalette.push([x, scheme[i]]);
  //     });
  //     const idxArr = colorPalette.map((c) => c[0]);
  //     Object.entries(data).map((x, i) => {
  //       let idx = idxArr.indexOf(x[1]);
  //       colorMap.set(x[0], colorPalette[idx][1]);
  //     });
  //   }
  //
  //   return colorMap;
  // };

  const getColorArray = (name) => {
    const colorScheme = getScheme(name);
    const k = [0.2, 0.4, 0.6, 0.8, 1];
    const result = k.map((x) => colorScheme(x));
    return result;
  };

  return (
    <div style={{ padding: "5px", width: "100%" }}>
      <div
        style={{
          fontFamily: "Arial",
          fontSize: "15px",
          paddingTop: "8px",
          paddingBottom: "8px",
        }}
      >
        {"Colors"}
      </div>

      <FormControl classes={{ root: classes.customSelect }}>
        <InputLabel>Group by</InputLabel>
        <Select value={group} onChange={handleGroup}>
          {/*{metadata !== undefined && (*/}
          {/*<MenuItem value={"each"}>Each</MenuItem>*/}
          {/*<MenuItem value={"Degree"}>*/}
          {/*  {type === "node" ? "Degree" : "Size"}*/}
          {/*</MenuItem>*/}
          {/*)}*/}
          {columns.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl classes={{ root: classes.colorItem }}>
        <InputLabel>Color palette</InputLabel>
        <Select value={palette} onChange={handlePalette}>
          <MenuItem classes={{ root: classes.menuItem }} value={"default"}>
            Default
          </MenuItem>
          {myPalette.map((c) => (
            <MenuItem key={c} classes={{ root: classes.menuItem }} value={c}>
              <Colorscale
                onClick={() => {}}
                colorscale={getColorArray(c)}
                label={c}
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/*<div className="colorButtonCont">*/}
      {/*  <Button onClick={handleSubmit} type="button" variant="outlined" color="primary">Update</Button>*/}
      {/*  /!*<Button onClick={handleReset} type="button" variant="outlined" color="primary">Reset</Button>*!/*/}
      {/*</div>*/}
    </div>
  );
};

export default ColorPalette;
