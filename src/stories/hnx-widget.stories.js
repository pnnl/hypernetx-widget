import React from 'react';

import props from './data/props.json'

export default {
  title: 'HNX Widget/Button',
};

export const Test = () =>
  console.log(props) ||
  <div>Test</div>