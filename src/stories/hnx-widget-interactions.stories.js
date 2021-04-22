import React from 'react';

import IconButton from '@material-ui/core/IconButton'
import LockOpen from '@material-ui/icons/LockOpen'

// import {HypernetxWidget} from '..'
import HypernetxWidgetView, {now} from '../HypernetxWidgetView';

import props from './data/props.json'

export default {
  title: 'HNX Widget SVG/Interactions',
};

export const LogNodeClick = () =>
  <HypernetxWidgetView {...props} onClickNodes={console.log}/>

export const LogEdgeClick = () =>
  <HypernetxWidgetView {...props} onClickEdges={console.log}/>

function UnpinButton() {
	const [unpinned, setUnpinned] = React.useState(now());

	return <div>
		{ unpinned }
		<IconButton onClick={() => setUnpinned(now())}>
			<LockOpen />
		</IconButton>
	  <HypernetxWidgetView {...props} unpinned={unpinned}/>
	</div>
}

export const UnPin = () =>
	<UnpinButton />