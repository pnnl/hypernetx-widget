import React from "react";
import Widget from "../widget.js";
import props from "./data/props.json";
import metaprops from "./data/props-with-metadata.json";
import "../css/hnxStyle.css";

export default {
  title: "HNX Widget SVG/Loadings",
};

const nodeColorDict = {
  BM: "rgba(193, 122, 158, 0.5)",
  BR: "rgba(150, 213, 95, 0.7)",
  CC: "rgba(88, 148, 150, 0.8)",
  CH: "rgba(136, 25, 118, 0.8)",
  CN: "rgba(176, 220, 206, 0.7)",
  FN: "rgba(79, 255, 88, 0.7)",
  GP: "rgba(75, 184, 25, 0.9)",
  JA: "rgba(213, 59, 43, 0.8)",
  JU: "rgba(80, 35, 135, 0.2)",
  JV: "rgba(209, 137, 72, 0.5)",
  MA: "rgba(227, 134, 90, 0.7)",
  MP: "rgba(190, 222, 243, 0.6)",
  TH: "rgba(156, 10, 167, 0.6)",
};

const nodeHiddenDict = {
  BM: true,
  BR: false,
  CC: false,
  CH: false,
  CN: true,
  FN: false,
  GP: false,
  JA: false,
  JU: false,
  JV: false,
  MA: false,
  MP: false,
  TH: false,
};
const nodeRemovedDict = {
  BM: false,
  BR: false,
  CC: false,
  CH: false,
  CN: true,
  FN: false,
  GP: false,
  JA: false,
  JU: false,
  JV: false,
  MA: false,
  MP: false,
  TH: false,
};

const edgeHiddenDict = {
  0: false,
  1: false,
  2: true,
  3: false,
  4: false,
  5: false,
  6: true,
  7: false,
};

const edgeRemovedDict = {
  0: false,
  1: false,
  2: true,
  3: false,
  4: false,
  5: false,
  6: false,
  7: false,
};
const edgeColorDict = {
  0: "rgba(207, 238, 73, 0.1)",
  1: "rgba(115, 4, 64, 0.8)",
  2: "rgba(134, 128, 107, 0.9)",
  3: "rgba(244, 148, 117, 0.9)",
  4: "rgba(36, 34, 132, 0.8)",
  5: "rgba(73, 84, 27, 0.2)",
  6: "rgba(98, 213, 173, 1)",
  7: "rgba(0, 0, 0, 1)",
};

// console.log({...props});
// export const MainComponent = () => <div>
//   <Widget {...props} withEdgeLabels={true} withNodeLabels={true}
//           // nodeFill={nodeColorDict}
//
//     // edgeStroke={{}}
//           // nodeRemoved={nodeRemovedDict}
//           // edgeHidden={edgeHiddenDict}
//     // edgeRemoved={edgeRemovedDict}
//   />
// </div>

export const WithMetaData = () => (
  <div>
    <Widget {...metaprops} withEdgeLabels={true} withNodeLabels={true} />
  </div>
);
