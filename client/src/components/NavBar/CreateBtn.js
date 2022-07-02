import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { ShrinkDiv } from '../FlexDiv';
import styled from 'styled-components';
import { theme } from '../Theme';
import { useAuth } from '../../database/auth';
import { NEW_ITEM, SIGN_IN } from '../../pages/routes';

const ContrastIconBtn = styled(IconButton)`
    color: ${theme.palette.primary.contrastText};
`;

export default function CreateBtn() {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const handleClick = (event) => {
        if (user) {
            navigate(NEW_ITEM);
        } else {
            navigate(SIGN_IN, {state: {open: true, message: "Sign in before requesting or listing an item"}});
        }
    }

    return (
        <ShrinkDiv>
            <ContrastIconBtn 
              id="create-btn"
              onClick={handleClick}>
                <AddCircleOutline />
            </ContrastIconBtn>
        </ShrinkDiv>
    );
}