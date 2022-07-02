import { IconButton } from "@mui/material";
import ChatIcon from '@mui/icons-material/Chat';
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../database/auth";
import { ShrinkDiv } from "../FlexDiv";
import { theme } from "../Theme";
import { CHAT, SIGN_IN } from "../../pages/routes";

const ContrastIconBtn = styled(IconButton)`
    color: ${theme.palette.primary.contrastText};
`;

export default function ChatBtn() {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const handleClick = () => {
        if (user) {
            navigate(CHAT);
        } else {
            navigate(SIGN_IN, {state: {open: true}});
        }
    }

    return (
        <ShrinkDiv>
            <ContrastIconBtn 
              id="create-btn"
              onClick={handleClick}>
                <ChatIcon />
            </ContrastIconBtn>
        </ShrinkDiv>
    );
}