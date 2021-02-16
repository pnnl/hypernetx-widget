import React from 'react';

// import {HypernetxWidget} from '..'
import {HypernetxWidgetView} from '../HypernetxWidgetView';

import props from './data/props.json'

export default {
  title: 'HNX Widget SVG/Interactions',
};

export const LogNodeClick = () =>
  <HypernetxWidgetView {...props} onClickNodes={console.log}/>

export const LogEdgeClick = () =>
  <HypernetxWidgetView {...props} onClickEdges={console.log}/>
