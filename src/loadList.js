import React from 'react';
import { ListItem, ListItemText, Button } from '@material-ui/core';
import ColorButton from './colorButton.js';
import VisibilityButton from './visibilityButton.js';
import { max } from 'd3-array';

import './css/hnxStyle.css';

const LoadList = ({ labels, values }) => {
  const calcBar = i => {
    return String(100 * (i/max(values)))+"%";
  }

  return <div>
      <div style={{display:"inline-block", width:"100%", height:300, maxWidth:300, overflow:"scroll", border:"1px solid"}}>
      {labels.map((x, i) =>
        <div key={x} className="listitem">
          <ListItem style={{borderBottom: "1px solid"}} key={i} button>
          <div className="hbar">
            <div style={{ width: calcBar(values[i]), minWidth:"1px", height:"7px", backgroundColor:"gray" }}/>
          </div>
            <ListItemText primary={x} />

            <VisibilityButton />
            <ColorButton element={x}/>
        </ListItem>
        </div>
      )}

      </div>
      <div style={{padding:"5px", margin:"10px"}}>
      {values.map((x,i) =>
        <div key={i} className="barChart" style={{ height: 20*x/max(values)}}/>
      )}
      </div>
    </div>

}

export default LoadList
