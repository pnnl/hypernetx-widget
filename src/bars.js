import React from 'react';
import { max, range} from 'd3-array';
import { VictoryBar, VictoryChart, VictoryAxis, VictorySelectionContainer } from "victory";
import {Button} from "@material-ui/core";

const Bars = ({ type, freqData, onValueChange }) => {
    const [filterVal, setFilterVal] = React.useState([]);


  const maxVal = max(freqData.map(d => d.x));
  const handleBrush = points => {
      // console.log(points);
      onValueChange(points.data.map(d => d.x), type);
      setFilterVal(points.data.map(d => d.x));
  }

  const handleSelect = (barData, clickedState) => {
      if(clickedState){
          setFilterVal([...filterVal].filter(x => x !== barData));
          onValueChange([...filterVal].filter(x => x !== barData), type);
      }
      else{
          onValueChange([...filterVal, barData], type);
          setFilterVal([...filterVal, barData]);
      }
  }

  const handleClearSelect = () => {
      onValueChange([], type);
      setFilterVal([]);
  }

  return <div>
    <div style={{fontFamily: "Arial", fontSize: "13px", paddingLeft: "15px", paddingTop: "8px"}}>{type === "node" ? "Node degree distribution" : "Edge Size Distribution"}</div>
    <div style={{display: "flex", justifyContent: 'flex-end',}}>
      <Button style={{textTransform: 'none', fontSize: "11px", minWidth: '40px', maxWidth: "50px", minHeight: '15px', maxHeight: "25px"}} variant={"outlined"} size={"small"} onClick={handleClearSelect}>Clear</Button>
    </div>
    <div style={{ height: "125px",  width:"100%", }}>
      <VictoryChart
        domainPadding={17} minDomain={{x : 0}} height={135}
        padding={{left: 55, bottom: 20, right: 25, top: 5 }}
        containerComponent={
            <VictorySelectionContainer
            selectionDimension="x"
            onSelection={(points) => handleBrush(points[0])}
            onSelectionCleared={handleClearSelect}
          />
        }
      >

        <VictoryBar
          data={freqData} x="x" y="y"
          style={{ data: { fill: ({active, datum}) => {
              if(filterVal.includes(datum.x)){
                  return "#42a5f5"
              }
              else{
                  return "grey"
              }
                  }}}}
          events={[
              {
                  target: "data",
                  eventHandlers: {
                      onMouseDown: e => e.stopPropagation(),
                      onClick: () => {
                          return [{
                              target: "data",
                              mutation: props => {
                                  const clicked = filterVal.includes(props.datum.x);
                                  handleSelect(props.datum.x, clicked);
                              }
                          }]
                      }
                  }
              }
          ]}
        />
        <VictoryAxis tickValues={range(maxVal+1)} label={type === "node" ? "Degree" : "Size"} style={{axisLabel: {fontSize: "14px"}}}/>
        <VictoryAxis dependentAxis label="Count" style={{axisLabel: {padding: 35, fontSize: "14px"}}}/>
      </VictoryChart>
    </div>
  </div>
}

export default Bars
