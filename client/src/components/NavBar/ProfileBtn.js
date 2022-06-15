import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconButton, Menu } from '@mui/material';
import { MenuItem } from '@mui/material';
import { useAuth } from '../../database/auth';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { ShrinkDiv } from '../FlexDiv';
import styled from 'styled-components';
import { theme } from '../Theme';

const ContrastIconBtn = styled(IconButton)`
    color: ${theme.palette.primary.contrastText};
`;

export default function ProfileBtn() {
    const [ anchorEl, setAnchorEl ] = useState(null);
    const open = Boolean(anchorEl);
    const { signOut } = useAuth();
    
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
    }

    function logOutNow() {
        handleClose();
        signOut();
    }

    return (
        <ShrinkDiv>
            <ContrastIconBtn 
              id="profile-btn"
              aria-controls={'profile-menu'}
              aria-haspopup="true"
              onClick={handleClick}>
                  <AccountCircleIcon />
              </ContrastIconBtn>
            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                  'arial-labelledby': 'basic-button'
              }}
            >
                <MenuItem component={ Link } to='/profile'>Account</MenuItem>
                <MenuItem onClick={logOutNow}>Sign Out</MenuItem>
            </Menu>
        </ShrinkDiv>
    );
}