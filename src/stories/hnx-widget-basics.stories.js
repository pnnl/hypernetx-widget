import React from 'react';

import {HypernetxWidgetView} from '../HypernetxWidgetView';

import props from './data/props.json'


export default {
  title: 'HNX Widget SVG/Basics',
};

export const Euler = () =>
  <HypernetxWidgetView {...props} />

export const EulerWithoutPlanarForce = () =>
  <HypernetxWidgetView {...props} ignorePlanarForce />

export const EulerCollapsed = () =>
  <HypernetxWidgetView collapseNodes {...props} />

export const EulerCollapsedWithoutPlanarForce = () =>
  <HypernetxWidgetView collapseNodes {...props} ignorePlanarForce />

export const LineGraph = () =>
  <HypernetxWidgetView lineGraph {...props} />

export const LineGraphCollapsed = () =>
  <HypernetxWidgetView lineGraph collapseNodes {...props} />
