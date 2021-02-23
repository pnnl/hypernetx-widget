import React from 'react';

// import {HypernetxWidget} from '..'
import {HypernetxWidgetView} from '../HypernetxWidgetView';

import props from './data/biggerProps.json'

console.log(props);

const TestBackboneModel = () => {
  const state = {};

  return {
    save: () => console.log('Saving', state),
    setState: (key, value) => state[key] = value
  };
}

export const TestPositionInput = () =>
  <HypernetxWidgetView
    {...props}
    _model={TestBackboneModel()}
  />

export const TestPositionInputWithoutModel = () =>
  <HypernetxWidgetView
    {...props}
  />

export default {
  title: 'HNX Widget SVG/Position IO',
};

