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
import { hexToHsv, rgbToHex, getNodeDegree, getEdgeSize, getValueFreq, accordianStyles } from './functions.js';
import Toolbar from "./toolbar";
import Switches from "./switches";

const createDefaultState = (data, defaultValue) => {
  const mapObj = new Map();
  data.map(d => mapObj.set(d.uid.toString(), defaultValue));
  return Object.fromEntries(mapObj)
}

// console.log(hexToHsv('#000000ff'));
const Widget = ({ nodes, edges, ...props }) => {
  // console.log("props", props);
  const classes = accordianStyles();

  const nodeDegMap = new Map();
  nodes.map(x => nodeDegMap.set(x.uid, getNodeDegree(nodes, edges, x.uid)));
  const nodeDegList = Object.fromEntries(nodeDegMap);

  const edgeSizeMap = new Map();
  edges.map((x, i) => edgeSizeMap.set(x.uid.toString(), getEdgeSize(nodes, edges, i)));
  const edgeSizeList = Object.fromEntries(edgeSizeMap);

  const [withNodeLabels, setWithNodeLabels] = React.useState(true);
  const [withEdgeLabels, setWithEdgeLabels] = React.useState(true);
  const [collapseNodes, setCollapseNodes] = React.useState(false);
  const [bipartite, setBipartite] = React.useState(false);

  const [nodeFill, setNodeFill] = React.useState(props.nodeFill || createDefaultState(nodes, "#000000ff"));
  const [selectedNodes, setSelectedNodes] = React.useState({});
  const [hiddenNodes, setHiddenNodes] = React.useState(props.nodeHidden || {});
  const [removedNodes, setRemovedNodes] = React.useState(props.nodeRemoved || {});

  const [edgeStroke, setEdgeStroke] = React.useState(props.edgeStroke || createDefaultState(edges, "#000000ff"));
  const [selectedEdges, setSelectedEdges] = React.useState({});
  const [hiddenEdges, setHiddenEdges] = React.useState(props.edgeHidden || {});
  const [removedEdges, setRemovedEdges] = React.useState(props.edgeRemoved || {});

  const [unpinned, setUnpinned] = React.useState(now());

  // update the python model with state
  const {_model} = props;


  if (_model !== undefined) {
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
      setNodeFill({...nodeFill, [uid]:rgbToHex(color)});
    }
    else{
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
        setSelectedNodes(createDefaultState(nodes, true));
      }
      else{
        setSelectedNodes(createDefaultState(nodes, false));
      }
    }
    else{
      if(value){
        setSelectedEdges(createDefaultState(edges, true));
      }
      else{
        setSelectedEdges(createDefaultState(edges, false));
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

  // const [navOpen, setNavOpen] = React.useState(false);
  // const toggleNav = () => {
  //   setNavOpen(!navOpen);
  // }

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
      color: edgeStroke[x.uid.toString()],
      selected: selectedEdges[x.uid.toString()],
      hidden: hiddenEdges[x.uid.toString()],
      removed: removedEdges[x.uid.toString()]
    }
  })

  const [colGroup, setColGroup] = React.useState({node: "degree/size", edge: "degree/size"});
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
      if(data !== undefined){
        Object.entries(createDefaultState(nodes, false)).map(d => {
          if(d[0] === data.data.uid){
            newNodeSelect.set(d[0], true)
          }
        })
        setSelectedNodes(Object.fromEntries(newNodeSelect));
      }
      else{
        setSelectedNodes({});
      }
    }
  }

  const getClickedEdges = (event, data) => {
    const newEdgeSelect = new Map();
    if(event.shiftKey){
      setSelectedEdges({...selectedEdges, [data.uid]: !selectedEdges[data.uid]});
    }
    else{
      if(data !== undefined){
        Object.entries(createDefaultState(edges, false)).map(d => {
          if(d[0] === data.uid){
            newEdgeSelect.set(d[0], true)
          }
        })
        setSelectedEdges(Object.fromEntries(newEdgeSelect));
      }
      else{
        setSelectedEdges({});
      }
    }
  }

  const handleOriginal = (type) => {
    if(type === 'node'){
      setSelectedNodes({});
      setHiddenNodes({});
      setRemovedNodes({});
    }
    else{
      setSelectedEdges({});
      setHiddenEdges({});
      setRemovedEdges({});
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
      // setSelectedNodes(Object.fromEntries(noNodeSelectMap));
    }
    else{
      setRemovedEdges(selectedEdges);
      // setSelectedEdges(Object.fromEntries(noEdgeSelectMap));
    }
  }

  const handleOtherSelect = (type) => {
    let nodeToSelect = new Map(Object.entries(createDefaultState(nodes, false)));
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
      let edgeToSelect = new Map(Object.entries(createDefaultState(edges, false)));
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
        setSelectedNodes(createDefaultState(nodes, true));
      }
      else{
        setSelectedEdges(createDefaultState(edges, true));

      }
    }
    else if(selectionType === "none"){
      if(dataType === "node"){
        setSelectedNodes({});
      }
      else{
        setSelectedEdges({});
      }
    }
    else if(selectionType === "unpin"){
      setUnpinned(now());
    }
    else if(selectionType === "reverse"){
      if(dataType === "node"){
        const currSelectedNodes = {...selectedNodes};
        const uids = nodes.map(d => d.uid);
        uids.map(d => {
          currSelectedNodes[d] = !currSelectedNodes[d];
        })
        setSelectedNodes(currSelectedNodes);
      }
      else{
        const currSelectedEdges = {...selectedEdges};
        const uids = edges.map(d => d.uid.toString());
        uids.map(d => {
          currSelectedEdges[d] = !currSelectedEdges[d];
        })
        setSelectedEdges(currSelectedEdges);
      }
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

  return <div>
    <Grid container spacing={1}>
      <Grid item xs={12} sm={4} >
        {/*<div className="colorSetting" style={{ justifyContent: !navOpen ? "flex-start" : "flex-end", }}>*/}
        {/*  <div>*/}
        {/*    <Button style={{justifyContent: !navOpen ? "flex-start": "flex-end"}} color="primary" onClick={() => toggleNav()}>*/}
        {/*      {!navOpen ? <ArrowForwardIos style={{fontSize: "20px"}} /> : <ArrowBackIos style={{fontSize: "20px"}}/>}*/}
        {/*    </Button>*/}
        {/*  </div>*/}
        {/*</div>*/}
          <div className={classes.root}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon style={{fontSize: "20px"}} />} >
                <Typography style={{fontSize: "14px", fontWeight: "bold"}}>{"Nodes" + " (" +  String(nodes.length) + ")"}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div style={{width: "100%"}}>
                  <Toolbar dataType={"node"} selectionState={selectedNodes} onSelectionChange={handleToolbarSelection}/>

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
                  <ColorPalette type={"node"} data={nodeDegList} defaultColors={props.nodeFill || createDefaultState(nodes, "#000000ff")}
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
                  <Toolbar dataType={"edge"} selectionState={selectedEdges} onSelectionChange={handleToolbarSelection}/>
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
                  <ColorPalette type={"edge"} data={edgeSizeList} defaultColors={props.edgeStroke || createDefaultState(edges, "#000000ff")}
                                onPaletteChange={handlePaletteChange}
                                currGroup={colGroup.edge} currPalette={colPalette.edge} onCurrDataChange={handleCurrData}
                  />
                  <Switches dataType={"edge"} onSwitchChange={handleSwitch}/>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
    </Grid>

    <Grid item xs={12}  sm={8}>
    {/*<Grid item xs={12} sm={navOpen && 8}>*/}
    {/*  <div>*/}
    {/*    <div style={{ display: "flex", justifyContent: "flex-start", flexFlow: "row wrap"}}>*/}
    {/*        <Toolbar dataType={"node"} selectionState={selectedNodes} onSelectionChange={handleToolbarSelection}/>*/}
    {/*        <Toolbar dataType={"edge"} selectionState={selectedEdges} onSelectionChange={handleToolbarSelection}/>*/}
    {/*    </div>*/}
      {/*</div>*/}

      <HypernetxWidgetView
        {...props}
        {...{nodes, edges, nodeFill, selectedNodes, hiddenNodes, removedNodes, edgeStroke, selectedEdges, hiddenEdges, removedEdges,
          withNodeLabels, withEdgeLabels, collapseNodes, bipartite, unpinned}}
        onClickNodes={getClickedNodes} onClickEdges={getClickedEdges}
        />
    </Grid>
  </Grid>

</div>

}

export default Widget
