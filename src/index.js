import React from 'react'

import {range} from 'd3-array'
import {pack, hierarchy} from 'd3-hierarchy'
import {select} from 'd3-selection'
import {forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide} from 'd3-force'
import {polygonHull} from 'd3-polygon'

const Nodes = ({data, simulation}) =>
  <g ref={ele => {
    const groups = select(ele)
      .selectAll('g')
        .data(data)
          .join('g');

    groups.selectAll('circle')
      .data(d => d.children)
        .join('circle')
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)
          .attr('r', d => d.r);

    simulation.on('tick.nodes', d => {
      groups.attr('transform', d => `translate(${d.x},${d.y})`);
    });
  }}/>

const HyperEdges = ({data, simulation, nControlPoints=24}) =>
  <g ref={ele => {
    const controlPoints = range(nControlPoints)
      .map((d, i, a) => {
        const theta = 2*Math.PI*i/a.length
        return [Math.cos(theta), Math.sin(theta)];
      });

    const hulls = select(ele)
      .selectAll('path')
        .data(data)
          .join('path')
            .attr('stroke', 'black')
            .attr('fill', 'none');

    simulation.on('tick.hulls', d =>
      hulls
        .attr('d', d => {
          const points = [];
          d.elements.forEach(({r, x, y}) => {
            controlPoints.forEach(([cx, cy]) =>
              points.push([r*cx + x, r*cy + y])
            )
          });

          return 'M' + polygonHull(points).map(d => d.join(',')).join('L')
        })
    );
  }}/>


const DebugLinks = ({data, simulation}) =>
  <g ref={ele => {
    const lines = select(ele)
      .selectAll('line')
        .data(data)
          .join('line')
            .style('stroke', 'black');

    simulation.on('tick.debug-lines', d => {
      lines
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
    });

  }}/>

export const HypernetxWidget = ({fill='black', size=[800, 600], debug, ...props}) => {

  // construct a simple hierarchy out of the nodes
  // replace node ids with references to actual nodes
  let {nodes, edges} = props;

  const tree = hierarchy({elements: nodes}, d => d.elements)
    .sum(d => d.value);

  edges = edges.map(({elements, ...rest}) => ({
    elements: elements.map(v => tree.children[v]),
    ...rest
  }));

  //

  const [width, height] = size;

  const radius = d => Math.sqrt(d.value/Math.PI);

  const rootRadius = radius(tree);
  const scale = Math.min(width, height)/(10*rootRadius);

  const layout = pack()
    .radius(d => scale*radius(d))
    .size(size)
    (tree);

  // adjust position of the children relative to their parents

  tree.leaves().forEach(d => {
    d.x -= d.parent.x;
    d.y -= d.parent.y;
  });

  const internals = tree.descendants()
    .filter(d => d.height > 0 && d.depth > 0);

  // setup the force simulation
  
  const links = [];
  edges.forEach(source =>
    source.elements.forEach(target =>
      links.push({source, target})
    )
  );


  let simulation = forceSimulation([...tree.children, ...edges])
    .force('charge', forceManyBody().strength(-150).distanceMax(300))
    .force('link', forceLink(links).distance(30))
    .force('center', forceCenter(width/2, height/2))
    .force('collide', forceCollide().radius(d => 2*d.r || 0));

  return <svg style={{width, height}}>
    <Nodes data={internals} simulation={simulation} />
    <HyperEdges data={edges} simulation={simulation} />
    { debug && <DebugLinks data={links} simulation={simulation} /> }
  </svg>
}