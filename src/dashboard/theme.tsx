import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
	palette: {
		primary: { main: "#03a9f4" },
		secondary: { main: "#CC7722" },
	},
	colorSchemes: {
		dark: true,
	},
});
