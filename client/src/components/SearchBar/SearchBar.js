import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SearchTextField from "./SearchTextField";
import { CentredGrowDiv } from "../FlexDiv";

export default function SearchBar() {
    return (
        <CentredGrowDiv>
            <SearchTextField />
            <IconButton color="contrast">
                <SearchIcon />
            </IconButton>
        </CentredGrowDiv>
    );
}