import React from 'react';

// import {HypernetxWidget} from '..'
import HypernetxWidgetView from '../HypernetxWidgetView';

import props from './data/props.json'
import propsWithRadius from './data/props-with-radius.json'

export default {
  title: 'HNX Widget SVG/Encodings',
};

// console.log(props)

const nodes = {'JV': true, 'TH': true};
const edges = {'1': true, '2': true};

export const SelectedNodes = () =>
  <HypernetxWidgetView {...props} selectedNodes={nodes} />

export const SelectedEdges = () =>
  <HypernetxWidgetView {...props} selectedEdges={edges} />

export const HiddenNodes = () =>
  <HypernetxWidgetView {...props} hiddenNodes={nodes}  />

export const HiddenEdges = () =>
  <HypernetxWidgetView {...props} hiddenEdges={edges}  />

export const RemovedNodes = () =>
  <HypernetxWidgetView {...props} removedNodes={nodes}  />

export const RemovedEdges = () =>
  <HypernetxWidgetView {...props} removedEdges={edges}  />

export const WithRadius = () =>
  <HypernetxWidgetView {...propsWithRadius} />

export const WithRadiusCollapsed = () =>
  <HypernetxWidgetView {...propsWithRadius} collapseNodes />

