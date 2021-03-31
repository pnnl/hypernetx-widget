import React from 'react';

import {HypernetxWidgetView} from '../HypernetxWidgetView';

import props from './data/props.json'


export default {
  title: 'HNX Widget SVG/Basics',
};

export const Euler = () =>
  <HypernetxWidgetView collapseNodes={false} {...props} />

export const EulerWithoutPlanarForce = () =>
  <HypernetxWidgetView {...props} ignorePlanarForce />

export const EulerCollapsed = () =>
  <HypernetxWidgetView collapseNodes={true} {...props} />

export const EulerCollapsedWithoutPlanarForce = () =>
  <HypernetxWidgetView collapseNodes {...props} ignorePlanarForce />

export const Bipartite = () =>
  <HypernetxWidgetView bipartite {...props} />

export const BipartiteCollapsed = () =>
  <HypernetxWidgetView bipartite collapseNodes {...props} />
