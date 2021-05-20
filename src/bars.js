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

const Bars = ({ type, freqData, onValueChange }) => {
  const [filterVal, setFilterVal] = React.useState([]);
  const maxVal = max(freqData.map((d) => d.x));

  let myScale = scaleLinear();
  myScale.domain([0, 5]).rangeRound([0, maxVal]).nice();

  const ticks =
    maxVal < 11 ? range(maxVal + 1) : range(5).map((x) => myScale(x));

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
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
      <div style={{ height: "125px", width: "100%" }}>
        <VictoryChart
          domainPadding={17}
          minDomain={{ x: 0 }}
          height={135}
          padding={{ left: 55, bottom: 20, right: 25, top: 5 }}
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
            style={{
              data: {
                fill: ({ active, datum }) => {
                  if (filterVal.flat().includes(datum.x)) {
                    return "#42a5f5";
                  } else {
                    return "grey";
                  }
                },
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
            tickValues={ticks}
            label={type === "node" ? "Degree" : "Size"}
            style={{ axisLabel: { fontSize: "14px" } }}
          />
          <VictoryAxis
            dependentAxis
            label="Count"
            style={{ axisLabel: { padding: 35, fontSize: "14px" } }}
          />
        </VictoryChart>
      </div>
    </div>
  );
};

export default Bars;
