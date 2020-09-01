import React, {Component} from 'react'
import {render} from 'react-dom'

import {Example} from '../../src'

class Demo extends Component {
  render() {
    return <div>
      <h1>hnx-widget Demo</h1>
      <div>
        A widget for interractive visualization of the hypernetx package.
      </div>
      <Example hello='world'/>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
