import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            light: '#576676',
            main: '#2d3c4a',
            dark: '#051622',
            contrastText: '#ffffff'
        },
        secondary: {
            light: '#ffb765',
            main: '#eb8736',
            dark: '#b35900'
        }
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
});