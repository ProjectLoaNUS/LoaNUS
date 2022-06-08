import styled from "styled-components";
import { IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { GrowDiv } from "./FlexDiv";
import SearchTextField from "./SearchTextField";

const SearchCompDiv = styled(GrowDiv)`
    display: flex;
    align-items: center;
    justify-content: center;
`;

export default function SearchBar() {
    return (
        <SearchCompDiv>
            <SearchTextField />
            <IconButton color="contrast">
                <SearchIcon />
            </IconButton>
        </SearchCompDiv>
    );
}