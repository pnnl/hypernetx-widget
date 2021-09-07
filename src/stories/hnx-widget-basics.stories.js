import React from 'react';

import Grid from '@material-ui/core/Grid';

import HypernetxWidgetView from '../HypernetxWidgetView';
import {HypernetxWidgetDualView} from '../HypernetxWidgetDualView';

import props from './data/props.json'


export default {
  title: 'HNX Widget SVG/Basics',
};

export const Euler = () =>
  <HypernetxWidgetView collapseNodes={false} {...props} />

export const EulerDual = () =>
  <Grid container>
    <Grid item sm={6}>
      <HypernetxWidgetView collapseNodes={false} {...props} />
    </Grid>

    <Grid item sm={6}>
      <HypernetxWidgetDualView collapseNodes={false} {...props} />
    </Grid>
  </Grid>

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
