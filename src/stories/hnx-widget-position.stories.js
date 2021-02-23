import React from 'react';

// import {HypernetxWidget} from '..'
import {HypernetxWidgetView} from '../HypernetxWidgetView';

import props from './data/biggerProps.json'

console.log(props);

export default {
  title: 'HNX Widget SVG/Position IO',
};

export const TestPositionInput = () =>
  <HypernetxWidgetView {...props} />
