import { createTheme } from '@mui/material/styles';
import lightBlue from '@mui/material/colors/lightBlue';

export const darkTheme = createTheme({
	palette: { mode: 'dark', primary: { main: lightBlue[500] }, secondary: { main: '#CC7722' } },
});
