import React from 'react'

import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'

import {HypernetxWidgetView} from './HypernetxWidgetView'

export const HypernetxWidget = props =>
  <Grid container spacing={1}>
    <Grid item xs={12} sm={2}>
      <Paper>
        Controls
      </Paper>
    </Grid>

    <Grid item xs={12} sm={10}>
      <Paper>
        <HypernetxWidgetView {...props} /> 
      </Paper>
    </Grid>

  </Grid>

export default HypernetxWidget
