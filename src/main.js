import React from 'react';
import LoadTable from './loadTable.js';

// nodes, edges, userDefinedNodeColors
const Main = ({ nodes, edges }) => {
  const nodesData = nodes.map(x => x.elements).flat();

  const getNodeDegree = (uid) => {
    const degrees = Array.from({length: nodes.length}, (x, i) => 0);
    edges.map(e => e.elements.map(v => {
        degrees[v] += 1;
      })
    )
    const nodeBySuperIdx = nodes.map((n,i) => [i, n.elements.map(x => x.uid)]);
    var deg = null;
    nodeBySuperIdx.map((x,i) => {
      if(x[1].includes(uid)){
         deg = degrees[i];
      }
    })
    return deg
  }



  const getEdgeSize = (edgeIdx) => {
    const nodeElems = edges[edgeIdx].elements;
    var edgeSize = 0
    nodeElems.map(x => {
      edgeSize += nodes[x].elements.length;
    })
    return edgeSize
  }

  const nodeDegMap = new Map();
  nodesData.map((x,i) => nodeDegMap.set(x.uid, getNodeDegree(x.uid)));
  const nodeDegList = Object.fromEntries(nodeDegMap);

  const edgeSizeMap = new Map();
  edges.map((x, i) => edgeSizeMap.set(x.uid.toString(), getEdgeSize(i)));
  const edgeSizeList = Object.fromEntries(edgeSizeMap);

  const nodeColorMap = new Map();
  nodesData.map(x => nodeColorMap.set(x.uid, x.style.fill));

  const edgeColorMap = new Map();
  edges.map(x => edgeColorMap.set(x.uid.toString(), x.style.fill));

  const nodeVisibleMap = new Map();
  nodesData.map(x => nodeVisibleMap.set(x.uid, true));

  const edgeVisibleMap = new Map();
  edges.map(x => edgeVisibleMap.set(x.uid.toString(), true));

  const nodeSelectMap = new Map();
  nodesData.map(x => nodeSelectMap.set(x.uid, true));

  const edgeSelectMap = new Map();
  edges.map(x => edgeSelectMap.set(x.uid.toString(), true));

  const noNodeSelectMap = new Map();
  nodesData.map(x => noNodeSelectMap.set(x.uid, false));

  const noEdgeSelectMap = new Map();
  edges.map(x => noEdgeSelectMap.set(x.uid.toString(), false));

  const [nodeColor, setNodeColor] = React.useState(Object.fromEntries(nodeColorMap));
  const [nodeSelected, setNodeSelected] = React.useState(Object.fromEntries(nodeSelectMap));
  const [nodeVisible, setNodeVisible] = React.useState(Object.fromEntries(nodeVisibleMap));

  const [edgeColor, setEdgeColor] = React.useState(Object.fromEntries(edgeColorMap));
  const [edgeSelected, setEdgeSelected] = React.useState(Object.fromEntries(edgeSelectMap));
  const [edgeVisible, setEdgeVisible] = React.useState(Object.fromEntries(edgeVisibleMap));

  // colorpalette - selected by user / node by node degree / edge by edge size
  const getColorChange = (datatype, uid, color) => {
    if(datatype === "node"){
      setNodeColor({...nodeColor, [uid]:color});
    }
    else{
      setEdgeColor({...edgeColor, [uid]:color});
    }
  }

  const getVisibilityChange = (datatype, uid, visibility) => {
    if(datatype === "node"){
      setNodeVisible({...nodeVisible, [uid]:visibility});
    }
    else{
      setEdgeVisible({...edgeVisible, [uid]:visibility});
    }
  }

  const getSelectedChange = (datatype, uid, selected ) => {
    if(datatype === "node"){
      setNodeSelected({...nodeSelected, [uid]:selected});
    }
    else{
      setEdgeSelected({...edgeSelected, [uid]:selected});
    }
  }

  const [selectAllEl, setSelectAllEl] = React.useState(true);

  const getSelectAll = (type, value) => {
    if(type === "node"){
      if(value){
        setNodeSelected(Object.fromEntries(nodeSelectMap));
      }
      else{
        setNodeSelected(Object.fromEntries(noNodeSelectMap));
      }
    }
    else{
      if(value){
        setEdgeSelected(Object.fromEntries(edgeSelectMap));
      }
      else{
        setEdgeSelected(Object.fromEntries(noEdgeSelectMap));
      }
    }

  }

  const transNodeData = nodesData.map(x => {
    return {
      uid: x.uid,
      value: nodeDegList[x.uid],
      color: nodeColor[x.uid],
      selected: nodeSelected[x.uid],
      visible: nodeVisible[x.uid]
    }
  });


  const transEdgeData = edges.map(x => {
    return {
      uid: x.uid.toString(),
      value: edgeSizeList[x.uid.toString()],
      color: edgeColor[x.uid.toString()],
      selected: edgeSelected[x.uid.toString()],
      visible: edgeVisible[x.uid.toString()]
    }
  })

  return <div>
    <LoadTable
      type={"node"}
      data={transNodeData}
      sendColorToMain={getColorChange}
      sendVisibilityToMain={getVisibilityChange}
      sendSelectedToMain={getSelectedChange}
      sendSelectAll={getSelectAll}
    />

    <LoadTable
      type={"edge"}
      data={transEdgeData}
      sendColorToMain={getColorChange}
      sendVisibilityToMain={getVisibilityChange}
      sendSelectedToMain={getSelectedChange}
      sendSelectAll={getSelectAll}
    />
  </div>

}

export default Main
