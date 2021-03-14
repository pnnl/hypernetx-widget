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
        <div className="hoverShow">
            <div className={remove === true ? "show" : "hide"}>
                <IconButton onClick={handleRemove} style={{padding: "2px"}}>
                    {remove ? <RemoveCircleOutlineOutlinedIcon style={{fill: 'black'}} />
                        : <RemoveCircleOutlineOutlinedIcon style={{fill: '#DCDCDC'}} />}
                </IconButton>
            </div>

        </div>
    )
}

export default RemoveButton