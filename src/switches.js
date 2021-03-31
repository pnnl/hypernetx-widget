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
			setState({ ...state, [event.target.name]: event.target.checked });
			onSwitchChange(dataType, { ...state, [event.target.name]: event.target.checked });
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
						size={"small"}
					/>}
					label={<div style={{fontSize: "13px"}}>Labels</div>}
				/>
				{dataType === "node" &&
				<FormControlLabel
					control={<Switch
						checked={state.collapseNodes}
						onChange={handleChange}
						color={"primary"}
						name={"collapseNodes"}
						size={"small"}
					/>}
					label={<div style={{fontSize: "13px"}}>Collapse nodes</div>}
				/>}
					{dataType === "edge" &&
				<FormControlLabel
					control={<Switch
						checked={state.linegraph}
						onChange={handleChange}
						color={"primary"}
						name={"linegraph"}
						size={"small"}
					/>}
					label={<div style={{fontSize: "13px"}}>Bipartite</div>}

				/>}
			</FormGroup>

		</div>
	)
}

export default Switches