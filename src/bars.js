import React from 'react';
import { max, range } from 'd3-array';
import { VictoryBar, VictoryChart, VictoryAxis, VictorySelectionContainer } from "victory";

const Bars = ({ type, freqData, onValueChange }) => {
  const maxVal = max(freqData.map(d => d.x));
  const handleBrush = points => {
      onValueChange(points.data.map(d => d.x), type);
  }

  const [selectedVal, setSelectedVal] = React.useState([]);
  const handleSelect = (barData, clickedState) => {
      if(clickedState){
            setSelectedVal([...selectedVal].filter(x => x !== barData));
            onValueChange([...selectedVal].filter(x => x !== barData), type);
      }
      else{
          setSelectedVal([...selectedVal, barData]);
          onValueChange([...selectedVal, barData], type);
      }
  }

  return (
    <div style={{ height: "150px",  width:"100%",}}>
      <VictoryChart
        domainPadding={17} minDomain={{x : 0}} height={170}
        padding={{left: 55, bottom: 20, right: 25, top: 5 }}
        containerComponent={
            <VictorySelectionContainer
            selectionDimension="x"
            onSelection={(points) => handleBrush(points[0])}
            onSelectionCleared={(props) => onValueChange([], type)}
          />
        }
      >

        <VictoryBar
          data={freqData} x="x" y="y"
          style={{ data: { fill: ({active}) => active ? "#42a5f5" : "gray"}}}
          events={[
              {
                  target: "data",
                  eventHandlers: {
                      onMouseDown: e => e.stopPropagation(),
                      onClick: () => {
                          return [{
                              target: "data",
                              mutation: props => {
                                  const clicked = selectedVal.includes(props.datum.x);
                                  handleSelect(props.datum.x, clicked);
                                  return { style: {fill: clicked ? "gray": "#42a5f5"}}
                              }
                          }]
                      }
                  }
              }
          ]}
        />
        <VictoryAxis tickValues={range(maxVal+1)} label={type === "node" ? "Degree" : "Size"}/>
        <VictoryAxis dependentAxis label="Count" style={{axisLabel: {padding: 35}}}/>
      </VictoryChart>
    </div>
  )
}

export default Bars
