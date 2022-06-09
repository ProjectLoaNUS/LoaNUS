import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconButton, Menu } from '@mui/material';
import { MenuItem } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { ShrinkDiv } from './FlexDiv';

export default function CreateBtn() {
    const [ anchorEl, setAnchorEl ] = useState(null);
    const open = Boolean(anchorEl);
    
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
    }

    return (
        <ShrinkDiv>
            <IconButton 
              id="create-btn"
              aria-controls={'create-menu'}
              aria-haspopup="true"
              onClick={handleClick}
              color="primary">
                  <AddCircleOutline />
              </IconButton>
            <Menu
              id="create-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                  'arial-labelledby': 'basic-button'
              }}
            >
                <MenuItem component={ Link } to='/create-request'>List Item</MenuItem>
                <MenuItem component={ Link } to='/create-request'>Request Item</MenuItem>
            </Menu>
        </ShrinkDiv>
    );
}