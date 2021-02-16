import React from 'react';

// import {HypernetxWidget} from '..'
import {HypernetxWidgetView} from '../HypernetxWidgetView';

import props from './data/props.json'


export default {
  title: 'HNX Widget SVG/Encodings',
};

// console.log(props)

export const Radius = () =>
  <HypernetxWidgetView {...props} />
