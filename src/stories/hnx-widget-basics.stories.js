import React from 'react';

import {HypernetxWidget} from '..'

import props from './data/props.json'


export default {
  title: 'HNX Widget SVG/Basics',
};


export const Default = () =>
  <HypernetxWidget {...props} />

export const Debug = () =>
  <HypernetxWidget debug {...props} />