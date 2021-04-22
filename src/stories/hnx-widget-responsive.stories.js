import React from 'react';

import HypernetxWidgetView from '../HypernetxWidgetView';

import props from './data/props.json'


export default {
  title: 'HNX Widget SVG/Responsive',
};

export const Default = () =>
  <div style={{width: '100%'}}>
    <HypernetxWidgetView {...props} />
  </div>
  
export const WidthConstrained = () =>
  <div style={{width: 300}}>
    <HypernetxWidgetView {...props} />
  </div>

export const HeightConstrained = () =>
  <div style={{height: 300}}>
    <HypernetxWidgetView {...props} />
  </div>

export const WidthAndHeightConstrained = () =>
  <div style={{width: 300, height: 300}}>
    <HypernetxWidgetView {...props} />
  </div>

