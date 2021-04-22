import React from 'react';

// import {HypernetxWidget} from '..'
import HypernetxWidgetView, {HypernetxWidget} from '..';

import props from './data/biggerProps.json'

console.log(props);

const TestBackboneModel = () => {
  const state = {};

  return {
    save: () => console.log('Saving', state),
    set: (key, value) => state[key] = value
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

export const TestPositionInputWithFullUI = () =>
  <HypernetxWidget
    {...props}
    _model={TestBackboneModel()}
  />

export const TestWithoutPositionInputWithFullUI = () =>
  <HypernetxWidget
    {...props}
    pos={undefined}
    _model={TestBackboneModel()}
  />

export default {
  title: 'HNX Widget SVG/Position IO',
};

