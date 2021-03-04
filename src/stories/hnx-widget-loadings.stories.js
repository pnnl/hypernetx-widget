import React from 'react';
import Widget from '../widget.js';

import props from './data/props.json';
import '../css/hnxStyle.css';



export default {
  title: 'HNX Widget SVG/Loadings',
};

// console.log("PROPS", props.nodes, props.edges);
const nodeColorDict = {'FN': "#"};
export const MainComponent = () => <div>
  <Widget nodes={props.nodes} edges={props.edges} />
</div>

// export const Button = () => <ShowButton type={"node"} />
