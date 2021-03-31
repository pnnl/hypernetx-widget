import React from 'react';
import Grid from '@material-ui/core/Grid';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import { ArrowForwardIos, ArrowBackIos } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import {HypernetxWidgetView, now} from './HypernetxWidgetView';
import ColorPalette  from './colorPalette.js';
import LoadTable from './loadTable.js';
import Bars from './bars.js';
import { getRGB, rgbToHex, getNodeDegree, getEdgeSize, getValueFreq, accordianStyles } from './functions.js';
import Toolbar from "./toolbar";
import Switches from "./switches";

const Widget = ({ nodes, edges, ...props }) => {
  // console.log("props", props);
  const classes = accordianStyles();

  const nodeDegMap = new Map();
  nodes.map(x => nodeDegMap.set(x.uid, getNodeDegree(nodes, edges, x.uid)));
  const nodeDegList = Object.fromEntries(nodeDegMap);

  const edgeSizeMap = new Map();
  edges.map((x, i) => edgeSizeMap.set(x.uid.toString(), getEdgeSize(nodes, edges, i)));
  const edgeSizeList = Object.fromEntries(edgeSizeMap);

  const nodeColorMap = new Map();
  nodes.map(x => nodeColorMap.set(x.uid,"#000000ff"));
  const edgeColorMap = new Map();
  edges.map(x => edgeColorMap.set(x.uid.toString(), "#000000ff"));

  const nodeHiddenMap = new Map();
  nodes.map(x => nodeHiddenMap.set(x.uid, false));
  const edgeHiddenMap = new Map();
  edges.map(x => edgeHiddenMap.set(x.uid.toString(), false));

  const nodeSelectMap = new Map();
  nodes.map(x => nodeSelectMap.set(x.uid, true));
  const edgeSelectMap = new Map();
  edges.map(x => edgeSelectMap.set(x.uid.toString(), true));

  const noNodeSelectMap = new Map();
  nodes.map(x => noNodeSelectMap.set(x.uid, false));
  const noEdgeSelectMap = new Map();
  edges.map(x => noEdgeSelectMap.set(x.uid.toString(), false));

  const nodeRemovedMap = new Map();
  nodes.map(x => nodeRemovedMap.set(x.uid, false));
  const edgeRemovedMap = new Map();
  edges.map(x => edgeRemovedMap.set(x.uid.toString(), false));

  const nodesInEdgesMap = new Map();
  nodes.map(x => nodesInEdgesMap.set(x.uid, false));

  const edgesInNodesMap = new Map();
  edges.map(x => edgesInNodesMap.set(x.uid.toString(), false));

  const [withNodeLabels, setWithNodeLabels] = React.useState(true);
  const [withEdgeLabels, setWithEdgeLabels] = React.useState(true);
  const [collapseNodes, setCollapseNodes] = React.useState(false);
  const [bipartite, setBipartite] = React.useState(false);

  const [nodeFill, setNodeFill] = React.useState(props.nodeFill || Object.fromEntries(nodeColorMap));
  const [selectedNodes, setSelectedNodes] = React.useState(Object.fromEntries(noNodeSelectMap));
  const [tempSelectedNodes, setTempSelectedNodes] = React.useState({});
  const [hiddenNodes, setHiddenNodes] = React.useState(props.nodeHidden || Object.fromEntries(nodeHiddenMap));
  const [removedNodes, setRemovedNodes] = React.useState(props.nodeRemoved || Object.fromEntries(nodeRemovedMap));

  const [edgeStroke, setEdgeStroke] = React.useState(props.edgeStroke || Object.fromEntries(edgeColorMap));
  const [selectedEdges, setSelectedEdges] = React.useState(Object.fromEntries(noEdgeSelectMap));
  const [hiddenEdges, setHiddenEdges] = React.useState(props.edgeHidden || Object.fromEntries(edgeHiddenMap));
  const [removedEdges, setRemovedEdges] = React.useState(props.edgeRemoved || Object.fromEntries(edgeRemovedMap));

  const [unpinned, setUnpinned] = React.useState(now());

  // update the python model with state
  const {_model} = props;


  if (_model !== undefined) {
    const nodeHex = new Map(Object.entries(nodeFill));
    nodeHex.forEach((value, key) =>
      nodeHex.set(key, rgbToHex(value))
    );

    const edgeHex = new Map(Object.entries(edgeStroke));
    edgeHex.forEach((value, key) =>
      edgeHex.set(key, rgbToHex(value))
    );

    _model.set('node_fill', nodeFill);
    _model.set('edge_stroke', edgeStroke);
    _model.set('selected_nodes', selectedNodes);
    _model.set('selected_edges', selectedEdges);
    _model.set('hidden_nodes', hiddenNodes);
    _model.set('hidden_edges', hiddenEdges);
    _model.set('removed_nodes', removedNodes);
    _model.set('removed_edges', removedEdges)

    _model.save();
  }


  const handleColorChange = (datatype, uid, color) => {
    if(datatype === "node"){
      // setNodeFill({...nodeFill, [uid]:`rgba(${ color.r }, ${ color.g }, ${ color.b }, ${ color.a })`});
      // setNodeFill({...nodeFill, [uid]:color});
      setNodeFill({...nodeFill, [uid]:rgbToHex(color)});
    }
    else{
      // setEdgeStroke({...edgeStroke, [uid]:`rgba(${ color.r }, ${ color.g }, ${ color.b }, ${ color.a })`});
      setEdgeStroke({...edgeStroke, [uid]:rgbToHex(color)})
    }
  }

  const handleVisibilityChange = (datatype, uid, visibility) => {
    if(datatype === "node"){
      setHiddenNodes({...hiddenNodes, [uid]:!visibility});
    }
    else{
      setHiddenEdges({...hiddenEdges, [uid]:!visibility});
    }
  }

  const handleSelectedChange = (datatype, uid, selected ) => {
    if(datatype === "node"){
      setSelectedNodes({...selectedNodes, [uid]:selected});
      setTempSelectedNodes({...tempSelectedNodes, [uid]:selected});
    }
    else{
      setSelectedEdges({...selectedEdges, [uid]:selected});
    }
  }


  const handleRemovedChange = (datatype, uid, removed) => {
    if(datatype === "node"){
      setRemovedNodes({...removedNodes, [uid]:removed});
    }
    else{
      setRemovedEdges({...removedEdges, [uid]:removed});
    }
  }

  const handleSelectAll = (type, value) => {
    if(type === "node"){
      if(value){
        setSelectedNodes(Object.fromEntries(nodeSelectMap));
      }
      else{
        setSelectedNodes(Object.fromEntries(noNodeSelectMap));
      }
    }
    else{
      if(value){
        setSelectedEdges(Object.fromEntries(edgeSelectMap));
      }
      else{
        setSelectedEdges(Object.fromEntries(noEdgeSelectMap));
      }
    }
  }

  const handleBarSelect = (value, datatype) => {
    if(datatype === "node"){
      const nodesOnBarMap = new Map();
      nodes.map(x => nodesOnBarMap.set(x.uid, false));
      Object.entries(nodeDegList).map(uidDeg => {
        value.map(v => {
          if(uidDeg[1] === v){
            nodesOnBarMap.set(uidDeg[0], true);
          }
        })
      })
      setSelectedNodes(Object.fromEntries(nodesOnBarMap));
    }

    else if(datatype === "edge"){
      const edgesOnBarMap = new Map();
      edges.map(x => edgesOnBarMap.set(x.uid.toString(), false));
      Object.entries(edgeSizeList).map(uidSize => {
        value.map(v => {
          if(uidSize[1] === v){
            edgesOnBarMap.set(uidSize[0], true);
          }
        })
      })
      setSelectedEdges(Object.fromEntries(edgesOnBarMap));
    }
  }

  const [navOpen, setNavOpen] = React.useState(false);
  const toggleNav = () => {
    setNavOpen(!navOpen);
  }

  const nodeWidthMap = new Map();
  nodes.map(x => nodeWidthMap.set(x.uid, 1));

  const edgeWidthMap = new Map();
  edges.map(x => edgeWidthMap.set(x.uid.toString(), 1.5));

  const transNodeData = nodes.map(x => {
    return {
      uid: x.uid,
      value: nodeDegList[x.uid],
      // color:  {"r": getRGB(nodeFill[x.uid])[0], "g":getRGB(nodeFill[x.uid])[1], "b":getRGB(nodeFill[x.uid])[2], "a":getRGB(nodeFill[x.uid])[3]},
      color: nodeFill[x.uid],
      selected: selectedNodes[x.uid],
      hidden: hiddenNodes[x.uid],
      removed: removedNodes[x.uid],
    }
  });

  const transEdgeData = edges.map(x => {
    return {
      uid: x.uid.toString(),
      value: edgeSizeList[x.uid.toString()],
      // color: {"r": getRGB(edgeStroke[x.uid.toString()])[0], "g":getRGB(edgeStroke[x.uid.toString()])[1], "b":getRGB(edgeStroke[x.uid.toString()])[2], "a":getRGB(edgeStroke[x.uid.toString()])[3]},
      color: edgeStroke[x.uid.toString()],
      selected: selectedEdges[x.uid.toString()],
      hidden: hiddenEdges[x.uid.toString()],
      removed: removedEdges[x.uid.toString()]
    }
  })

  // const convertData = data => {
  //   const copy = {...data};
  //   Object.values(copy).forEach(val => {
  //     console.log(val.color, "here");
  //     // val["color"] = rgbToHex(parseInt(val.color.r), parseInt(val.color.g), parseInt(val.color.b));
  //     val["color"] = rgbToHex(val.color.toString());
  //     console.log(val, val.color.toString())
  //     // console.log(rgbToHex(val.color.toString()))
  //   });
  //   return Object.values(copy);
  // }

  const [colGroup, setColGroup] = React.useState({node: "each", edge: "each"});
  const [colPalette, setColPalette] = React.useState({node: "default", edge: "default"});
  // const [colType, setColType] = React.useState("node");
  const handleCurrData = (group, palette, dataType) => {
    setColGroup({...colGroup, [dataType]:group});
    setColPalette({...colPalette, [dataType]: palette});
    // setColType(type);
  }

  const getClickedNodes = (event, data) => {
    const newNodeSelect = new Map();
    if(event.shiftKey){
      setSelectedNodes({...selectedNodes, [data.data.uid]: !selectedNodes[data.data.uid]});
    }
    else{
      Array.from(noNodeSelectMap).map(d => {
        if(d[0] === data.data.uid){
          newNodeSelect.set(d[0], true)
        }
        else{
          newNodeSelect.set(d[0], false)
        }
      })
      setSelectedNodes(Object.fromEntries(newNodeSelect));
    }
  }

  const getClickedEdges = (event, data) => {
    const newEdgeSelect = new Map();
    if(event.shiftKey){
      setSelectedEdges({...selectedEdges, [data.uid]: !selectedEdges[data.uid]});
    }
    else{
      Array.from(noEdgeSelectMap).map(d => {
        if(d[0] === data.uid){
          newEdgeSelect.set(d[0], true)
        }
        else{
          newEdgeSelect.set(d[0], false)
        }
      })
      setSelectedEdges(Object.fromEntries(newEdgeSelect));
    }
  }

  const handleOriginal = (type) => {
    if(type === 'node'){
      setSelectedNodes(Object.fromEntries(noNodeSelectMap));
      setHiddenNodes(Object.fromEntries(nodeHiddenMap));
      setRemovedNodes(Object.fromEntries(nodeRemovedMap));
    }
    else{
      setSelectedEdges(Object.fromEntries(noEdgeSelectMap))
      setHiddenEdges(Object.fromEntries(edgeHiddenMap));
      setRemovedEdges(Object.fromEntries(edgeRemovedMap));
    }
  }

  const handleHideSelected = (type) => {
    if(type === 'node'){
      setHiddenNodes(selectedNodes);
    }
    else{
      setHiddenEdges(selectedEdges);
    }
  }

  const handleRemoveSelected = (type) => {
    if(type === 'node'){
      setRemovedNodes(selectedNodes);
      setSelectedNodes(Object.fromEntries(noNodeSelectMap));
    }
    else{
      setRemovedEdges(selectedEdges);
      setSelectedEdges(Object.fromEntries(noEdgeSelectMap));
    }
  }

  const handleOtherSelect = (type) => {
    let nodeToSelect = new Map(nodesInEdgesMap);
    if(type === "nodes in edges"){
      Object.entries(selectedEdges).map(d => {
        edges.map(e => {
          if(d[1] && d[0] === e.uid){
            e.elements.map(x => nodeToSelect.set(x, true))
          }
        })
      })
      setSelectedNodes(Object.fromEntries(nodeToSelect));
    }
    else{
      let edgeToSelect = new Map(edgesInNodesMap);
      Object.entries(selectedNodes).map(d => {
        edges.map(e => {
          if(d[1] && e.elements.includes(d[0])){
            edgeToSelect.set(e.uid.toString(), true);
          }
        })
      })
      setSelectedEdges(Object.fromEntries(edgeToSelect));
    }
  }

  const handleToolbarSelection = (dataType, selectionType) => {
    if(selectionType === "hidden"){
      handleHideSelected(dataType);
    }
    else if(selectionType === "removed"){
      handleRemoveSelected(dataType);
    }
    else if(selectionType === "other"){
      if(dataType === "node"){
        handleOtherSelect("edges in nodes");
      }
      else{
        handleOtherSelect("nodes in edges");
      }
    }
    else if(selectionType === "all"){
      if(dataType === "node"){
        setSelectedNodes(Object.fromEntries(nodeSelectMap))
      }
      else{
        setSelectedEdges(Object.fromEntries(edgeSelectMap));
      }
    }
    else if(selectionType === "none"){
      if(dataType === "node"){
        setSelectedNodes(Object.fromEntries(noNodeSelectMap));
      }
      else{
        setSelectedEdges(Object.fromEntries(noEdgeSelectMap));
      }
    }
    else if(selectionType === "unpin"){
      setUnpinned(now());
    }
    else{
      handleOriginal(dataType);
    }
  }

  const handleSwitch = (dataType, states) => {
    if(dataType === "node"){
      setWithNodeLabels(states.showLabels);
      setCollapseNodes(states.collapseNodes);
    }
    else{
      setWithEdgeLabels(states.showLabels);
      setBipartite(states.bipartite);
    }
  }

  const handlePaletteChange = (dataType, newPalette) => {
    if(dataType === "node"){
      setNodeFill(newPalette);
    }
    else{
      setEdgeStroke(newPalette);
    }
  }

  const handleAllColorChange = (color, type) => {
    const singleColorMap = new Map();
    if(type === 'node'){
      Object.keys({...nodeFill}).map(d => singleColorMap.set(d, color));
      setNodeFill(Object.fromEntries(singleColorMap));
    }
    else{
      Object.keys({...edgeStroke}).map(d => singleColorMap.set(d, color));
      setEdgeStroke(Object.fromEntries(singleColorMap));
    }
  }


    // console.log(transNodeData);
  console.log(tempSelectedNodes, "try");

  return <div>
    <Grid container spacing={1}>
      <Grid item xs={12} sm={!navOpen ? 1 : 4} >
        <div className="colorSetting" style={{ justifyContent: !navOpen ? "flex-start" : "flex-end", }}>
          <div>
            <Button style={{justifyContent: !navOpen ? "flex-start": "flex-end"}} color="primary" onClick={() => toggleNav()}>
              {!navOpen ? <ArrowForwardIos style={{fontSize: "20px"}} /> : <ArrowBackIos style={{fontSize: "20px"}}/>}
            </Button>
          </div>
          </div>
          {navOpen ? <div className={classes.root}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon style={{fontSize: "20px"}} />} >
                <Typography style={{fontSize: "14px", fontWeight: "bold"}}>{"Nodes" + " (" +  String(nodes.length) + ")"}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div style={{width: "100%"}}>
                  <LoadTable
                    type={"node"}
                    data={transNodeData}
                    onColorChange={handleColorChange}
                    onVisibleChange={handleVisibilityChange}
                    onSelectedChange={handleSelectedChange}
                    onRemovedChange={handleRemovedChange}
                    onSelectAllChange={handleSelectAll}
                    onAllColorChange={handleAllColorChange}
                  />
                  <Bars type={"node"} freqData={getValueFreq(nodeDegList)} onValueChange={handleBarSelect} />
                  <ColorPalette type={"node"} data={nodeDegList} defaultColors={props.nodeFill || Object.fromEntries(nodeColorMap)}
                                onPaletteChange={handlePaletteChange}
                                currGroup={colGroup.node} currPalette={colPalette.node} onCurrDataChange={handleCurrData}
                  />
                  <Switches dataType={"node"} onSwitchChange={handleSwitch}/>
                </div>

              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon style={{fontSize: "20px"}} />} >
                <Typography style={{fontSize: "14px", fontWeight: "bold"}}>{"Edges" + " (" +  String(edges.length) + ")"}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div style={{width: "100%"}}>
                  <LoadTable
                    type={"edge"}
                    data={transEdgeData}
                    onColorChange={handleColorChange}
                    onVisibleChange={handleVisibilityChange}
                    onSelectedChange={handleSelectedChange}
                    onRemovedChange={handleRemovedChange}
                    onSelectAllChange={handleSelectAll}
                    onAllColorChange={handleAllColorChange}

                  />
                  <Bars type={"edge"} freqData={getValueFreq(edgeSizeList)} onValueChange={handleBarSelect}/>
                  <ColorPalette type={"edge"} data={edgeSizeList} defaultColors={props.edgeStroke || Object.fromEntries(edgeColorMap)}
                                onPaletteChange={handlePaletteChange}
                                currGroup={colGroup.edge} currPalette={colPalette.edge} onCurrDataChange={handleCurrData}
                  />
                  <Switches dataType={"edge"} onSwitchChange={handleSwitch}/>
                </div>
              </AccordionDetails>
            </Accordion>

            {/*<Accordion>*/}
            {/*  <AccordionSummary expandIcon={<ExpandMoreIcon style={{fontSize: "20px"}}/>} >*/}
            {/*    <Typography style={{fontSize: "14px", fontWeight: "bold"}}>Color</Typography>*/}
            {/*  </AccordionSummary>*/}
            {/*  <AccordionDetails>*/}
            {/*    <div style={{width: "100%"}}>*/}
            {/*      <ColorPalette nodeData={nodeDegList} edgeData={edgeSizeList}*/}
            {/*      onNodePaletteChange={palette => setNodeFill(palette)} onEdgePaletteChange={palette => setEdgeStroke(palette)}*/}
            {/*      currGroup={colGroup} currPalette={colPalette} currType={colType} onCurrDataChange={handleCurrData}*/}
            {/*      />*/}
            {/*    </div>*/}
            {/*  </AccordionDetails>*/}
            {/*</Accordion>*/}
          </div> : null }
    </Grid>

    <Grid item xs={12}  sm={!navOpen ? 11 : 8}>
    {/*<Grid item xs={12} sm={navOpen && 8}>*/}
    {/*  <div>*/}
        <div style={{ display: "flex", justifyContent: "flex-start", flexFlow: "row wrap"}}>
            <Toolbar dataType={"node"} selectionState={selectedNodes} onSelectionChange={handleToolbarSelection}/>
            <Toolbar dataType={"edge"} selectionState={selectedEdges} onSelectionChange={handleToolbarSelection}/>
        </div>
      {/*</div>*/}

      <HypernetxWidgetView
        {...props}
        {...{nodes, edges, nodeFill, selectedNodes, hiddenNodes, removedNodes, edgeStroke, selectedEdges, hiddenEdges, removedEdges,
          withNodeLabels, withEdgeLabels, collapseNodes, bipartite, unpinned, navOpen}}
        onClickNodes={getClickedNodes} onClickEdges={getClickedEdges}
        />
    </Grid>
  </Grid>

</div>

}

export default Widget
