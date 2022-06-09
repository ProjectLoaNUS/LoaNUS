import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            light: '#ffffff',
            main: '#ffffff',
            contrastText: '#212121'
        },
        secondary: {
            light: '#2d3c4a',
            main: '#2d3c4a',
            contrastText: '#ffffff'
        },
        accent: {
            main: '#eb8736',
            contrastText: '#ffffff'
        }
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
});