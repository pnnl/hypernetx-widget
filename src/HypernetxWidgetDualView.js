import React from 'react'

import HypernetxWidgetView from './HypernetxWidgetView'

export const HypernetxWidgetDualView = ({
  nodes,
  edges,
  ...props
}) => {

  const edgesMap = new Map();

  edges.forEach(({uid, elements}) =>
    elements.forEach(e => {
      if (!edgesMap.has(e)) {
        edgesMap.set(e, [])
      }
      edgesMap.get(e).push(uid);
    })
  );

  const dualProps = {};
  dualProps.edgeStroke = props.nodeFill;
  dualProps.edgeLabelColor = props.nodeLabelColor;
  dualProps.nodeData = props.edgeData;
  dualProps.nodeLabels = props.edgeLabels;
  dualProps.edgeLabels = props.nodeLabels;
  dualProps.withEdgeLabels = props.withNodeLabels;
  dualProps.withNodeLabels = props.withEdgeLabels;
  dualProps.nodeFill = props.edgeStroke;
  dualProps.selectedNodes = props.selectedEdges;
  dualProps.hiddenNodes = props.hiddenEdges;
  dualProps.removedNodes = props.removedEdges;
  dualProps.selectedEdges = props.selectedNodes;
  dualProps.hiddenEdges = props.hiddenNodes;
  dualProps.removedEdges = props.removedNodes;
  dualProps.nodeFontSize = props.edgeFontSize;
  dualProps.edgeFontSize = props.nodeFontSize;
  dualProps.onClickNodes = props.onClickEdges;
  dualProps.onClickEdges = props.onClickNodes;

  return <HypernetxWidgetView
    nodes={edges.map(({uid}) => ({uid}))}
    edges={
      Array.from(edgesMap.entries())
        .map(([uid, elements]) => ({uid, elements}))
    }
    {...props}
    {...dualProps}
  />
}

export default HypernetxWidgetDualView;
