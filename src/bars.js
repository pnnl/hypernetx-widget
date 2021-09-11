import React from "react";
import { max, range, min } from "d3-array";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictorySelectionContainer,
} from "victory";
import { Button } from "@material-ui/core";
import { scaleLinear } from "d3-scale";
import { VictoryTheme } from "victory-core";

const Bars = ({ type, origMax, freqData, onValueChange }) => {
  const [filterVal, setFilterVal] = React.useState([]);
  const maxX = max(freqData.map((d) => d.x));
  const minX = min(freqData.map((d) => d.x));
  const maxY = max(freqData.map((d) => d.y));

  const newScale = scaleLinear()
    .domain([0, maxX])
    .nice()
    .ticks()
    .filter((x) => x === Math.ceil(x));

  const handleBrush = (points) => {
    let elements = points.data.map((d) => d.x);
    onValueChange(elements, type);
    setFilterVal(elements);
  };

  const handleSelect = (elem) => {
    const clickedState = filterVal.includes(elem);

    if (clickedState) {
      setFilterVal([...filterVal].filter((x) => x !== elem));
      onValueChange(
        [...filterVal].filter((x) => x !== elem),
        type
      );
    } else {
      setFilterVal([...filterVal, elem]);
      onValueChange([...filterVal, elem], type);
    }
  };

  const handleClearSelect = () => {
    onValueChange([], type);
    setFilterVal([]);
  };
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div
          style={{
            fontFamily: "Arial",
            fontSize: "15px",
            paddingLeft: "5px",
            paddingTop: "8px",
          }}
        >
          {type === "node"
            ? "Node degree distribution"
            : "Edge Size Distribution"}
        </div>
        <Button
          style={{
            textTransform: "none",
            fontSize: "11px",
            minWidth: "40px",
            maxWidth: "50px",
            minHeight: "15px",
            maxHeight: "25px",
          }}
          variant={"outlined"}
          size={"small"}
          onClick={handleClearSelect}
        >
          Clear
        </Button>
      </div>
      <div
        style={{
          height: "140px",
          width: "100%",
          paddingLeft: minX === 0 ? "5px" : "0px",
        }}
      >
        <VictoryChart
          theme={VictoryTheme.material}
          domain={{ x: [0, maxX], y: [0, origMax] }}
          // domainPadding={{ x: [20, 10] }}
          // minDomain={{ x: 0 }}
          height={120}
          padding={{ left: 55, bottom: 25, right: 25, top: 5 }}
          containerComponent={
            <VictorySelectionContainer
              selectionDimension="x"
              onSelection={(points) => handleBrush(points[0])}
              onSelectionCleared={handleClearSelect}
            />
          }
        >
          <VictoryBar
            data={freqData}
            x="x"
            y="y"
            barRatio={0.5}
            style={{
              data: {
                fill: ({ active, datum }) => {
                  if (filterVal.flat().includes(datum.x)) {
                    return "#42a5f5";
                  } else {
                    return "grey";
                  }
                },
                stroke: "white",
                strokeWidth: 1,
              },
            }}
            events={[
              {
                target: "data",
                eventHandlers: {
                  onMouseDown: (e) => e.stopPropagation(),
                  onClick: () => {
                    return [
                      {
                        target: "data",
                        mutation: (props) => {
                          handleSelect(props.datum.x);
                        },
                      },
                    ];
                  },
                },
              },
            ]}
          />
          <VictoryAxis
            // tickValues={range(maxVal + 1)}

            tickValues={newScale}
            label={type === "node" ? "Degree" : "Size"}
            style={{
              axisLabel: { fontSize: "12px", padding: 25 },
              grid: { stroke: "none" },
            }}
          />
          <VictoryAxis
            offsetX={minX === 0 ? 47 : 55}
            // standalone={false}
            dependentAxis
            // tickCount={3}
            label="Count"
            style={{
              axisLabel: { padding: 35, fontSize: "12px" },
              grid: { stroke: "none" },
            }}
          />
        </VictoryChart>
      </div>
    </div>
  );
};

export default Bars;
