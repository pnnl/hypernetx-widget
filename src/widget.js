import React from "react";
import Grid from "@material-ui/core/Grid";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import HypernetxWidgetView, { now } from "./HypernetxWidgetView";
import ColorPalette from "./colorPalette.js";
import LoadTable from "./loadTable.js";
import Bars from "./bars.js";
import {
  getNodeDegree,
  getEdgeSize,
  getValueFreq,
  accordianStyles,
  hslToHex,
} from "./functions.js";
import Toolbar from "./toolbar";
import Switches from "./switches";
import FontSizeMenu from "./fontSizeMenu";
import { Divider, IconButton, Modal, Paper } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import NodeSizeMenu from "./nodeSizeMenu";
import { max, range } from "d3-array";
import HelpMenu from "./helpMenu";
import NavigableSVG, { PAN, ZOOM_IN, ZOOM_OUT, RESET } from "./NavigableSVG";
import { HypernetxWidgetDualView } from "./HypernetxWidgetDualView";
import props from "./stories/data/props.json";

const createDefaultState = (data, defaultValue) => {
  const mapObj = new Map();
  data.map((d) => mapObj.set(d.uid.toString(), defaultValue));
  return Object.fromEntries(mapObj);
};

const Widget = ({ nodes, edges, ...props }) => {
  // console.log({ ...props });
  const classes = accordianStyles();

  const nodeDegMap = new Map();
  nodes.map((x) => nodeDegMap.set(x.uid, getNodeDegree(nodes, edges, x.uid)));
  const nodeDegList = Object.fromEntries(nodeDegMap);
  const [nodeDegBar, setNodeDegBar] = React.useState(nodeDegList);
  const globalMaxDeg = max(getValueFreq(nodeDegList).map((d) => d.y));

  const edgeSizeMap = new Map();
  edges.map((x, i) =>
    edgeSizeMap.set(x.uid.toString(), getEdgeSize(nodes, edges, i))
  );
  const edgeSizeList = Object.fromEntries(edgeSizeMap);
  const [edgeSizeBar, setEdgeSizeBar] = React.useState(edgeSizeList);
  const globalMaxSize = max(getValueFreq(edgeSizeList).map((d) => d.y));

  const [withNodeLabels, setWithNodeLabels] = React.useState(true);
  const [withEdgeLabels, setWithEdgeLabels] = React.useState(true);
  const [collapseNodes, setCollapseNodes] = React.useState(false);
  const [bipartite, setBipartite] = React.useState(false);

  const [nodeFill, setNodeFill] = React.useState(
    props.nodeFill || createDefaultState(nodes, hslToHex(0, 35, 15.6))
  );
  const [selectedNodes, setSelectedNodes] = React.useState(
    props.selectedNodes || {}
  );
  const [hiddenNodes, setHiddenNodes] = React.useState(props.hiddenNodes || {});
  const [removedNodes, setRemovedNodes] = React.useState(
    props.removedNodes || {}
  );

  const [edgeStroke, setEdgeStroke] = React.useState(
    props.edgeStroke || createDefaultState(edges, hslToHex(0, 35, 15.6))
  );
  const [selectedEdges, setSelectedEdges] = React.useState(
    props.selectedEdges || {}
  );
  const [hiddenEdges, setHiddenEdges] = React.useState(props.hiddenEdges || {});
  const [removedEdges, setRemovedEdges] = React.useState(
    props.removedEdges || {}
  );

  const [nodeFontSize, setNodeFontSize] = React.useState(
    createDefaultState(nodes, 12)
  );
  const [edgeFontSize, setEdgeFontSize] = React.useState(
    createDefaultState(edges, 10)
  );

  const [pinned, setPinned] = React.useState(false);
  const [unpinned, setUnpinned] = React.useState(now());

  const [aspect, setAspect] = React.useState(1);
  const [navigation, setNavigation] = React.useState(undefined);
  const [selectionMode, setSelectionMode] = React.useState(undefined);

  // update the python model with state
  const { _model } = props;

  if (_model !== undefined) {
    _model.set("node_fill", nodeFill);
    _model.set("edge_stroke", edgeStroke);
    _model.set("selected_nodes", selectedNodes);
    _model.set("selected_edges", selectedEdges);
    _model.set("hidden_nodes", hiddenNodes);
    _model.set("hidden_edges", hiddenEdges);
    _model.set("removed_nodes", removedNodes);
    _model.set("removed_edges", removedEdges);

    _model.save();
  }

  const handleColorChange = (datatype, uid, color) => {
    const h = color.h;
    const s = color.s * 100;
    const l = color.l * 100;
    if (datatype === "node") {
      setNodeFill({ ...nodeFill, [uid]: hslToHex(h, s, l) });
    } else {
      setEdgeStroke({ ...edgeStroke, [uid]: hslToHex(h, s, l) });
    }
  };

  const handleVisibilityChange = (datatype, uid, visibility) => {
    if (datatype === "node") {
      setHiddenNodes({ ...hiddenNodes, [uid]: !visibility });
    } else {
      setHiddenEdges({ ...hiddenEdges, [uid]: !visibility });
    }
  };

  const handleSelectedChange = (datatype, uid, selected) => {
    if (datatype === "node") {
      setSelectedNodes({ ...selectedNodes, [uid]: selected });
    } else {
      setSelectedEdges({ ...selectedEdges, [uid]: selected });
    }
  };

  const handleRemovedChange = (datatype, uid, removed) => {
    if (datatype === "node") {
      setRemovedNodes({ ...removedNodes, [uid]: removed });
      let currDegData = { ...nodeDegBar };
      if (removed) {
        delete currDegData[uid];
        setNodeDegBar({ ...currDegData });
      } else {
        setNodeDegBar({ ...nodeDegBar, [uid]: nodeDegList[uid] });
      }
    } else {
      setRemovedEdges({ ...removedEdges, [uid]: removed });
      let currSizeData = { ...edgeSizeBar };
      if (removed) {
        delete currSizeData[uid];
        setEdgeSizeBar({ ...currSizeData });
      } else {
        setEdgeSizeBar({ ...edgeSizeBar, [uid]: edgeSizeList[uid] });
      }
    }
  };

  const handleSelectAll = (type, value) => {
    if (type === "node") {
      if (value) {
        setSelectedNodes(createDefaultState(nodes, true));
      } else {
        setSelectedNodes(createDefaultState(nodes, false));
      }
    } else {
      if (value) {
        setSelectedEdges(createDefaultState(edges, true));
      } else {
        setSelectedEdges(createDefaultState(edges, false));
      }
    }
  };

  const handleBarSelect = (value, datatype) => {
    if (datatype === "node") {
      const nodesOnBarMap = new Map();
      nodes.map((x) => nodesOnBarMap.set(x.uid, false));
      Object.entries(nodeDegList).map((uidDeg) => {
        value.map((v) => {
          if (uidDeg[1] === v) {
            nodesOnBarMap.set(uidDeg[0], true);
          }
        });
      });
      setSelectedNodes(Object.fromEntries(nodesOnBarMap));
    } else if (datatype === "edge") {
      const edgesOnBarMap = new Map();
      edges.map((x) => edgesOnBarMap.set(x.uid.toString(), false));
      Object.entries(edgeSizeList).map((uidSize) => {
        value.map((v) => {
          if (uidSize[1] === v) {
            edgesOnBarMap.set(uidSize[0], true);
          }
        });
      });
      setSelectedEdges(Object.fromEntries(edgesOnBarMap));
    }
  };

  const transNodeData = nodes.map((x) => {
    return {
      uid: x.uid,
      value: nodeDegList[x.uid],
      color: nodeFill[x.uid],
      selected: selectedNodes[x.uid],
      hidden: hiddenNodes[x.uid],
      removed: removedNodes[x.uid],
    };
  });

  const transEdgeData = edges.map((x) => {
    return {
      uid: x.uid.toString(),
      value: edgeSizeList[x.uid.toString()],
      color: edgeStroke[x.uid.toString()],
      selected: selectedEdges[x.uid.toString()],
      hidden: hiddenEdges[x.uid.toString()],
      removed: removedEdges[x.uid.toString()],
    };
  });

  const [colGroup, setColGroup] = React.useState({
    node: "Id",
    edge: "Id",
  });
  const [colPalette, setColPalette] = React.useState({
    node: "default",
    edge: "default",
  });

  const [toggleSelect, setToggleSelect] = React.useState({
    Nodes: "original",
    Edges: "original",
    // Graph: "undo",
    Selection: "cursor",
    Navigation: undefined,
    View: undefined,
  });
  const [fontSize, setFontSize] = React.useState({ node: 12, edge: 10 });
  const [nodeSize, setNodeSize] = React.useState(createDefaultState(nodes, 2));
  const [nodeSizeGroup, setNodeSizeGroup] = React.useState("None");
  const [openHelp, setOpenHelp] = React.useState(false);
  const [large, setLarge] = React.useState(false);
  const [openFullscreen, setOpenFullscreen] = React.useState(false);
  const [openDualFull, setOpenDualFull] = React.useState(false);

  const handleCurrData = (group, palette, dataType) => {
    setColGroup({ ...colGroup, [dataType]: group });
    setColPalette({ ...colPalette, [dataType]: palette });
  };

  const getClickedNodes = (event, data) => {
    // setToggleSelect({ ...toggleSelect, Nodes: undefined });
    if (Array.isArray(data)) {
      var uidArr = [];
      if (data.length > 0) {
        if (data[0].data) {
          uidArr = data
            .map((d) => d.data.elements)
            .flat()
            .map((d) => d.uid);
        } else {
          uidArr = data.map((d) => d.uid);
        }
      }

      const newSelect = {};
      uidArr.map((uid) => {
        newSelect[uid] = true;
      });
      if (event.shiftKey) {
        setSelectedNodes({ ...selectedNodes, ...newSelect });
      } else {
        setSelectedNodes({ ...newSelect });
      }
    } else {
      if (event.shiftKey) {
        if (data.data) {
          setSelectedNodes({
            ...selectedNodes,
            [data.data.uid]: !selectedNodes[data.data.uid],
          });
        } else {
          setSelectedNodes({
            ...selectedNodes,
            [data.uid]: !selectedNodes[data.uid],
          });
        }
      } else if (data === undefined) {
        // setToggleSelect({ ...toggleSelect, Edges: "hidden" });
        // setSelectedNodes({});
      } else {
        if (data.data) {
          setSelectedNodes({ [data.data.uid]: true });
        } else {
          setSelectedNodes({ [data.uid]: true });
        }
      }
    }
  };

  const getClickedEdges = (event, data) => {
    // setToggleSelect({ ...toggleSelect, Edges: undefined });
    if (Array.isArray(data)) {
      const uidArr = data.map((d) => d.uid);
      const newSelect = {};
      uidArr.map((uid) => (newSelect[uid] = true));
      if (event.shiftKey) {
        setSelectedEdges({ ...selectedEdges, ...newSelect });
      } else {
        setSelectedEdges({ ...newSelect });
      }
    } else {
      if (event.shiftKey) {
        setSelectedEdges({
          ...selectedEdges,
          [data.uid]: !selectedEdges[data.uid],
        });
      } else if (data === undefined) {
        const clearObj = { Nodes: "original", Edges: "original" };
        if (navigation === RESET) {
          setToggleSelect({ ...toggleSelect, ...clearObj });
          setSelectedEdges({});
          setSelectedNodes({});
        }
      } else {
        setSelectedEdges({ [data.uid]: true });
      }
    }
  };

  const handleOriginal = (type) => {
    if (type === "Nodes") {
      setSelectedNodes({});
      setHiddenNodes({});
      setRemovedNodes({});
      setNodeDegBar({ ...nodeDegList });
    }
    if (type === "Edges") {
      setSelectedEdges({});
      setHiddenEdges({});
      setRemovedEdges({});
      setEdgeSizeBar({ ...edgeSizeList });
    }
    // if (type === "graph") {
    //   setBipartite(false);
    //   setCollapseNodes(false);
    // }
  };

  const handleHideSelected = (type) => {
    if (type === "Nodes") {
      const selectedNodesTrue = Object.fromEntries(
        Object.entries(selectedNodes).filter(([k, v]) => v)
      );
      setHiddenNodes({ ...hiddenNodes, ...selectedNodesTrue });
    } else {
      const selectedEdgesTrue = Object.fromEntries(
        Object.entries(selectedEdges).filter(([k, v]) => v)
      );
      setHiddenEdges({ ...hiddenEdges, ...selectedEdgesTrue });
    }
  };

  const handleRemoveSelected = (type) => {
    if (type === "Nodes") {
      const selectedNodesTrue = Object.fromEntries(
        Object.entries(selectedNodes).filter(([k, v]) => v)
      );
      setRemovedNodes({ ...removedNodes, ...selectedNodesTrue });

      let currDegData = { ...nodeDegBar };
      Object.keys(selectedNodesTrue).map((d) => delete currDegData[d]);
      setNodeDegBar({ ...currDegData });
    } else {
      const selectedEdgesTrue = Object.fromEntries(
        Object.entries(selectedEdges).filter(([k, v]) => v)
      );
      setRemovedEdges({ ...removedEdges, ...selectedEdgesTrue });

      let currSizeData = { ...edgeSizeBar };
      Object.keys(selectedEdgesTrue).map((d) => delete currSizeData[d]);
      setEdgeSizeBar({ ...currSizeData });
    }
  };

  const handleOtherSelect = (type) => {
    let nodeToSelect = new Map(
      Object.entries(createDefaultState(nodes, false))
    );
    if (type === "nodes in edges") {
      Object.entries(selectedEdges).map((d) => {
        edges.map((e) => {
          if (d[1] && d[0] === e.uid) {
            e.elements.map((x) => nodeToSelect.set(x.toString(), true));
          }
        });
      });
      setSelectedNodes(Object.fromEntries(nodeToSelect));
    } else {
      let edgeToSelect = new Map(
        Object.entries(createDefaultState(edges, false))
      );
      Object.entries(selectedNodes).map((d) => {
        edges.map((e) => {
          let edgeElems = e.elements.map(String);
          if (d[1] && edgeElems.includes(d[0])) {
            edgeToSelect.set(e.uid.toString(), true);
          }
        });
      });
      setSelectedEdges(Object.fromEntries(edgeToSelect));
    }
  };

  const handleToolbarSelection = (dataType, selectionType) => {
    setToggleSelect({ ...toggleSelect, [dataType]: selectionType });
    if (selectionType === "hidden") {
      handleHideSelected(dataType);
      setPinned(false);
    } else if (selectionType === "removed") {
      handleRemoveSelected(dataType);
      setPinned(false);
    } else if (selectionType === "other") {
      setPinned(false);
      if (dataType === "Nodes") {
        handleOtherSelect("edges in nodes");
      } else {
        handleOtherSelect("nodes in edges");
      }
    } else if (selectionType === "all") {
      setPinned(false);
      if (dataType === "Nodes") {
        setSelectedNodes(createDefaultState(nodes, true));
      } else {
        setSelectedEdges(createDefaultState(edges, true));
      }
    } else if (selectionType === "none") {
      setPinned(false);
      if (dataType === "Nodes") {
        setSelectedNodes({});
      } else {
        setSelectedEdges({});
      }
    } else if (selectionType === "unpin") {
      setPinned(false);
      setUnpinned(now());
      setToggleSelect({ ...toggleSelect, Nodes: undefined });
    } else if (selectionType === "pin") {
      setPinned(true);
    } else if (selectionType === "reverse") {
      setPinned(false);
      if (dataType === "Nodes") {
        const currSelectedNodes = { ...selectedNodes };
        const uids = nodes.map((d) => d.uid);
        uids.map((d) => {
          currSelectedNodes[d] = !currSelectedNodes[d];
        });
        setSelectedNodes(currSelectedNodes);
      } else {
        const currSelectedEdges = { ...selectedEdges };
        const uids = edges.map((d) => d.uid.toString());
        uids.map((d) => {
          currSelectedEdges[d] = !currSelectedEdges[d];
        });
        setSelectedEdges(currSelectedEdges);
      }
    } else if (selectionType === "fullscreen") {
      setOpenDualFull(false);
      setLarge(true);
      setOpenFullscreen(true);
      setAspect(2);
      setToggleSelect({ ...toggleSelect, View: selectionType });
      // setNavigation(undefined);
    } else if (selectionType === "bipartite") {
      setBipartite(true);
    } else if (selectionType === "undo-bipartite") {
      setBipartite(false);
    } else if (selectionType === "collapse") {
      setCollapseNodes(true);
    } else if (selectionType === "undo-collapse") {
      setCollapseNodes(false);
    } else if (selectionType === "original") {
      setPinned(false);
      handleOriginal(dataType);
    } else if (selectionType === "help") {
      setOpenHelp(true);
    } else if (
      selectionType === "node-brush" ||
      selectionType === "edge-brush" ||
      selectionType === "cursor"
    ) {
      let newToggle = { Selection: selectionType, Navigation: undefined };
      setToggleSelect({ ...toggleSelect, ...newToggle });
      setSelectionMode(selectionType);
      setNavigation(undefined);
    } else {
      let newToggle = { Selection: undefined, Navigation: selectionType };
      setToggleSelect({ ...toggleSelect, ...newToggle });

      if (selectionType === "pan") {
        setNavigation(PAN);
        // setSelectionMode(undefined);
      } else if (selectionType === "zoom in") {
        setNavigation(ZOOM_IN);
        // setSelectionMode(undefined);
      } else if (selectionType === "zoom out") {
        setNavigation(ZOOM_OUT);
        // setSelectionMode(undefined);
      } else if (selectionType === "dual") {
        // setNavigation(selectionType);
        setToggleSelect({ ...toggleSelect, View: selectionType });
        // setSelectionMode(undefined);
        setLarge(true);
        setOpenDualFull(true);
        setAspect(1);
      } else {
        // no navigation

        setNavigation(RESET);
        setToggleSelect({ ...toggleSelect, Selection: "cursor" });
      }
    }
  };

  const handleSwitch = (dataType, states) => {
    if (dataType === "node") {
      // setWithNodeLabels(states.showLabels);
      setCollapseNodes(states.collapseNodes);
      setToggleSelect({ ...toggleSelect, Nodes: "collapse" });

      // setToggleSelect({ ...toggleSelect, Graph: "collapse" });
    } else {
      // setWithEdgeLabels(states.showLabels);
      setBipartite(states.bipartite);
      setToggleSelect({ ...toggleSelect, Edges: "bipartite" });
      // setToggleSelect({ ...toggleSelect, Graph: "bipartite" });
    }
  };

  const handlePaletteChange = (dataType, newPalette) => {
    if (dataType === "node") {
      setNodeFill(newPalette);
    } else {
      setEdgeStroke(newPalette);
    }
  };

  const handleAllColorChange = (color, type) => {
    const singleColorMap = new Map();
    if (type === "node") {
      Object.keys({ ...nodeFill }).map((d) => singleColorMap.set(d, color));
      setNodeFill(Object.fromEntries(singleColorMap));
    } else {
      Object.keys({ ...edgeStroke }).map((d) => singleColorMap.set(d, color));
      setEdgeStroke(Object.fromEntries(singleColorMap));
    }
  };

  const handleFontSize = (type, size) => {
    if (type === "node") {
      if (size === "hide labels") {
        setWithNodeLabels(false);
      } else {
        setWithNodeLabels(true);
        setNodeFontSize(createDefaultState(nodes, size));
        setFontSize({ ...fontSize, [type]: size });
      }
    } else {
      if (size === "hide labels") {
        setWithEdgeLabels(false);
      } else {
        setEdgeFontSize(createDefaultState(edges, size));
        setFontSize({ ...fontSize, [type]: size });
        setWithEdgeLabels(true);
      }
    }
  };

  const assignSizeWMeta = (group, metadata) => {
    const groupObj = {};
    Object.entries(metadata).map((d) => {
      groupObj[d[0]] = d[1][group];
    });

    const sizeDict = {};
    const values = Object.values(groupObj);
    const unique = Array.from(new Set(values)).sort();
    range(unique.length).map((d, i) => {
      sizeDict[unique[i]] = i + 1;
    });

    const dataDict = {};
    Object.entries(groupObj).map((d) => {
      dataDict[d[0]] = sizeDict[d[1]];
    });
    return dataDict;
  };

  const handleNodeSize = (group, metadata) => {
    var obj = {};
    if (group === "None") {
      obj = createDefaultState(nodes, 2);
    } else {
      if (metadata === undefined) {
        obj = nodeDegList;
      } else {
        obj = assignSizeWMeta(group, metadata);
      }
    }
    setNodeSize(obj);
    setNodeSizeGroup(group);
  };
  const [openAccordian, setOpenAccordian] = React.useState({
    node: true,
    edge: false,
  });
  const handleAccordian = (e, expanded, type) => {
    const currAccordian = { ...openAccordian };
    currAccordian[type] = expanded;
    if (type === "node") {
      currAccordian["edge"] = !currAccordian["edge"];
    } else {
      currAccordian["node"] = !currAccordian["node"];
    }
    setOpenAccordian(currAccordian);
  };

  const handleClose = () => {
    // setNavigation(undefined);
    setLarge(false);
    setAspect(1);
    setToggleSelect({ ...toggleSelect, View: undefined });
  };

  const switchData = {
    collapseState: collapseNodes,
    bipartiteState: bipartite,
  };

  // console.log(toggleSelect);
  return (
    <div>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={4}>
          <div className={classes.root}>
            <Accordion
              expanded={openAccordian["node"]}
              onChange={(e, expanded) => handleAccordian(e, expanded, "node")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon style={{ fontSize: "20px" }} />}
              >
                <Typography style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {"Nodes" + " (" + String(nodes.length) + ")"}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div style={{ width: "100%" }}>
                  <LoadTable
                    type={"node"}
                    metadata={props.nodeData}
                    data={transNodeData}
                    onColorChange={handleColorChange}
                    onVisibleChange={handleVisibilityChange}
                    onSelectedChange={handleSelectedChange}
                    onRemovedChange={handleRemovedChange}
                    onSelectAllChange={handleSelectAll}
                    // onAllColorChange={handleAllColorChange}
                  />
                  <Bars
                    type={"node"}
                    freqData={getValueFreq(nodeDegBar)}
                    origMax={globalMaxDeg}
                    // freqData={Object.values(nodeDegBar)}
                    onValueChange={handleBarSelect}
                  />
                  <ColorPalette
                    type={"node"}
                    data={nodeDegList}
                    defaultColors={
                      props.nodeFill || createDefaultState(nodes, "#000000ff")
                    }
                    metadata={props.nodeData}
                    onPaletteChange={handlePaletteChange}
                    currGroup={colGroup.node}
                    currPalette={colPalette.node}
                    onCurrDataChange={handleCurrData}
                    currColors={nodeFill}
                    onAllColorChange={handleAllColorChange}
                  />
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <FontSizeMenu
                      type={"node"}
                      currSize={fontSize}
                      onSizeChange={handleFontSize}
                    />
                    <NodeSizeMenu
                      currGroup={nodeSizeGroup}
                      metadata={props.nodeData}
                      onGroupChange={handleNodeSize}
                    />
                  </div>

                  <Switches
                    currData={switchData}
                    dataType={"node"}
                    onSwitchChange={handleSwitch}
                  />
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={openAccordian["edge"]}
              onChange={(e, expanded) => handleAccordian(e, expanded, "edge")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon style={{ fontSize: "20px" }} />}
              >
                <Typography style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {"Edges" + " (" + String(edges.length) + ")"}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div style={{ width: "100%" }}>
                  <LoadTable
                    type={"edge"}
                    data={transEdgeData}
                    metadata={props.edgeData}
                    onColorChange={handleColorChange}
                    onVisibleChange={handleVisibilityChange}
                    onSelectedChange={handleSelectedChange}
                    onRemovedChange={handleRemovedChange}
                    onSelectAllChange={handleSelectAll}
                    // onAllColorChange={handleAllColorChange}
                  />
                  <Bars
                    type={"edge"}
                    freqData={getValueFreq(edgeSizeBar)}
                    origMax={globalMaxSize}
                    // freqData={Object.values(edgeSizeBar)}
                    onValueChange={handleBarSelect}
                  />
                  <ColorPalette
                    type={"edge"}
                    data={edgeSizeList}
                    metadata={props.edgeData}
                    defaultColors={
                      props.edgeStroke || createDefaultState(edges, "#000000ff")
                    }
                    onPaletteChange={handlePaletteChange}
                    currGroup={colGroup.edge}
                    currPalette={colPalette.edge}
                    onCurrDataChange={handleCurrData}
                    currColors={edgeStroke}
                    onAllColorChange={handleAllColorChange}
                  />
                  <FontSizeMenu
                    type={"edge"}
                    currSize={fontSize}
                    onSizeChange={handleFontSize}
                  />
                  <Switches
                    currData={switchData}
                    dataType={"edge"}
                    onSwitchChange={handleSwitch}
                  />
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
        </Grid>

        <Grid item xs={12} sm={8}>
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexFlow: "row wrap",
              }}
            >
              <div style={{ display: "flex" }}>
                <Toolbar
                  category={"Data"}
                  dataType={"Nodes"}
                  currToggle={toggleSelect.Nodes}
                  selectionState={selectedNodes}
                  onSelectionChange={handleToolbarSelection}
                />
                <Toolbar
                  category={"Data"}
                  dataType={"Edges"}
                  currToggle={toggleSelect.Edges}
                  selectionState={selectedEdges}
                  onSelectionChange={handleToolbarSelection}
                />
              </div>
              <div style={{ display: "flex" }}>
                {/*<Toolbar*/}
                {/*  category={"Graph"}*/}
                {/*  currToggle={toggleSelect.Graph}*/}
                {/*  onSelectionChange={handleToolbarSelection}*/}
                {/*/>*/}
                <Toolbar
                  category={"Selection"}
                  currToggle={toggleSelect.Selection}
                  onSelectionChange={handleToolbarSelection}
                />
                <Toolbar
                  category={"Navigation"}
                  currToggle={toggleSelect.Navigation}
                  onSelectionChange={handleToolbarSelection}
                />
                <Toolbar
                  category="View"
                  currToggle={toggleSelect.View}
                  onSelectionChange={handleToolbarSelection}
                />
              </div>
            </div>
          </div>

          <HypernetxWidgetView
            {...props}
            {...{
              nodes,
              edges,
              nodeFill,
              selectedNodes,
              hiddenNodes,
              removedNodes,
              edgeStroke,
              selectedEdges,
              hiddenEdges,
              removedEdges,
              withNodeLabels,
              withEdgeLabels,
              collapseNodes,
              bipartite,
              unpinned,
              nodeFontSize,
              edgeFontSize,
              nodeSize,
              pinned,
              aspect,
              selectionMode,
              navigation,
            }}
            onClickNodes={getClickedNodes}
            onClickEdges={getClickedEdges}
          />
        </Grid>
      </Grid>
      <HelpMenu
        state={openHelp}
        onOpenChange={() => {
          setOpenHelp(false);
          openDualFull
            ? setToggleSelect({ ...toggleSelect, View: "dual" })
            : openFullscreen
            ? setToggleSelect({ ...toggleSelect, View: "fullscreen" })
            : setToggleSelect({ ...toggleSelect, View: undefined });
        }}
      />
      <Modal
        open={large}
        onClose={handleClose}
        // onClose={() => setOpen(false)}
      >
        <Paper>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingLeft: "10px",
              paddingTop: "5px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                // flexFlow: "row wrap",
              }}
            >
              <Toolbar
                category={"Data"}
                dataType={"Nodes"}
                currToggle={toggleSelect.Nodes}
                selectionState={selectedNodes}
                onSelectionChange={handleToolbarSelection}
              />
              <Toolbar
                category={"Data"}
                dataType={"Edges"}
                currToggle={toggleSelect.Edges}
                selectionState={selectedEdges}
                onSelectionChange={handleToolbarSelection}
              />
              {/*<Toolbar*/}
              {/*  category={"Graph"}*/}
              {/*  currToggle={toggleSelect.Graph}*/}
              {/*  onSelectionChange={handleToolbarSelection}*/}
              {/*/>*/}
              <Toolbar
                category={"Selection"}
                currToggle={toggleSelect.Selection}
                onSelectionChange={handleToolbarSelection}
              />
              <Toolbar
                category={"Navigation"}
                currToggle={toggleSelect.Navigation}
                onSelectionChange={handleToolbarSelection}
              />
              <Toolbar
                category="View"
                currToggle={toggleSelect.View}
                onSelectionChange={handleToolbarSelection}
              />
            </div>
            <div>
              <IconButton onClick={handleClose}>
                <CloseIcon size={"large"} />
              </IconButton>
            </div>
          </div>
          {!openDualFull ? (
            <HypernetxWidgetView
              {...props}
              {...{
                nodes,
                edges,
                nodeFill,
                selectedNodes,
                hiddenNodes,
                removedNodes,
                edgeStroke,
                selectedEdges,
                hiddenEdges,
                removedEdges,
                withNodeLabels,
                withEdgeLabels,
                collapseNodes,
                bipartite,
                unpinned,
                nodeFontSize,
                edgeFontSize,
                nodeSize,
                pinned,
                aspect,
                selectionMode,
                navigation,
              }}
              onClickNodes={getClickedNodes}
              onClickEdges={getClickedEdges}
            />
          ) : (
            <Grid container>
              <Grid item sm={6}>
                <div
                  style={{
                    fontSize: "17px",
                    paddingTop: "10px",
                    fontFamily: "Arial",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Prime
                </div>
                <HypernetxWidgetView
                  {...{
                    nodes,
                    edges,
                    nodeFill,
                    selectedNodes,
                    hiddenNodes,
                    removedNodes,
                    edgeStroke,
                    selectedEdges,
                    hiddenEdges,
                    removedEdges,
                    withNodeLabels,
                    withEdgeLabels,
                    collapseNodes,
                    bipartite,
                    unpinned,
                    nodeFontSize,
                    edgeFontSize,
                    nodeSize,
                    pinned,
                    aspect,
                    selectionMode,
                    navigation,
                  }}
                  onClickNodes={getClickedNodes}
                  onClickEdges={getClickedEdges}
                />
              </Grid>
              <Divider
                orientation="vertical"
                style={{ marginTop: "15px", height: "85vh" }}
              />
              <Grid item sm={5}>
                <div
                  style={{
                    fontSize: "17px",
                    paddingTop: "10px",
                    fontFamily: "Arial",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Dual
                </div>
                <HypernetxWidgetDualView
                  {...{
                    nodes,
                    edges,
                    nodeFill,
                    selectedNodes,
                    hiddenNodes,
                    removedNodes,
                    edgeStroke,
                    selectedEdges,
                    hiddenEdges,
                    removedEdges,
                    withNodeLabels,
                    withEdgeLabels,
                    collapseNodes,
                    bipartite,
                    unpinned,
                    nodeFontSize,
                    edgeFontSize,
                    nodeSize,
                    pinned,
                    aspect,
                    selectionMode,
                    navigation,
                  }}
                  onClickNodes={getClickedNodes}
                  onClickEdges={getClickedEdges}
                />
              </Grid>
            </Grid>
          )}
        </Paper>
      </Modal>
    </div>
  );
};

export default Widget;
