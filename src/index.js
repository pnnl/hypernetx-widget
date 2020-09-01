import React from 'react'

import {pack, hierarchy} from 'd3-hierarchy'
import {select} from 'd3-selection'

export const HypernetxWidget = ({fill='black', size=[800, 600], ...props}) => {

  // construct a simple hierarchy out of the nodes
  // replace node ids with references to actual nodes
  let {nodes, edges} = props;

  const tree = hierarchy({elements: nodes}, d => d.elements)
    .sum(d => d.value);

  edges = edges.map(({elements, ...rest}) => ({
    elements: elements.map(v => tree.children[v]),
    ...rest
  }));

  const layout = pack()
    .radius(d => 10*Math.sqrt(d.value))
    .size(size)
    (tree)

  console.log(tree)

  const [width, height] = size;

  return <svg style={{width, height}}
    ref={ele => {
      const circles = select(ele)
        .selectAll('circle')
          .data(tree.descendants())
            .join('circle')
              .attr('cx', d => d.x)
              .attr('cy', d => d.y)
              .attr('r',  d => d.r)
              .attr('stroke', d => d.height > 0 ? 'black' : 'none')
              .attr('fill', d => d.height > 0 ? 'none' : d.fill || fill);
    }}
  />
}