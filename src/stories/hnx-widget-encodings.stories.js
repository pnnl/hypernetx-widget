import React from 'react';

import {HypernetxWidget} from '..'

import props from './data/props.json'


export default {
  title: 'HNX Widget SVG/Encodings',
};

console.log(props)

export const Radius = () =>
  <HypernetxWidget {...props} />

