import React from "react";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiDialogTitle-root": {
      paddingTop: "8px",
      paddingBottom: "5px",
      paddingRight: "6px",
    },
    "& .MuiTypography-h6": {
      display: "flex",
      justifyContent: "space-between",
    },
  },
}));

const HelpMenu = ({ state, onOpenChange }) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  const classes = useStyles();
  return (
    <div>
      <Dialog
        open={state}
        onClose={handleClose}
        maxWidth={"lg"}
        className={classes.root}
      >
        <DialogTitle component={"div"}>
          <Typography variant="h3">Using the tool</Typography>
          <span>
            <IconButton size={"small"} onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </span>
        </DialogTitle>

        <DialogContent>
          <DialogContentText component="div" style={{ color: "black" }}>
            <Typography gutterBottom>
              The tool has two main interfaces, the hypergraph visualization and
              the nodes & edges panel.
            </Typography>
            <Typography variant="h5">Layout</Typography>
            <Typography gutterBottom>
              The hypergraph visualization is an Euler diagram that shows nodes
              as circles and hyper edges as outlines containing the
              nodes/circles they contain. The visualization uses a force
              directed optimization to perform the layout. This algorithm is not
              perfect and sometimes gives results that the user might want to
              improve upon. The visualization allows the user to drag nodes and
              position them directly at any time. The algorithm will re-position
              any nodes that are not specified by the user. Ctrl (Windows) or
              Command (Mac) clicking a node will release a pinned node it to be
              re-positioned by the algorithm.
            </Typography>
            <Typography variant="h5">Selection</Typography>
            <Typography gutterBottom>
              Nodes and edges can be selected by clicking them. Nodes and edges
              can be selected independently of each other, i.e., it is possible
              to select an edge without selecting the nodes it contains.
              Multiple nodes and edges can be selected, by holding down Shift
              while clicking. Shift clicking an already selected node will
              de-select it. Clicking the background will de-select all nodes and
              edges. Dragging a selected node will drag all selected nodes,
              keeping their relative placement.
            </Typography>
            <Typography>
              Selected nodes can be hidden (having their appearance minimized)
              or removed completely from the visualization. Hiding a node or
              edge will not cause a change in the layout, whereas removing a
              node or edge will. The selection can also be expanded. Buttons in
              the toolbar allow for selecting all nodes contained within
              selected edges, and selecting all edges containing any selected
              nodes.
            </Typography>
            <Typography display="block">
              The toolbar also contains buttons to select all nodes (or edges),
              un-select all nodes (or edges), or reverse the selected nodes (or
              edges). An advanced user might:
            </Typography>
            <Typography component={"ul"}>
              <li>
                <span
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  {"Select all nodes not in an edge by: "}
                </span>
                <span>
                  select an edge, select all nodes in that edge, then reverse
                  the selected nodes to select every node not in that edge.
                </span>
              </li>
              <li>
                <span style={{ fontWeight: "bold" }}>
                  {"Traverse the graph by: "}
                </span>
                <span>
                  selecting a start node, then alternating select all edges
                  containing selected nodes and selecting all nodes within
                  selected edges{" "}
                </span>
              </li>
              <li>
                <span style={{ fontWeight: "bold" }}>
                  {"Pin Everything by: "}
                </span>
                <span>
                  hitting the button to select all nodes, then drag any node
                  slightly to activate the pinning for all nodes.
                </span>
              </li>
            </Typography>
            <Typography variant="h5">Side Panel</Typography>
            <Typography>
              Details on nodes and edges are visible in the side panel. For both
              nodes and edges, a table shows the node name, degree (or size for
              edges), its selection state, removed state, and color. These
              properties can also be controlled directly from this panel. The
              color of nodes and edges can be set in bulk here as well, for
              example, coloring by degree.
            </Typography>
            <Typography variant="h5"> Other Features</Typography>
            <Typography gutterBottom>
              Nodes with identical edge membership can be collapsed into a super
              node, which can be helpful for larger hypergraphs. Dragging any
              node in a super node will drag the entire super node. This feature
              is available as a toggle in the nodes panel.
            </Typography>
            <Typography>
              The hypergraph can also be visualized as a bipartite graph
              (similar to a traditional node-link diagram). Toggling this
              feature will preserve the locations of the nodes between the
              bipartite and the Euler diagrams.
            </Typography>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HelpMenu;
