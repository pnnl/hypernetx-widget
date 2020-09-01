import React from 'react'

export const HypernetxWidget = props =>
  <div>
    I am a React Jupyter Widget. Here are my props:
    <pre>
      { JSON.stringify(props, null, 2) }
    </pre>
  </div>
