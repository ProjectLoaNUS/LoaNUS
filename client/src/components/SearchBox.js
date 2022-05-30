import { FilledInput, FormControl, InputLabel, TextField } from "@mui/material";
import styled from "styled-components";
import { theme } from "./Theme";

const GrowTextField = styled(TextField)`
    flex: 1 0 auto;
`;

const SearchField = styled((props) => (
        <GrowTextField InputProps={{ disableUnderline: true }} {...props} />
    ))(({ theme }) => ({
    '& .MuiFilledInput-root': {
        border: `1px solid ${theme.palette.contrast.light}`, // theme.palette.mode == 'light' ? theme.palette.contrast.light : theme.palette.contrast.dark
        borderRadius: 4,
        color: theme.palette.contrast.light // theme.palette.mode == 'light' ? theme.palette.contrast.light : theme.palette.contrast.dark
    },
    '& .MuiInputLabel-root': {
        color: theme.palette.contrast.light // theme.palette.mode == 'light' ? theme.palette.contrast.light : theme.palette.contrast.dark
    },
    '&:focus': {
        borderColor: theme.palette.contrast.light // theme.palette.mode == 'light' ? theme.palette.contrast.light : theme.palette.contrast.dark
    }
}));

export default function SearchBox() {
    return (
        <SearchField variant="filled" label="Search" />
    );
}