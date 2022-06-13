import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconButton, Menu } from '@mui/material';
import { MenuItem } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { ShrinkDiv } from '../FlexDiv';
import styled from 'styled-components';
import { theme } from '../Theme';

const ContrastIconBtn = styled(IconButton)`
    color: ${theme.palette.primary.contrastText};
`;

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
            <ContrastIconBtn 
              id="create-btn"
              aria-controls={'create-menu'}
              aria-haspopup="true"
              onClick={handleClick}>
                  <AddCircleOutline />
              </ContrastIconBtn>
            <Menu
              id="create-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                  'arial-labelledby': 'basic-button'
              }}
            >
                <MenuItem component={ Link } to='/new-item'>List Item</MenuItem>
                <MenuItem component={ Link } to='/new-item'>Request Item</MenuItem>
            </Menu>
        </ShrinkDiv>
    );
}