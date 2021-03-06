import React from 'react';
import RemoveCircleOutlineOutlinedIcon from '@material-ui/icons/RemoveCircleOutlineOutlined';
import {IconButton} from "@material-ui/core";

const RemoveButton = ({label, remove, onRemoveChange}) => {
    const [removal, setRemoval] = React.useState(false);

    const handleRemove = () => {
        setRemoval(!removal);
        onRemoveChange(label, !removal);
    }

    return(
        <div>
            <IconButton onClick={handleRemove}>
                {remove ? <RemoveCircleOutlineOutlinedIcon style={{fill: '#DCDCDC'}} />
                : <RemoveCircleOutlineOutlinedIcon style={{fill: 'black'}} />}
            </IconButton>
        </div>
    )
}

export default RemoveButton