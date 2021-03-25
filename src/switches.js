import React, {useState} from 'react';
import {FormControlLabel, FormGroup, Switch} from '@material-ui/core';

const Switches = ({ dataType, onSwitchChange }) => {
	// const [showLabels, setShowLabels] = useState(true);
	// const [collapseNodes, setCollapseNodes] = useState(false);
	// const [linegraph, setLinegraph] = useState(false);

	const [state, setState] = useState({
		showLabels: true,
		collapseNodes: false,
		linegraph: false,
	})

	const handleChange = (event) => {
		// if(event.target.name === "showLabels"){
			setState({ ...state, [event.target.name]: event.target.checked });
			onSwitchChange(dataType, { ...state, [event.target.name]: event.target.checked });

		// }
		// else{
		// 	if(event.target.checked){
		// 		setState({ ...state, [event.target.name]: event.target.checked });
		// 		onSwitchChange(dataType, { ...state, [event.target.name]: event.target.checked });
		//
		// 	}
		// 	else{
		// 		setState({ ...state, [event.target.name]: undefined });
		// 		onSwitchChange(dataType, { ...state, [event.target.name]: undefined});
		//
		// 	}
		// }
	}
	return(
		<div style={{display: "flex", justifyContent: "center"}}>
			<FormGroup>
			<FormControlLabel
				control={<Switch
					checked={state.showLabels}
					onChange={handleChange}
					color={"primary"}
					name={"showLabels"}
				/>}
				label={<div style={{fontSize: "14px"}}>Labels</div>}
			/>
			{dataType === "node" &&
			<FormControlLabel
				control={<Switch
					checked={state.collapseNodes}
					onChange={handleChange}
					color={"primary"}
					name={"collapseNodes"}
				/>}
				label={<div style={{fontSize: "14px"}}>Collapse nodes</div>}
			/>}
				{dataType === "edge" &&
			<FormControlLabel
				control={<Switch
					checked={state.linegraph}
					onChange={handleChange}
					color={"primary"}
					name={"linegraph"}
				/>}
				label={<div style={{fontSize: "14px"}}>Line Graph</div>}

			/>}
			</FormGroup>

		</div>
	)
}

export default Switches