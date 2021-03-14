import React from 'react';

import {HypernetxWidgetView} from '../HypernetxWidgetView';

import props from './data/props.json'


export default {
  title: 'HNX Widget SVG/Edge Labels',
};

export const DefaultStyle = () =>
  <HypernetxWidgetView {...props} />

export const CalloutStyle = () =>
  <HypernetxWidgetView {...props} edgeLabelStyle='callout' />

