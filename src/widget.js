import React from 'react';
import Grid from '@material-ui/core/Grid';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import { ArrowForwardIos, ArrowBackIos } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import {HypernetxWidgetView} from './HypernetxWidgetView';
import ColorPalette  from './colorPalette.js';
import LoadTable from './loadTable.js';
import Bars from './bars.js';
import ShowButton from './showButton.js';
import { getRGB, rgbToHex, getNodeDegree, getEdgeSize, getValueFreq, accordianStyles } from './functions.js';

const Widget = ({ nodes, edges, ...props }) => {

  const classes = accordianStyles();

  const nodeDegMap = new Map();
  nodes.map(x => nodeDegMap.set(x.uid, getNodeDegree(nodes, edges, x.uid)));
  const nodeDegList = Object.fromEntries(nodeDegMap);

  const edgeSizeMap = new Map();
  edges.map((x, i) => edgeSizeMap.set(x.uid.toString(), getEdgeSize(nodes, edges, i)));
  const edgeSizeList = Object.fromEntries(edgeSizeMap);

  const nodeColorMap = new Map();
  nodes.map(x => nodeColorMap.set(x.uid, "rgba(0, 0, 0, 0.6)"));
  const edgeColorMap = new Map();
  edges.map(x => edgeColorMap.set(x.uid.toString(), "rgba(0, 0, 0, 1)"));

  // const nodeVisibleMap = new Map();
  // nodes.map(x => nodeVisibleMap.set(x.uid, true));

  const nodeHiddenMap = new Map();
  nodes.map(x => nodeHiddenMap.set(x.uid, false));
  const edgeHiddenMap = new Map();
  edges.map(x => edgeHiddenMap.set(x.uid.toString(), false));
  // const edgeVisibleMap = new Map();
  // edges.map(x => edgeVisibleMap.set(x.uid.toString(), true));


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

  const [nodeFill, setNodeFill] = React.useState(Object.fromEntries(nodeColorMap));
  const [selectedNodes, setSelectedNodes] = React.useState(Object.fromEntries(nodeSelectMap));
  // const [nodeVisible, setNodeVisible] = React.useState(Object.fromEntries(nodeVisibleMap));
  const [hiddenNodes, setHiddenNodes] = React.useState(Object.fromEntries(nodeHiddenMap));
  const [removedNodes, setRemovedNodes] = React.useState(Object.fromEntries(nodeRemovedMap));

  const [edgeStroke, setEdgeStroke] = React.useState(Object.fromEntries(edgeColorMap));
  const [selectedEdges, setSelectedEdges] = React.useState(Object.fromEntries(edgeSelectMap));
  // const [edgeVisible, setEdgeVisible] = React.useState(Object.fromEntries(edgeVisibleMap));
  const [hiddenEdges, setHiddenEdges] = React.useState(Object.fromEntries(edgeHiddenMap));
  const [removedEdges, setRemovedEdges] = React.useState(Object.fromEntries(edgeRemovedMap));

  const getColorChange = (datatype, uid, color) => {
    if(datatype === "node"){
      setNodeFill({...nodeFill, [uid]:`rgba(${ color.r }, ${ color.g }, ${ color.b }, ${ color.a })`});
    }
    else{
      setEdgeStroke({...edgeStroke, [uid]:`rgba(${ color.r }, ${ color.g }, ${ color.b }, ${ color.a })`});
    }
  }

  const getVisibilityChange = (datatype, uid, visibility) => {
    if(datatype === "node"){
      // setNodeVisible({...nodeVisible, [uid]:visibility});
      setHiddenNodes({...hiddenNodes, [uid]:!visibility});
    }
    else{
      setHiddenEdges({...hiddenEdges, [uid]:!visibility});
    }
  }

  const getSelectedChange = (datatype, uid, selected ) => {
    if(datatype === "node"){
      setSelectedNodes({...selectedNodes, [uid]:selected});
    }
    else{
      setSelectedEdges({...selectedEdges, [uid]:selected});
    }
  }

  const getRemovedChange = (datatype, uid, removed) => {
    if(datatype === "node"){
      setRemovedNodes({...removedNodes, [uid]:removed});
    }
    else{
      setRemovedEdges({...removedEdges, [uid]:removed});
    }
  }
  console.log(removedNodes);

  const getSelectAll = (type, value) => {
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

  const getHoverValue = (value, datatype) => {
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

  const nodeLineColMap = new Map();
  nodes.map(x => nodeLineColMap.set(x.uid, "rgba(255, 255, 255, 1)"));

  const [nodeStroke, setNodeStroke] = React.useState(Object.fromEntries(nodeLineColMap));

  const [nodeStrokeWidth, setNodeStrokeWidth] = React.useState(Object.fromEntries(nodeWidthMap));
  const [edgeStrokeWidth, setEdgeStrokeWidth] = React.useState(Object.fromEntries(edgeWidthMap));
  const [currNodeButton, setCurrNodeButton] = React.useState("default");
  const [currEdgeButton, setCurrEdgeButton] = React.useState("default");

  const getButton = (type, value) => {
    if(type === "node"){
      const nodeSelectedBar = new Map();
      const nodeHiddenBar = new Map();
      const nodeSelectLine = new Map();
      const nodeHiddenLine = new Map();
      setCurrNodeButton(value);
      Object.entries(selectedNodes).map(x => {
        if(x[1]){
          nodeSelectedBar.set(x[0], 2);
          nodeHiddenBar.set(x[0], 1);
          nodeSelectLine.set(x[0], "rgba(0, 0, 0, 1)");
          nodeHiddenLine.set(x[0], "rgba(255, 255, 255, 1)");
        }
        else{
          nodeSelectedBar.set(x[0], 1);
          nodeHiddenBar.set(x[0], 2);
          nodeSelectLine.set(x[0], "rgba(255, 255, 255, 1)");
          nodeHiddenLine.set(x[0], "rgba(0, 0, 0, 1)");
        }
      })
      if(value === "selected"){
        setNodeStrokeWidth(Object.fromEntries(nodeSelectedBar));
        setNodeStroke(Object.fromEntries(nodeSelectLine));
      }
      else if(value === "hidden"){
        setNodeStrokeWidth(Object.fromEntries(nodeHiddenBar));
        setNodeStroke(Object.fromEntries(nodeHiddenLine));
      }
      else{
        setNodeStrokeWidth(Object.fromEntries(nodeWidthMap));
        setNodeStroke(Object.fromEntries(nodeLineColMap));
      }
    }
    else{
      const edgeSelectedBar = new Map();
      const edgeHiddenBar = new Map();
      setCurrEdgeButton(value);
      Object.entries(edgeSelected).map(x => {
        if(x[1]){
          edgeSelectedBar.set(x[0], 3);
          edgeHiddenBar.set(x[0], 1.5);
        }
        else{
          edgeSelectedBar.set(x[0], 1.5);
          edgeHiddenBar.set(x[0], 3);
        }
      })
      if(value === "selected"){
        setEdgeStrokeWidth(Object.fromEntries(edgeSelectedBar));
      }
      else if(value === "hidden"){
        setEdgeStrokeWidth(Object.fromEntries(edgeHiddenBar));
      }
      else{
        setEdgeStrokeWidth(Object.fromEntries(edgeWidthMap));
      }
    }
  }

  const transNodeData = nodes.map(x => {
    return {
      uid: x.uid,
      value: nodeDegList[x.uid],
      color:  {"r": getRGB(nodeFill[x.uid])[0], "g":getRGB(nodeFill[x.uid])[1], "b":getRGB(nodeFill[x.uid])[2], "a":getRGB(nodeFill[x.uid])[3]},
      selected: selectedNodes[x.uid],
      hidden: hiddenNodes[x.uid],
      removed: removedNodes[x.uid],
    }
  });

  const transEdgeData = edges.map(x => {
    return {
      uid: x.uid.toString(),
      value: edgeSizeList[x.uid.toString()],
      color: {"r": getRGB(edgeStroke[x.uid.toString()])[0], "g":getRGB(edgeStroke[x.uid.toString()])[1], "b":getRGB(edgeStroke[x.uid.toString()])[2], "a":getRGB(edgeStroke[x.uid.toString()])[3]},
      selected: selectedEdges[x.uid.toString()],
      hidden: hiddenEdges[x.uid.toString()],
      removed: removedEdges[x.uid.toString()]
    }
  })

  const convertedData = function(data){
    const copy = {...data};
    Object.values(copy).forEach(val => {
      val["color"] = rgbToHex(parseInt(val.color.r), parseInt(val.color.g), parseInt(val.color.b));
    });
    return Object.values(copy);
  }

  const getNodePalette = value => {
    setNodeFill(value);
  }
  const getEdgePalette = value => {
    setEdgeStroke(value);
  }
  const [colGroup, setColGroup] = React.useState("each");
  const [colPalette, setColPalette] = React.useState("black");
  const [colType, setColType] = React.useState("node");
  const getCurrData = (group, palette, type) => {
    setColGroup(group);
    setColPalette(palette);
    setColType(type);
  }

  const getClickedNodes = (uid, shift, type) => {
    if(shift && type === 'select'){
      setSelectedNodes({...selectedNodes, [uid]:true});
    }
    if(shift && type === 'deselect'){
      setSelectedNodes({...selectedNodes, [uid]:false});
    }
  }

  const getClickedEdges = (uid, shift) => {
    if(shift){
      setSelectedEdges({...selectedEdges, [uid]: true});
    }
  }

  return <div>
    <Grid container spacing={1}>

    <Grid item xs={12} sm={!navOpen ? 1 : 4}>
      <div className="colorSetting" style={{justifyContent: !navOpen ? "flex-start" : "flex-end"}}>
        <div>
          <Button style={{justifyContent: !navOpen ? "flex-start": "flex-end"}} color="primary" onClick={() => toggleNav()}>{!navOpen ? <ArrowForwardIos style={{fontSize: "20px"}} /> : <ArrowBackIos style={{fontSize: "20px"}}/>}</Button></div>
        </div>
        {navOpen ? <div className={classes.root}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon style={{fontSize: "20px"}} />} >
              <Typography style={{fontSize: "14px", fontWeight: "bold"}}>{"Key Statistics - Nodes" + " (" +  String(nodes.length) + ")"}</Typography>
            </AccordionSummary>
            <AccordionDetails>
            <div style={{width: "100%"}}>
              <LoadTable
                type={"node"}
                data={convertedData(transNodeData)}
                sendColorToMain={getColorChange}
                sendVisibilityToMain={getVisibilityChange}
                sendSelectedToMain={getSelectedChange}
                onRemovedChange={getRemovedChange}
                sendSelectAll={getSelectAll}
              />
              <ShowButton type={"node"} sendButton={getButton} currButton={currNodeButton}/>
              <Bars type={"node"} freqData={getValueFreq(nodeDegList)} sendValue={getHoverValue}/>
            </div>

            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon style={{fontSize: "20px"}} />} >
              <Typography style={{fontSize: "14px", fontWeight: "bold"}}>{"Key Statistics - Edges" + " (" +  String(edges.length) + ")"}</Typography>
            </AccordionSummary>
            <AccordionDetails>
            <div style={{width: "100%"}}>
              <LoadTable
                type={"edge"}
                data={convertedData(transEdgeData)}
                sendColorToMain={getColorChange}
                sendVisibilityToMain={getVisibilityChange}
                sendSelectedToMain={getSelectedChange}
                onRemovedChange={getRemovedChange}
                sendSelectAll={getSelectAll}
              />
              <ShowButton type={"edge"} sendButton={getButton} currButton={currEdgeButton}/>
              <Bars type={"edge"} freqData={getValueFreq(edgeSizeList)} sendValue={getHoverValue}/>
            </div>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon style={{fontSize: "20px"}}/>} >
              <Typography style={{fontSize: "14px", fontWeight: "bold"}}>Color</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{width: "100%"}}>
                <ColorPalette nodeData={nodeDegList} edgeData={edgeSizeList}
                sendNodePalette={getNodePalette} sendEdgePalette={getEdgePalette}
                currGroup={colGroup} currPalette={colPalette} currType={colType} sendCurrData={getCurrData}
                />
              </div>
            </AccordionDetails>
          </Accordion>
        </div> : null }
  </Grid>

  <Grid item xs={12} sm={!navOpen ? 11 : 8}>
    <HypernetxWidgetView
      {...props}
      {...{nodes, edges, nodeFill, nodeStroke, nodeStrokeWidth, selectedNodes, hiddenNodes, edgeStroke, selectedEdges, hiddenEdges}}
      onClickNodes={getClickedNodes} onClickEdges={getClickedEdges}
      />
  </Grid>
  </Grid>

</div>

}

export default Widget
