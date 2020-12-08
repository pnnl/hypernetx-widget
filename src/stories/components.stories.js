import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LoadList from '../loadList.js';
import Main from '../main.js';
import DataTable from '../dataTable.js';
import LoadTable from '../loadTable.js';
import ColorButton from '../colorButton.js';
import Demo from '../demo.js';
import props from './data/props.json'

export default {
  title: 'HNX Widget SVG/Components',
}

const nodeLabels = props.nodes.map(x => x.elements[0]);
const nodeValues = props.nodes.map(x => x.elements[0].value);
// console.log(Array.from(props.nodes.map(x => x.elements[0])));
const edgeLabels = props.edges.map(x => x.uid.flat());
const edgeLevels = props.edges.map(x => x.level);

const sampleData = [
  {uid:"TH", color: "red", value: 2, selected: true, visible: true},
  {uid:"AM", color: "blue", value: 4, selected: true, visible: false},
  {uid:"DJ", color: "green", value: 1, selected: false, visible: true}
];


export const List = () => <div>
  <div>List of nodes will be loaded here.</div>
  <div><LoadList labels={nodeLabels} values={nodeValues}/></div>
  <div>List of edges will be loaded here.</div>
  <div><LoadList labels={edgeLabels} values={edgeLevels}/></div>
  </div>

// export const Table = () => <div>
//   <div><DataTable data={nodeLabels}/></div>
//
// </div>

export const Sample = () => <div>
<div><Demo /></div>
</div>

export const MainComponent = () => <div>
  <Main nodes={props.nodes} edges={props.edges}/>
</div>

export const TableComponent = () => <div>
  <LoadTable data={sampleData}/>
</div>

export const ColorComponent = () => <div><ColorButton label="TH" color="red"/></div>
