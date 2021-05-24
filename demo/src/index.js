import React from 'react'
import {render} from 'react-dom'

import {HypernetxWidget} from '../../src/'

import props from '../../src/stories/data/props.json'

const Demo = () => 
  <div>
    <h1>hnx-widget Demo</h1>
    <HypernetxWidget {...props} />
  </div>

render(<Demo/>, document.querySelector('#demo'))
