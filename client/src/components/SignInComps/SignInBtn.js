import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";

const FlexBtn = styled(Button)`
    flex: 0 1 auto;
`;

export default function SignInBtn(props) {
    const url = props.url;

    return (
        <FlexBtn variant="contained" component={ Link } to={ url } color="button">
            Sign In
        </FlexBtn>
    );
}