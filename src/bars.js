import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { max, range } from 'd3-array';
import { VictoryTheme, VictoryScatter, VictoryBrushContainer, VictoryVoronoiContainer, VictoryBar, VictoryChart, VictoryAxis, VictorySelectionContainer } from "victory";

const Bars = ({ type, freqData, onValueChange }) =>{
  const maxVal = max(freqData.map(d => d.x));
  const handleSelection = x => {
      onValueChange(x[0].data.map(x => x.x), type);
  }
  return(
    <div style={{ height: "150px",  width:"100%",}}>
      <VictoryChart
        domainPadding={17} minDomain={{x : 0}} height={170}
        padding={{left: 55, bottom: 20, right: 25, top: 5 }}
        containerComponent={
          <VictorySelectionContainer
            selectionDimension="x"
            onSelection={(points, bounds, props) => handleSelection(points, bounds, props)}/>
          }>
        <VictoryBar
          data={freqData} x="x" y="y"
          style={{ data: { fill: ({active}) => active ? "#42a5f5" : "gray"}}}
        />
        <VictoryAxis tickValues={range(maxVal+1)} label={type === "node" ? "Degree" : "Size"}/>
        <VictoryAxis dependentAxis label="Count" style={{axisLabel: {padding: 35}}}/>
      </VictoryChart>
    </div>
  )
}

export default Bars
