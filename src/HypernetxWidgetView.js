import React, {useMemo} from 'react'

import {drag} from 'd3-drag'
import {range} from 'd3-array'
import {pack, hierarchy} from 'd3-hierarchy'
import {select} from 'd3-selection'
import {forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide} from 'd3-force'
import {polygonHull} from 'd3-polygon'

import './hnx-widget.css'

const styleEncodings = {
  Stroke: 'stroke',
  StrokeWidth: 'stroke-width',
  Fill: 'fill'
}

const encodeProps = (selection, key, props) => {
  Object.entries(props).forEach(([k, encoding]) => {
    const style = styleEncodings[k.replace(/edge|node|edgeLabel|nodeLabel/, '')]
    if (style && encoding) {
      selection.attr(style, d => encoding[key(d)]);
    }
  })
  
}

const Nodes = ({internals, simulation, onClickNodes=Object, nodeFill}) =>
  <g className='nodes' ref={ele => {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    
    function dragged(event) {
      select(this).classed('fixed', true);
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
    
    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
    }

    function unfix(event, d) {
      select(this).classed('fixed', false);
      d.fx = null;
      d.fy = null;
    }

    const groups = select(ele)
      .selectAll('g')
        .data(internals)
          .join('g')
            .on('dblclick', unfix)
            .call(drag()
              .on('start', dragstarted)
              .on('drag', dragged)
              .on('end', dragended)
            );

    const circles = groups.selectAll('circle')
      .data(d => d.descendants())
        .join('circle')
          .on('click', onClickNodes)
          .classed('internal', d => d.height > 0)
          .attr('cx', d => d.height === 0 ? d.x : 0)
          .attr('cy', d => d.height === 0 ? d.y : 0)
          .attr('r', d => d.r)
          .call(encodeProps, d => d.data.uid, {nodeFill});

    simulation.on('tick.nodes', d => {
      groups.attr('transform', d => `translate(${d.x},${d.y})`);
    });
  }}/>

const HyperEdges = ({edges, simulation, dr=5, nControlPoints=24, edgeStroke, edgeStrokeWidth, edgeFill, onClickEdges=Object}) =>
  <g ref={ele => {
    const controlPoints = range(nControlPoints)
      .map(i => {
        const theta = 2*Math.PI*i/nControlPoints;
        return [Math.cos(theta), Math.sin(theta)];
      });

    const hulls = select(ele)
      .selectAll('path')
        .data(edges)
          .join('path')
            .on('click', onClickEdges)
            .attr('stroke', 'black')
            .attr('fill', 'none')
            .call(encodeProps, d => d.uid, {edgeStroke, edgeStrokeWidth, edgeFill});

    simulation.on('tick.hulls', d =>
      hulls
        .attr('d', ({level, elements}) => {
          let points = [];

          elements.forEach(({r, x, y, ...rest}) => {
            controlPoints.forEach(([cx, cy]) => {
              const radius = r + dr*(1 + level);
              return points.push([radius*cx + x, radius*cy + y]);
            })
          });

          points = polygonHull(points);

          // add the first point to the end to close the path
          points.push(points[0]);

          return 'M' + points.map(d => d.join(',')).join('L')
        })
    );
  }}/>

const DebugLinks = ({links, simulation}) =>
  <g ref={ele => {
    const lines = select(ele)
      .selectAll('line')
        .data(links)
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

export const HypernetxWidgetView = ({nodes, edges, width=800, height=600, debug, ...props}) => {
  const derivedProps = useMemo(
    () => {
      // construct a simple hierarchy out of the nodes
      const tree = hierarchy({elements: nodes}, d => d.elements)
        .sum(d => d.value);

      // replace node ids with references to actual nodes
      edges = edges.map(({elements, ...rest}) => ({
        elements: elements.map(v => tree.children[v]),
        ...rest
      }));

      //

      const radius = d => Math.sqrt(d.value/Math.PI);

      const rootRadius = radius(tree);
      const scale = Math.min(width, height)/(10*rootRadius);

      const layout = pack()
        .padding(2)
        .radius(d => scale*radius(d))
        .size([width, height])
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

      return {links, edges, internals, simulation};
    },
    [nodes, edges, width, height]
  );

  return <svg style={{width, height}} className='hnx-widget-view'>
    <HyperEdges {...derivedProps}  {...props} />
    <Nodes {...derivedProps} {...props} />
    { debug && <DebugLinks {...derivedProps} {...props} /> }
  </svg>
}

export default HypernetxWidgetView

// todo:
//   labels, tooltips (data)
//   move drag handling to individual nodes
//   change DOM order of super-node groups
//   convex hull test to decollide nodes and hulls that shouldn't intersect
