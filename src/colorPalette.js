import React from "react";
import {
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import ColorScale from "./colorScale";
import { makeStyles } from "@material-ui/core/styles";
import { range } from "d3-array";
import {
  getScheme,
  rgbToHex,
  contPalettes,
  getCategoricalScheme,
  categoricalPalettes,
} from "./functions.js";
import { ChromePicker } from "react-color";
import { Palette, PaletteOutlined } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    paddingLeft: "15px",
  },
  customSelect: {
    paddingRight: "5px",
    "& .MuiSelect-root": {
      minWidth: 50,
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
      width: 100,
      maxHeight: "16px",
      minHeight: "16px",
    },
    "& .MuiSelect-select": {
      paddingTop: "2px",
    },
    "& .MuiFormLabel-root": {
      width: 200,
      fontSize: "15px",
    },
  },
  menuItem: {
    paddingTop: "3px",
    paddingBottom: "3px",
    paddingLeft: "2px",
    paddingRight: "2px",
    whiteSpace: "normal",
  },
}));

const ColorPalette = ({
  type,
  data,
  metadata,
  defaultColors,
  currColors,
  onPaletteChange,
  currGroup,
  currPalette,
  onCurrDataChange,
  onAllColorChange,
  // colors,
}) => {
  const colorsAreSame = new Set(Object.values(currColors)).size === 1;

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
  const myPalette = isDiscrete(dataObj) ? categoricalPalettes : contPalettes;
  const [palette, setPalette] = React.useState(currPalette);
  // console.log(palette);

  const [allPaletteOpen, setAllPaletteOpen] = React.useState(false);

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

  const handleClick = () => {
    setAllPaletteOpen(!allPaletteOpen);
  };

  const handleClose = () => {
    setAllPaletteOpen(false);
  };
  const [paletteColor, setPaletteColor] = React.useState(
    colorsAreSame ? Object.values(currColors)[0] : "#000000ff"
  );

  const handleGroup = (event) => {
    setGroup(event.target.value);
    setPalette("default");
  };

  const assignColors = (group, palette) => {
    const schemeObj = {};
    var colorObj = {};
    const values = Object.values(dataObj);
    const unique = Array.from(new Set(values)).sort();

    const bins = unique.length;
    if (!isDiscrete(dataObj)) {
      range(bins).map((x, i) => {
        schemeObj[unique[i]] = rgbToHex(getScheme(palette)((x + 1) / bins));
      });

      Object.entries(dataObj).map((d) => {
        colorObj[d[0]] = schemeObj[d[1]];
      });
    } else {
      const modifiedScheme = [];
      range(bins).map((x, i) => {
        let idx = x % getCategoricalScheme(palette).length;
        modifiedScheme.push(getCategoricalScheme(palette)[idx]);
      });

      if (getCategoricalScheme(palette).length > bins) {
        Object.entries(dataObj).map((d, i) => {
          let idx = unique.indexOf(d[1]);
          colorObj[d[0]] = modifiedScheme[idx];
        });
      } else {
        Object.entries(dataObj).map((d, i) => {
          colorObj[d[0]] = modifiedScheme[i];
        });
      }
    }
    return colorObj;
  };

  const getColorArray = (name) => {
    if (isDiscrete(dataObj)) {
      return getCategoricalScheme(name);
    } else {
      const colorScheme = getScheme(name);
      const k = [0.2, 0.4, 0.6, 0.8, 1];
      const result = k.map((x) => colorScheme(x));
      return result;
    }
  };

  const handleChangeColor = (color) => {
    const RGB = color.rgb;
    const rgbaStr =
      "rgba(" + RGB.r + ", " + RGB.g + ", " + RGB.b + ", " + RGB.a + ")";
    setPaletteColor(rgbToHex(rgbaStr));
    onAllColorChange(rgbToHex(rgbaStr), type);
  };

  return (
    <div style={{ padding: "5px", width: "100%", display: "flex" }}>
      <div
        style={{
          fontFamily: "Arial",
          fontSize: "15px",
          paddingTop: "8px",
          paddingBottom: "8px",
          display: "inline-block",
        }}
      >
        {"Colors"}
      </div>
      <div style={{ display: "inline-block" }}>
        <Tooltip
          title={
            <div style={{ fontSize: "14px", padding: "3px" }}>
              {"Change colors of all " + type + "s"}
            </div>
          }
        >
          <IconButton style={{ padding: "2px" }} onClick={handleClick}>
            {colorsAreSame ? (
              <Palette style={{ fill: paletteColor, fontSize: "x-large" }} />
            ) : (
              <PaletteOutlined
                style={{ color: "black", fontSize: "x-large" }}
              />
            )}
          </IconButton>
        </Tooltip>
      </div>

      {allPaletteOpen ? (
        <div className="popover-allColors">
          <div className={"cover"} onClick={handleClose} />
          <ChromePicker
            color={paletteColor}
            onChange={(c) => handleChangeColor(c)}
          />
        </div>
      ) : null}
      <div>
        <FormControl classes={{ root: classes.customSelect }}>
          <InputLabel>Color by</InputLabel>
          <Select value={group} onChange={handleGroup}>
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
              <span>Default</span>
            </MenuItem>
            {myPalette.map((c) => (
              <MenuItem key={c} classes={{ root: classes.menuItem }} value={c}>
                <ColorScale name={c} colorArray={getColorArray(c)} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

export default ColorPalette;
