import React from 'react';
import Widget from '../widget.js';
import {HnxWidget} from '..'
import LoadTable from '../loadTable.js';
import ColorButton from '../colorButton.js';
import props from './data/props.json'


export default {
  title: 'HNX Widget SVG/Basics',
};

export const Default = () =>
  <HnxWidget {...props} />

export const Debug = () =>
  <HnxWidget debug {...props} />
