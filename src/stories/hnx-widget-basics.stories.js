import React from 'react';

import {HypernetxWidgetView} from '../HypernetxWidgetView';

import props from './data/props.json'


export default {
  title: 'HNX Widget SVG/Basics',
};

export const Default = () =>
  <HypernetxWidgetView {...props} />

export const LineGraph = () =>
  <HypernetxWidgetView lineGraph {...props} />
