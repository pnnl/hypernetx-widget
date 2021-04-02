import React, {useMemo} from 'react'

import {debounce, throttle} from 'lodash'

import {drag} from 'd3-drag'
import {group, maxIndex, merge, mean, min, max, range, sum, extent} from 'd3-array'
import {pack, hierarchy} from 'd3-hierarchy'
import {select} from 'd3-selection'
import {forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide} from 'd3-force'
import {polygonCentroid, polygonContains, polygonHull} from 'd3-polygon'
import {quadtree} from 'd3-quadtree'

import {TopologicalSort, DiGraph} from 'js-graph-algorithms'

import './hnx-widget.css'

// export const now = () => +(new Date());
export const now = () => new Date().toLocaleString();

const throttledConsole = throttle(console.log, 1000);

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

const forceMultiDragBehavior = (selection, simulation, elements, unpinned) => {
    const [width, height] = simulation.size;

    function dragstarted(event) {

      // subject.x, subject.y is the location of node
      const {x, y, uid} = event.subject;

      if (sum(elements, d => d.uid === uid) === 0) {
        elements = [event.subject];
      }

      // loop over each child group of nodes
      elements.forEach(d => {
        d.dx = d.x - x;
        d.dy = d.y - y;
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

      simulation.alphaTarget(0.3).restart();

      // event.x, event.y is the location of the drag
      const {dx, dy, dxRange, dyRange} = event.subject;
      const [minDx, maxDx] = dxRange;
      const [minDy, maxDy] = dyRange;

      let {x, y} = event;

      x = Math.min(width - maxDx, Math.max(x, -minDx));
      y = Math.min(height - maxDy, Math.max(y, -minDy));

      elements.forEach(d => {
        d.fx = x + d.dx;
        d.fy = y + d.dy;
        d.pinned = now();
      })
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
    }

    function unfix(event, d) {
      d.fx = undefined;
      d.fy = undefined;
    }

  selection
    .each(function(d) {
      if (d.pinned < unpinned) {
        unfix(undefined, d)
      }
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

      // subject.x, subject.y is the location of node
      const {x, y, elements} = event.subject;

      // loop over each child group of nodes
      elements.forEach(d => {
        d.dx = d.x - x;
        d.dy = d.y - y;
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
      simulation.alphaTarget(0.3).restart();

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
        d.pinned = now();
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

const createTooltipData = (ev, uid, {xOffset=3, labels={}, data}) => {
  return {
    x: ev.offsetX,
    y: ev.offsetY,
    xOffset,
    title: uid in labels ? `${labels[uid]} (${uid})` : uid,
    content: data ? data[uid] : undefined
  }
}

const classedByDict = (selection, props) =>
  Object.entries(props)
    .forEach(([className, dict={}]) =>
      selection.classed(className, d => dict[d.uid])
    )

const Nodes = ({internals, simulation, nodeData, onClickNodes=Object, onChangeTooltip=Object, withNodeLabels=true, nodeFill, nodeStroke, nodeStrokeWidth, selectedNodes={}, hiddenNodes, removedNodes, nodeLabels={}, unpinned, _model}) =>
  <g className='nodes' ref={ele => {
    
    const selectedInternals = internals.filter(({children}) =>
      sum(children, d => selectedNodes[d.uid])
    );

    const groups = select(ele)
      .selectAll('g.group')
        .data(internals)
          .join('g')
            .classed('group', true)
            .call(forceMultiDragBehavior, simulation, selectedInternals, unpinned);

    const circles = groups.selectAll('g')
      .data(d => d.descendants())
        .join(
          enter => {
            const g = enter.append('g')
            g.append('circle').classed('bottom', true);
            g.append('circle').classed('top', true)
              .attr('fill', 'url(#checkerboard)');
            g.append('text');
            return g;
          }
        )
          .on('click', (ev, d) => ev.stopPropagation() || onClickNodes(ev, d))
          .on('mouseover', (ev, d) => 
            d.height === 0 &&
            onChangeTooltip(createTooltipData(ev, d.data.uid, {xOffset: d.r + 3, labels: nodeLabels, data: nodeData}))
          )
          .on('mouseout', (ev, d) => d.height === 0 && onChangeTooltip())
          .classed('internal', d => d.height > 0)
          .call(encodeProps, d => d.data.uid, {nodeFill, nodeStroke, nodeStrokeWidth})
          .call(classedByDict, {'selected': selectedNodes, 'hiddenState': hiddenNodes})

    circles.select('circle.bottom')
      .attr('cx', d => d.height === 0 ? d.x : 0)
      .attr('cy', d => d.height === 0 ? d.y : 0)
      .attr('r', d => d.r);

    circles.select('circle.top')
      .attr('cx', d => d.height === 0 ? d.x : 0)
      .attr('cy', d => d.height === 0 ? d.y : 0)
      .attr('r', d => d.r);

    circles.select('text')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      // .attr('dx', d => d.r + 7)
      .text(d => d.data.uid in nodeLabels ? nodeLabels[d.data.uid] : d.data.uid)
      .style('visibility', withNodeLabels ? undefined : 'hidden');

    const updateModel = throttle(() => {
      if (_model) {
        const pos = merge(internals.map(d => d.children))
          .map(d => ([d.data.uid, [d.parent.x + d.x, d.parent.y + d.y]]));

        _model.set('pos', Object.fromEntries(pos));
        _model.save();
      }
    }, 1000);

    simulation.on('tick.nodes', d => {
      groups
        .attr('transform', d => `translate(${d.x},${d.y})`)
        .classed('fixed', d => d.fx !== undefined)
        .classed('error', d => d.violations > 0);

      updateModel();
    });
  }}/>

const HyperEdges = ({internals, edges, simulation, edgeData, dx=15, dr=5, nControlPoints=24, withEdgeLabels=true, edgeStroke, edgeStrokeWidth, selectedEdges, hiddenEdges, removedEdges, edgeLabels={}, edgeLabelStyle='callout', onClickEdges=Object, onChangeTooltip=Object}) =>
  <g className='edges' ref={ele => {
    const controlPoints = range(nControlPoints)
      .map(i => {
        const theta = 2*Math.PI*i/nControlPoints;
        return [Math.cos(theta), Math.sin(theta)];
      });

    const groups = select(ele)
      .selectAll('g')
        .data(edges)
          .join(enter => {
            const g = enter.append('g')
              .attr('fill', d => edgeStroke && d.uid in edgeStroke ? edgeStroke[d.uid] : 'black');

            g.append('path')
              .attr('stroke', 'black');

            if (edgeLabelStyle === 'callout') {
              g.append('rect')
            }

            g.append('circle');

            g.append('text')
              .attr('x', dx)
              .text(d => d.uid in edgeLabels ? edgeLabels[d.uid] : d.uid);



            return g;
          })
            .on('mouseover', (ev, d) => 
              onChangeTooltip(createTooltipData(ev, d.uid, {labels: edgeLabels, data: edgeData}))
            )
            .on('mouseout', () => onChangeTooltip())
            .on('click', onClickEdges)
            .call(forceEdgeDragBehavior, simulation)
            .call(classedByDict, {'selected': selectedEdges, 'hiddenState': hiddenEdges});

    groups.select('path')
      .call(encodeProps, d => d.uid, {edgeStroke, edgeStrokeWidth});

    groups.select('text')
      .style('visibility', withEdgeLabels ? undefined : 'hidden');

    const xValue = d => d[0];
    const yValue = d => d[1];

    const rightMost = points => {
      const idx = maxIndex(points, xValue);

      return idx !== -1
        ? points[idx]
        : points[0];
    }

    simulation.on('tick.hulls', d => {
      internals.forEach(d => d.numBands = 0);

      groups.select('path')
        .attr('d', d => {
          const {elements} = d;
          let points = [];

          elements.forEach(ele => {
            const {r, x, y} = ele;
            const level = ele.numBands++;

            controlPoints.forEach(([cx, cy]) => {
              const radius = r + dr*(1 + level);
              return points.push([radius*cx + x, radius*cy + y]);
            })
          });

          points = points.length === 0
            ? controlPoints.map(([cx, cy]) => ([d.x + 2*dr*cx, d.y + 2*dr*cy]))
            : polygonHull(points);
          
          d.points = points;
          d.centroid = polygonCentroid(points);


          // calculate widest segment
          const length = points.map((d1, i, a) => {
            const d0 = i === 0 ? a[a.length - 1] : a[i - 1];
            const dx = d1[0] - d0[0];
            const dy = d1[1] - d0[1];

            return ((dx*dx + dy*dy) > 1e3) + 1/(d1[0]*d1[1]);
          });

          const i = maxIndex(length);

          const d1 = points[i];
          const d0 = i === 0
            ? points[points.length - 1]
            : points[i - 1];

          d.markerLocation = [
            (d0[0] + d1[0])/2,
            (d0[1] + d1[1])/2, 
          ];

          d.markerAngle = (Math.atan2(
            d0[1] - d1[1],
            d0[0] - d1[0]
          )*180/Math.PI+ 360)%360;

          if (90 < d.markerAngle && d.markerAngle < 270) {
            d.markerAngle -= 180;
          }

          return 'M' + points.map(d => d.join(',')).join('L') + 'Z'
        });


      if (edgeLabelStyle === 'callout') {

        const mx = d => d.markerLocation[0];
        const my = d => d.markerLocation[1];


        groups.select('circle')
          .attr('cx', mx)
          .attr('cy', my)
          .attr('r', 3);

        groups.select('rect')
          .attr('x', mx)
          .attr('y', d => my(d) - .75)
          .attr('width', dx)
          .attr('height', 1.5);

        groups.select('text')
          .attr('x', mx)
          .attr('y', my)
          .attr('dx', dx + 2)
          .style('text-anchor', 'start');

      } else {
        groups.select('text')
          .attr('transform', 
            d => `translate(${d.markerLocation[0]},${d.markerLocation[1]}) rotate(${d.markerAngle}) `
          );
      }
    });
  }}/>

const BipartiteLinks = ({links, simulation}) =>
  <g className='bipartite' ref={ele => {
    const lines = select(ele)
      .selectAll('line')
        .data(links)
          .join('line')
            .style('stroke', 'black');

    simulation.on('tick.bipartite-lines', d => {
      lines
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
    });

  }}/>

const BipartiteEdges = ({internals, edges, simulation, edgeLabels, edgeData, edgeStroke, edgeStrokeWidth, selectedNodes={}, unpinned, onClickEdges=Object, onChangeTooltip=Object}) =>
  <g className='bipartite edges' ref={ele => {
    const selectedInternals = internals.filter(({children}) =>
      sum(children, d => selectedNodes[d.uid])
    );

    const rectDimensions = selection =>
      selection
        .attr('width', d => d.width)
        .attr('height', d => d.width)
        .attr('x', d => -d.width/2)
        .attr('y', d => -d.width/2);

    const groups = select(ele)
      .selectAll('g')
        .data(edges)
          .join(enter => {
            const g = enter.append('g')
              .attr('fill', d => edgeStroke && d.uid in edgeStroke ? edgeStroke[d.uid] : 'black');

            g.append('rect')
              .call(rectDimensions)
              .attr('stroke', 'black')
              .call(encodeProps, d => d.uid, {edgeStroke, edgeStrokeWidth})

            g.append('text')
              .text(d => edgeLabels && d.uid in edgeLabels ? edgeLabels[d.uid] : d.uid)

            return g;
          })
            .on('mouseover', (ev, d) => 
              onChangeTooltip(createTooltipData(ev, d.uid, {labels: edgeLabels, data: edgeData}))
            )
            .on('mouseout', () => onChangeTooltip())
            .call(forceMultiDragBehavior, simulation, selectedInternals, unpinned)
            .on('click', onClickEdges)

    simulation.on('tick.bipartite-edges', d => {
      groups.attr('transform', d => `translate(${d.x},${d.y})`)
    });

  }}/>

const Tooltip = ({x, y, xOffset=20, title, content={}}) =>
  <div style={{position: 'absolute'}}>
    <table
      className='hnx-tooltip'
      style={{position: 'relative', top: y, left: x + xOffset}}
    >
      <thead>
        <tr>
          <th colSpan={2}>
            {title}
          </th>
          <th />
        </tr>        
      </thead>

      <tbody>
        { Object.entries(content)
            .map(([k, v]) =>
              <tr key={k}>
                <td>{k}</td>
                <td>{v}</td>
              </tr>
            )
        }
      </tbody>
    </table>
  </div>

const performCollapseNodes = ({nodes, edges, collapseNodes}) => {

  const edgesOfNodes = new Map(
    nodes.map(d => ([d.uid, []]))
  );

  edges.forEach(d =>
    d.elements.forEach(k =>
      edgesOfNodes.get(k).push(d.uid)
    )
  );

  const grouped = group(
    nodes,
    ({uid}) => collapseNodes
      ? edgesOfNodes.get(uid).sort().join(',')
      : uid
  );

  const tree = Array.from(grouped.values())
    .map(elements => ({elements}));

  // construct a simple hierarchy out of the nodes
  return hierarchy({elements: tree}, d => d.elements)
    .sum(d => d.value);
}

const sortHyperEdges = edges => {
  // sort hyper edges
  // edges that are enclosed are drawn last
  // when there is a tie, the smaller edge is drawn last
  const G = new DiGraph(edges.length);

  for (let i = 0; i < edges.length; i++) {
    const si = new Set(edges[i].elements.map(d => d.uid));
    const nsi = si.size;

    for (let j = i + 1; j < edges.length; j++) {
      const sj = edges[j].elements.map(d => d.uid);
      const nsj = sj.length
      const nsij = sum(sj, d => si.has(d));

      if (nsij === nsi) {
        // j contains i
        G.addEdge(i, j);
      } else if (nsij === nsj) {
        // i contains j
        G.addEdge(j, i);
      } else if (nsij > 0 && nsi > nsj) {
        // neither contains the other, they overlap, and i is bigger
        G.addEdge(j, i);
      } else if (nsij > 0 && nsj > nsi) {
        // neither contains the other, they overlap, and j is bigger
        G.addEdge(i, j);
      }
    }
  }

  return new TopologicalSort(G)
    .order()
    .map(i => edges[i]);
}

// source: https://github.com/d3/d3-quadtree#quadtree_visit
function search(quadtree, xmin, ymin, xmax, ymax) {
  const results = [];
  const x = quadtree.x();
  const y = quadtree.y();

  quadtree.visit(function(node, x1, y1, x2, y2) {
    if (!node.length) {
      do {
        var d = node.data;
        if (x(d) >= xmin && x(d) < xmax && y(d) >= ymin && y(d) < ymax) {
          results.push(d);
        }
      } while (node = node.next);
    }
    return x1 >= xmax || y1 >= ymax || x2 < xmin || y2 < ymin;
  });
  return results;
}

// source: https://math.stackexchange.com/questions/2193720/find-a-point-on-a-line-segment-which-is-the-closest-to-other-point-not-on-the-li
// const _zero2D = [0, 0]

// function closestPointBetween2D(P, A, B) {
//     const v = [B[0] - A[0], B[1] - A[1]]
//     const u = [A[0] - P[0], A[1] - P[1]]
//     const vu = v[0] * u[0] + v[1] * u[1]
//     const vv = v[0] ** 2 + v[1] ** 2
//     const t = -vu / vv
//     if (t >= 0 && t <= 1) return _vectorToSegment2D(t, _zero2D, A, B)
//     const g0 = _sqDiag2D(_vectorToSegment2D(0, P, A, B))
//     const g1 = _sqDiag2D(_vectorToSegment2D(1, P, A, B))
//     return g0 <= g1 ? A : B
// }

// function _vectorToSegment2D(t, P, A, B) {
//     return [
//         (1 - t) * A[0] + t * B[0] - P[0],
//         (1 - t) * A[1] + t * B[1] - P[1],
//     ]
// }

// function _sqDiag2D(P) { return P[0] ** 2 + P[1] ** 2 }

const planarForce = (nodes, edges) => {
  const px = d => d[0];
  const py = d => d[1];

  function force(alpha) {
    // naive implementation
    // for each combination of node and edge

    nodes.forEach(v => v.violations = 0);

    const qt = quadtree()
      .x(d => d.x)
      .y(d => d.y)
      .addAll(nodes);

    edges.forEach(({points, centroid, elementSet=new Set()}) => {
      if (points) {
        const [xmin, xmax] = extent(points, px);
        const [ymin, ymax] = extent(points, py);

        search(qt, xmin, ymin, xmax, ymax)
          .forEach(v => {
            const {x, y, uid} = v;

            if (!elementSet.has(uid) && polygonContains(points, [x, y])) {
              v.violations += 1;

              const [cx, cy] = centroid;
              const dx = x - cx;
              const dy = y - cy;
              const r = Math.sqrt(dx*dx + dy*dy);

              v.vx += dx/(r*r)*alpha;
              v.vy += dy/(r*r)*alpha;
            }
          });
      }
    });
  }

  force.initialize = () => {
  }

  return force;
}

export const HypernetxWidgetView = ({nodes, edges, removedNodes, removedEdges, width=600, height=600, bipartite, ignorePlanarForce, pos={}, collapseNodes, ...props}) => {
  // const width = navOpen ? 600 : 800;
  const derivedProps = useMemo(
    () => {
      removedNodes = removedNodes || {};
      removedEdges = removedEdges || {};

      nodes = nodes.filter(({uid}) => !removedNodes[uid]);
      edges = edges.filter(({uid}) => !removedEdges[uid])
        .map(({elements, ...rest}) => ({
          elements: elements.filter(uid => !removedNodes[uid]),
          ...rest
        }));

      const tree = performCollapseNodes({nodes, edges, collapseNodes})
        .each((d, i) => d.uid = 'uid' in d.data ? d.data.uid : i);

      const nodesMap = new Map(
        tree.leaves().map(d => ([d.uid, d]))
      );

      // replace node ids with references to actual nodes
      edges = edges
        .map(({elements, ...rest}) => {
          const edge = new Map(
            elements.map(
              v => ([nodesMap.get(v).parent.uid, nodesMap.get(v).parent])
            )
          );

          const elementsAry = Array.from(edge.values())

          return {
            r: 0, width: 30, // this is interacting with the force algorithm, rename to fix
            elements: elementsAry,
            elementSet: new Set(elementsAry.map(d => d.uid)),
            ...rest
          }
        });

      edges = sortHyperEdges(edges);

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
            d.pinned = now();
          }
        }
      })

      // adjust position of the children relative to their parents

      tree.leaves().forEach(d => {
        d.x -= d.parent.x;
        d.y -= d.parent.y;
      });

      const internals = tree.children;

      // setup the force simulation

      const links = [];
      edges.forEach(source =>
        source.elements.forEach(target =>
          links.push({source, target})
        )
      );

      return {links, edges, internals};
    },
    [nodes, edges, removedNodes, removedEdges, collapseNodes]
  );

  const simulation = useMemo(() => {
    const {links, edges, internals} = derivedProps;

    function boundNode(d) {
      const {r=0} = d;
      d.x = Math.max(r, Math.min(width - r, d.x));
      d.y = Math.max(r, Math.min(height - r, d.y));
    }

    let simulation = forceSimulation([...internals, ...edges])
      .force('charge', forceManyBody().strength(-150).distanceMax(300))
      .force('link', forceLink(links).distance(30))
      .force('center', forceCenter(width/2, height/2))
      .force('collide', forceCollide().radius(d => 2*d.r || 0))
      .force('bound', () => simulation.nodes().forEach(boundNode));

    if (!bipartite && !ignorePlanarForce) {
      simulation.force('planar', planarForce(internals, edges));
    }

    simulation.size = [width, height];

    return simulation;

  }, [derivedProps, bipartite, width, height, props.unpinned]);

  const [tooltip, setTooltip] = React.useState();

  // debounce to improve rendering performance
  // when user is mousing quickly
  const handleTooltip = debounce(setTooltip, 200);

  const allProps = {
    simulation,
    ...derivedProps,
    ...props,
    onChangeTooltip: handleTooltip
  };

  return <div className='hnx-widget-view'>
    { tooltip &&
      <Tooltip {...tooltip} />
    }

    <svg style={{width, height}}>

      <defs>
          <pattern id="checkerboard" patternUnits="userSpaceOnUse" 
          width="50" height="50">
              <rect x="0" y="0" width="25" height="25"/>
              <rect x="25" y="25" width="25" height="25" />
          </pattern>
      </defs>

      { !bipartite && <HyperEdges {...allProps}  /> }

      { bipartite &&
        <React.Fragment>
          <BipartiteLinks {...allProps} /> 
          <BipartiteEdges {...allProps} />
        </React.Fragment>
      }

      <Nodes {...allProps} />
    </svg>

  </div>
}

export default HypernetxWidgetView

// todo:
//   labels, tooltips (data)
//   move drag handling to individual nodes
//   change DOM order of super-node groups
//   convex hull test to decollide nodes and hulls that shouldn't intersect
