import React from 'react';

import HypernetxWidgetView from '../HypernetxWidgetView';

import props from './data/props.json'


export default {
  title: 'HNX Widget SVG/Brushing',
};

export const NodeBrush = () =>
  <HypernetxWidgetView {...props}
  	selectionMode='node-brush'
  	onClickNodes={console.log}
  />

export const EdgeBrush = () =>
  <HypernetxWidgetView {...props}
  	selectionMode='edge-brush'
  	onClickEdges={console.log}
  />

