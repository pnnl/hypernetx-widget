import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import { makeStyles } from "@material-ui/core/styles";
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

  const nodesData = nodes.map(x => x.elements).flat();

  const nodeDegMap = new Map();
  nodesData.map((x,i) => nodeDegMap.set(x.uid, getNodeDegree(nodes, edges, x.uid)));
  const nodeDegList = Object.fromEntries(nodeDegMap);

  const edgeSizeMap = new Map();
  edges.map((x, i) => edgeSizeMap.set(x.uid.toString(), getEdgeSize(nodes, edges, i)));
  const edgeSizeList = Object.fromEntries(edgeSizeMap);

  const nodeColorMap = new Map();
  nodesData.map(x => nodeColorMap.set(x.uid, "rgba(0, 0, 0, 0.6)"));

  const edgeColorMap = new Map();
  edges.map(x => edgeColorMap.set(x.uid.toString(), "rgba(0, 0, 0, 1)"));

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

  const getColorChange = (datatype, uid, color) => {
    if(datatype === "node"){
      setNodeColor({...nodeColor, [uid]:`rgba(${ color.r }, ${ color.g }, ${ color.b }, ${ color.a })`});
    }
    else{
      setEdgeColor({...edgeColor, [uid]:`rgba(${ color.r }, ${ color.g }, ${ color.b }, ${ color.a })`});
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

  const getHoverValue = (value, datatype) => {
    if(datatype === "node"){
      const nodesOnBarMap = new Map();
      nodesData.map(x => nodesOnBarMap.set(x.uid, false));

      Object.entries(nodeDegList).map((uidDeg, i) => {
        value.map(v => {
          if(uidDeg[1] === v){
            nodesOnBarMap.set(uidDeg[0], true);
          }
          // else{
          //   nodesOnBarMap.set(uidDeg[0], false);
          // }
        })

      })
      setNodeSelected(Object.fromEntries(nodesOnBarMap));
    }

    else if(datatype === "edge"){
      const edgesOnBarMap = new Map();
      edges.map(x => edgesOnBarMap.set(x.uid.toString(), false));

      // edges.map(x => noEdgeSelectMap.set(x.uid.toString(), false));
      Object.entries(edgeSizeList).map((uidSize, i) => {
        value.map(v => {
          if(uidSize[1] === v){
            edgesOnBarMap.set(uidSize[0], true);
          }
          // else{
          //   edgesOnBarMap.set(uidSize[0], false);
          // }
        })

      })
      setEdgeSelected(Object.fromEntries(edgesOnBarMap));
    }
  }

  const [navOpen, setNavOpen] = React.useState(false);
  const toggleNav = () => {
    setNavOpen(!navOpen);
  }


  const getChangedColors = (value, datatype) => {
    if(datatype === "node"){
      setNodeColor(value);
    }
    else{
      setEdgeColor(value);
    }
  }

  const nodeWidthMap = new Map();
  nodesData.map(x => nodeWidthMap.set(x.uid, 1));

  const edgeWidthMap = new Map();
  edges.map(x => edgeWidthMap.set(x.uid.toString(), 1.5));

  const nodeLineColMap = new Map();
  nodesData.map(x => nodeLineColMap.set(x.uid, "rgba(255, 255, 255, 1)"));

  const [nodeLineColor, setNodeLineColor] = React.useState(Object.fromEntries(nodeLineColMap));

  const [nodeWidth, setNodeWidth] = React.useState(Object.fromEntries(nodeWidthMap));
  const [edgeWidth, setEdgeWidth] = React.useState(Object.fromEntries(edgeWidthMap));
  const [currNodeButton, setCurrNodeButton] = React.useState("default");
  const [currEdgeButton, setCurrEdgeButton] = React.useState("default");

  const getButton = (type, value) => {
    if(type === "node"){
      const nodeSelectedBar = new Map();
      const nodeHiddenBar = new Map();
      const nodeSelectLine = new Map();
      const nodeHiddenLine = new Map();
      setCurrNodeButton(value);
      Object.entries(nodeSelected).map((x,i) => {
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
        setNodeWidth(Object.fromEntries(nodeSelectedBar));
        setNodeLineColor(Object.fromEntries(nodeSelectLine));
      }
      else if(value === "hidden"){
        setNodeWidth(Object.fromEntries(nodeHiddenBar));
        setNodeLineColor(Object.fromEntries(nodeHiddenLine));
      }
      else{
        setNodeWidth(Object.fromEntries(nodeWidthMap));
        setNodeLineColor(Object.fromEntries(nodeLineColMap));
      }
    }
    else{
      const edgeSelectedBar = new Map();
      const edgeHiddenBar = new Map();
      setCurrEdgeButton(value);
      Object.entries(edgeSelected).map((x,i) => {
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
        setEdgeWidth(Object.fromEntries(edgeSelectedBar));
      }
      else if(value === "hidden"){
        setEdgeWidth(Object.fromEntries(edgeHiddenBar));
      }
      else{
        setEdgeWidth(Object.fromEntries(edgeWidthMap));
      }
    }
  }

  const transNodeData = nodesData.map(x => {
    return {
      uid: x.uid,
      value: nodeDegList[x.uid],
      color:  {"r": getRGB(nodeColor[x.uid])[0], "g":getRGB(nodeColor[x.uid])[1], "b":getRGB(nodeColor[x.uid])[2], "a":getRGB(nodeColor[x.uid])[3]},
      selected: nodeSelected[x.uid],
      visible: nodeVisible[x.uid]
    }
  });

  const transEdgeData = edges.map(x => {
    return {
      uid: x.uid.toString(),
      value: edgeSizeList[x.uid.toString()],
      color: {"r": getRGB(edgeColor[x.uid.toString()])[0], "g":getRGB(edgeColor[x.uid.toString()])[1], "b":getRGB(edgeColor[x.uid.toString()])[2], "a":getRGB(edgeColor[x.uid.toString()])[3]},
      selected: edgeSelected[x.uid.toString()],
      visible: edgeVisible[x.uid.toString()]
    }
  })

  const convertedData = function(data){
    const copy = {...data};
    Object.values(copy).forEach(function(val){
      val["color"] = rgbToHex(parseInt(val.color.r), parseInt(val.color.g), parseInt(val.color.b));
    });
    return Object.values(copy);
  }

  const getNodePalette = value => {
    setNodeColor(value);
  }
  const getEdgePalette = value => {
    setEdgeColor(value);
  }
  const [colGroup, setColGroup] = React.useState("each");
  const [colPalette, setColPalette] = React.useState("black");
  const [colType, setColType] = React.useState("node");
  const getCurrData = (group, palette, type) => {
    setColGroup(group);
    setColPalette(palette);
    setColType(type);
  }

  const getClickedNodes = x => {
    // console.log(x.uid);
    const nodeClickedMap = new Map();

    Object.entries(nodeDegList).map((uidDeg, i) => {

      if(uidDeg[0] === x.uid){
        nodeClickedMap.set(uidDeg[0], true);
      }
      else{
        nodeClickedMap.set(uidDeg[0], false);
      }
    })

  }

  return <div>
    <Grid container spacing={1}>

    <Grid item xs={12} sm={!navOpen ? 1 : 4}>
      <div className="colorSetting" style={{justifyContent: !navOpen ? "flex-start" : "flex-end"}}>
        <div>
          <Button style={{justifyContent: !navOpen ? "flex-start": "flex-end"}} color="primary" onClick={() => toggleNav()}>{!navOpen ? <ArrowForwardIos /> : <ArrowBackIos />}</Button></div>
        </div>
        {navOpen ? <div className={classes.root}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} >
              <Typography className={classes.heading}>{"Key Statistics - Nodes" + " (" +  String(nodesData.length) + ")"}</Typography>
            </AccordionSummary>
            <AccordionDetails>
            <div style={{width: "100%"}}>
              <LoadTable
                type={"node"}
                data={convertedData(transNodeData)}
                sendColorToMain={getColorChange}
                sendVisibilityToMain={getVisibilityChange}
                sendSelectedToMain={getSelectedChange}
                sendSelectAll={getSelectAll}
              />
              <ShowButton type={"node"} sendButton={getButton} currButton={currNodeButton}/>
              <Bars type={"node"} freqData={getValueFreq(nodeDegList)} sendValue={getHoverValue}/>
            </div>

            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} >
              <Typography className={classes.heading}>{"Key Statistics - Edges" + " (" +  String(edges.length) + ")"}</Typography>
            </AccordionSummary>
            <AccordionDetails>
            <div style={{width: "100%"}}>
              <LoadTable
                type={"edge"}
                data={convertedData(transEdgeData)}
                sendColorToMain={getColorChange}
                sendVisibilityToMain={getVisibilityChange}
                sendSelectedToMain={getSelectedChange}
                sendSelectAll={getSelectAll}
              />
              <ShowButton type={"edge"} sendButton={getButton} currButton={currEdgeButton}/>
              <Bars type={"edge"} freqData={getValueFreq(edgeSizeList)} sendValue={getHoverValue}/>
            </div>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} >
              <Typography className={classes.heading}>Color</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ColorPalette nodeData={nodeDegList} edgeData={edgeSizeList}
              sendNodePalette={getNodePalette} sendEdgePalette={getEdgePalette}
              currGroup={colGroup} currPalette={colPalette} currType={colType} sendCurrData={getCurrData}
              />
            </AccordionDetails>
          </Accordion>
        </div> : null }
  </Grid>

  <Grid item xs={12} sm={!navOpen ? 11 : 8}>
    <HypernetxWidgetView {...{nodes, edges}} nodeFill={nodeColor} nodeStroke={nodeLineColor} nodeStrokeWidth={nodeWidth} edgeStrokeWidth={edgeWidth} edgeStroke={edgeColor} edgeStrokeWidth={edgeWidth}
    sendNodeSelect={getClickedNodes}
    {...props}
    />
  </Grid>
  </Grid>

</div>

}

export default Widget
