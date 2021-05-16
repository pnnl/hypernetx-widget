import React from "react";
import { max, range, bin, min, filter } from "d3-array";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryHistogram,
  VictorySelectionContainer,
} from "victory";
import { Button } from "@material-ui/core";
import { numberRange } from "./functions";
// import * as d3 from "d3";

const Bars = ({ type, freqData, onValueChange }) => {
  // console.log(freqData);
  const [filterVal, setFilterVal] = React.useState([]);
  const maxVal = max(freqData);
  const histData = freqData.map((d) => ({ x: d }));
  // console.log(histData);
  const handleBrush = (points) => {
    let elements = points.data.map((d) => [d.x0, d.x1]).flat();
    const [brushMin, brushMax] = [min(elements), max(elements)];
    const brushRange = numberRange(brushMin, brushMax);

    onValueChange(brushRange, type);
    setFilterVal(brushRange);
  };

  const handleSelect = (numRange) => {
    const clickedState = numRange.every((x) => filterVal.includes(x));
    if (clickedState) {
      setFilterVal([...filterVal].filter((x) => !numRange.includes(x)));
      onValueChange(
        [...filterVal].filter((x) => !numRange.includes(x)),
        type
      );
    } else {
      setFilterVal([...filterVal, ...numRange]);
      onValueChange([...filterVal, ...numRange], type);
    }
  };

  const handleClearSelect = () => {
    onValueChange([], type);
    setFilterVal([]);
  };

  const binData = (data) => {
    let xValues = data.map((d) => d.x);
    const [minVal, maxVal] = [min(xValues), max(xValues)];
    if (maxVal > 8) {
      const bin1 = bin()
        .value((d) => d.x)
        .domain([0, maxVal + 1])
        .thresholds(4);

      const binned = [];
      bin1(data).map((d) => {
        binned.push(d.x0, d.x1);
      });
      return Array.from(new Set(binned));
    } else {
      const bin2 = bin()
        .value((d) => d.x)
        .domain([0, maxVal + 1])
        .thresholds(maxVal);
      const binned2 = bin2(data);
      return binned2.map((d) => d.x1);
    }
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
          <VictoryHistogram
            data={histData}
            x="x"
            y="y"
            bins={binData(histData)}
            style={{
              data: {
                fill: ({ active, datum }) => {
                  if (filterVal.flat().includes(datum.x0)) {
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
                          const numRange = numberRange(
                            props.datum.x0,
                            props.datum.x1
                          );

                          handleSelect(numRange);
                        },
                      },
                    ];
                  },
                },
              },
            ]}
          />
          <VictoryAxis
            tickValues={range(maxVal + 2)}
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
