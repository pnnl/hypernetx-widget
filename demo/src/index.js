import React from 'react'
import {render} from 'react-dom'

import Typography from '@material-ui/core/Typography'

import {HypernetxWidget} from '../../src/'

import props from '../../src/stories/data/props.json'

const Demo = () => 
  <div>
    <Typography variant='h3'>hnxwidget Demonstration</Typography>
    <Typography variant='caption'>
    	GitHub Repository: <a href='https://www.github.com/pnnl/hypernetx-widget'>
    		github.com/pnnl/hypernetx-widget
    	</a>
    </Typography>
    <HypernetxWidget {...props} />
  </div>

render(<Demo/>, document.querySelector('#demo'))
