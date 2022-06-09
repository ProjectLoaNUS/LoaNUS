import { IconButton, InputAdornment, TextField } from "@mui/material";
import styled from "styled-components";
import { alpha } from '@mui/material/styles';
import SearchIcon from "@mui/icons-material/Search";

const GrowTextField = styled(TextField)`
    flex: 1 0 auto;
`;

const StyledTextField = styled((props) => (
        <GrowTextField {...props} />
    ))(({ theme }) => ({
    '& .MuiFilledInput-root': {
        border: `1px solid ${theme.palette.primary.main}`, // theme.palette.mode == 'light' ? theme.palette.contrast.light : theme.palette.contrast.dark
        borderRadius: 4,
        color: theme.palette.primary.main, // theme.palette.mode == 'light' ? theme.palette.contrast.light : theme.palette.contrast.dark
        transition: theme.transitions.create([
            'border-color',
            'background-color',
            'box-shadow',
        ]),
        '&.Mui-focused': {
            borderColor: theme.palette.accent.main, // theme.palette.mode == 'light' ? theme.palette.contrast.light : theme.palette.contrast.dark
            boxShadow: `${alpha(theme.palette.accent.main, 0.25)} 0 0 0 2px`,
            backgroundColor: '#051622'
        },
        '&:hover': {
            borderColor: theme.palette.accent.main,
            backgroundColor: '#30404F'
        }
    },
    '& .MuiInputLabel-root': {
        color: theme.palette.primary.main // theme.palette.mode == 'light' ? theme.palette.contrast.light : theme.palette.contrast.dark
    },
}));

export default function SearchTextField() {
    return (
        <StyledTextField
            variant="filled" 
            label="Search" 
            InputProps={{
                endAdornment: 
                    <InputAdornment position="end">
                        <IconButton color="primary">
                            <SearchIcon />
                        </IconButton>
                    </InputAdornment>,
                disableUnderline: true
            }} />
    );
}