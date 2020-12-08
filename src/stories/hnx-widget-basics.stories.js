import React from 'react';
import Main from '../main.js';
import {HypernetxWidget} from '..'
import LoadTable from '../loadTable.js';
import ColorButton from '../colorButton.js';
import props from './data/props.json'


export default {
  title: 'HNX Widget SVG/Basics',
};

export const Default = () =>
  <HypernetxWidget {...props} />

export const Debug = () =>
  <HypernetxWidget debug {...props} />
