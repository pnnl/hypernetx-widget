import React from 'react';

export var Example = function Example(props) {
  return React.createElement(
    'div',
    null,
    'I am a React Jupyter Widget. Here are my props:',
    React.createElement(
      'pre',
      null,
      JSON.stringify(props, null, 2)
    )
  );
};