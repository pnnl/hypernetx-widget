import React, {useMemo} from 'react'

import {drag} from 'd3-drag'
import {mean, min, max, range} from 'd3-array'
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

const forceDragBehavior = (selection, simulation) => {
    const [width, height] = simulation.size;

    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();

      select(this).classed('fixed', true);

      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {

      const {x, y} = event;
      const {r} = event.subject;

      event.subject.fx = Math.min(width - r, (Math.max(x, r)));
      event.subject.fy = Math.min(height - r, (Math.max(y, r)));
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
    }

    function unfix(event, d) {
      select(this).classed('fixed', false);
      d.fx = null;
      d.fy = null;
    }

  selection
    .each(function(d) {
      d.ele = this;
    })
    .on('dblclick', unfix)
    .call(drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)
    );
}

const forceEdgeDragBehavior = (selection, simulation) => {
    const [width, height] = simulation.size;

    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();

      // subject.x, subject.y is the location of node
      const {x, y, elements} = event.subject;

      // loop over each child group of nodes
      elements.forEach(d => {
        d.dx = d.x - x;
        d.dy = d.y - y;

        // set the class to fixed to indicate dragging
        select(d.ele).classed('fixed', true);
      });

      event.subject.dxRange = [
        min(elements, d => d.dx - d.r),
        max(elements, d => d.dx + d.r)
      ];


      event.subject.dyRange = [
        min(elements, d => d.dy - d.r),
        max(elements, d => d.dy + d.r)
      ];
    }

    function dragged(event) {
      // select(this).classed('fixed', true);

      // event.x, event.y is the location of the drag
      const {dx, dy, elements, dxRange, dyRange} = event.subject;
      const [minDx, maxDx] = dxRange;
      const [minDy, maxDy] = dyRange;

      let {x, y} = event;

      x = Math.min(width - maxDx, Math.max(x, -minDx));
      y = Math.min(height - maxDy, Math.max(y, -minDy));

      elements.forEach(d => {
        d.fx = x + d.dx;
        d.fy = y + d.dy;
      })
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
    }

  selection
    .call(drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)
    );
}

const Nodes = ({internals, simulation, onClickNodes=Object, nodeFill, nodeStroke, nodeStrokeWidth, nodeLabels={}}) =>
  <g className='nodes' ref={ele => {

    const groups = select(ele)
      .selectAll('g')
        .data(internals)
          .join('g')
            .call(forceDragBehavior, simulation);

    const circles = groups.selectAll('circle')
      .data(d => d.descendants())
        .join('circle')
          .on('click', onClickNodes)
          .classed('internal', d => d.height > 0)
          .attr('cx', d => d.height === 0 ? d.x : 0)
          .attr('cy', d => d.height === 0 ? d.y : 0)
          .attr('r', d => d.r)
          .call(encodeProps, d => d.data.uid, {nodeFill, nodeStroke, nodeStrokeWidth});

    const text = groups.selectAll('text')
      .data(d => d.leaves())
        .join('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .attr('dx', d => d.r + 7)
        .text(d => d.data.uid in nodeLabels ? nodeLabels[d.data.uid] : d.data.uid);

    simulation.on('tick.nodes', d => {
      groups.attr('transform', d => `translate(${d.x},${d.y})`);
    });
  }}/>

const HyperEdges = ({edges, simulation, dr=5, nControlPoints=24, edgeStroke, edgeStrokeWidth, edgeFill, onClickEdges=Object}) =>
  <g className='edges' ref={ele => {
    const controlPoints = range(nControlPoints)
      .map(i => {
        const theta = 2*Math.PI*i/nControlPoints;
        return [Math.cos(theta), Math.sin(theta)];
      });

    const hulls = select(ele)
      .selectAll('path')
        .data(edges)
          .join('path')
            .call(forceEdgeDragBehavior, simulation)
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

export const HypernetxWidgetView = ({nodes, edges, width=600, height=600, debug, pos={}, ...props}) => {
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

      // sort hyper edges
      // edges that are enclosed are drawn last
      // when there is a tie, the smaller edge is drawn last
      edges.sort((a, b) =>
        a.level === b.level
          ? b.elements.length - a.elements.length
          : b.level - a.level
      )

      //

      const radius = d => Math.sqrt(d.value/Math.PI);

      const rootRadius = radius(tree);
      const scale = Math.min(width, height)/(10*rootRadius);

      const layout = pack()
        .padding(2)
        .radius(d => scale*radius(d))
        .size([width, height])
        (tree);

      // pre-specified children
      tree.each(d => {
        if (d.depth === 1) {
          const children = d.children.filter(c => c.data.uid in pos);

          if (children.length > 0) {
            d.fx = mean(children, c => pos[c.data.uid][0]);
            d.fy = mean(children, c => pos[c.data.uid][1]);
          }
        }
      })

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

      function boundNode(d) {
        const {r=0} = d;
        d.x = Math.max(r, Math.min(width - r, d.x));
        d.y = Math.max(r, Math.min(height - r, d.y));
      }

      let simulation = forceSimulation([...tree.children, ...edges])
        .force('charge', forceManyBody().strength(-150).distanceMax(300))
        .force('link', forceLink(links).distance(30))
        .force('center', forceCenter(width/2, height/2))
        .force('collide', forceCollide().radius(d => 2*d.r || 0))
        .force('bound', () => simulation.nodes().forEach(boundNode));


      simulation.size = [width, height];

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
