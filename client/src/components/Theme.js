import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            light: '#ffffff',
            main: '#fafdf3',
            dark: '#c7cac0',
            contrastText: '#212121'
        },
        secondary: {
            light: '#2d3c4a',
            main: '#2d3c4a',
            dark: '#30404F',
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