import React from 'react';

import {HypernetxWidget} from '..'

import props from './data/props.json'

export default {
  title: 'HNX Widget SVG/Interactions',
};

export const LogNodeClick = () =>
  <HypernetxWidget {...props} onClickNodes={console.log}/>

export const LogEdgeClick = () =>
  <HypernetxWidget {...props} onClickEdges={console.log}/>

