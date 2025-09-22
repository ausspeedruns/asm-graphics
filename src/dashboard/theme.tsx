import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
	palette: {
		mode: "dark",
		primary: { main: "#CC7722" },
		secondary: { main: "#03a9f4" },
		background: {
			default: "#121212",
			paper: "#1e1e1e",
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: ({ ownerState, theme }) => ({
					backdropFilter: "blur(5px)",
					border: "1px solid rgba(255, 255, 255, 0.2)",
					...(ownerState.variant === "contained" && {
						color: theme.palette.getContrastText(
							ownerState.color && ownerState.color !== "inherit"
								? theme.palette[ownerState.color].main
								: "rgba(255, 255, 255, 0.1)",
						),
						background:
							ownerState.color && ownerState.color !== "inherit"
								? theme.palette[ownerState.color].main
								: "rgba(255, 255, 255, 0.1)",
						"&:hover": {
							background:
								ownerState.color && ownerState.color !== "inherit"
									? theme.palette[ownerState.color].dark
									: "rgba(255, 255, 255, 0.2)",
						},
					}),
				}),
			},
		},
		MuiTextField: {
			defaultProps: {
				variant: "filled",
			},
		},
		MuiFilledInput: {
			styleOverrides: {
				root: {
					backgroundColor: "rgba(0, 0, 0, 0.2)",
					color: "white",
					"&:hover": {
						backgroundColor: "rgba(0, 0, 0, 0.25)",
					},
					"&.Mui-focused": {
						backgroundColor: "rgba(0, 0, 0, 0.25)",
					},
					"&::before, &::after": {
						borderBottom: "none",
					},
				},
			},
		},
		MuiInputLabel: {
			styleOverrides: {
				root: {
					color: "rgba(255, 255, 255, 0.7)",
				},
			},
		},
		MuiInputBase: {
			styleOverrides: {
				input: {
					color: "white",
				},
			},
		},
		MuiCheckbox: {
			styleOverrides: {
				root: {
					color: "rgba(255, 255, 255, 0.7)",
					"&.Mui-checked": {
					color: "white",
					},
				},
			},
		},
		MuiAccordion: {
			styleOverrides: {
				root: {
					backgroundColor: "rgba(255, 255, 255, 0.05)",
					backdropFilter: "blur(5px)",
					border: "1px solid rgba(255, 255, 255, 0.2)",
					"&::before": {
						display: "none",
					},
					"&.Mui-expanded": {
						margin: 0,
					},
				},
			},
		},
		MuiAccordionSummary: {
			styleOverrides: {
				root: {
					"&.Mui-expanded": {
						minHeight: "48px",
					},
				},
				content: {
					"&.Mui-expanded": {
						margin: "12px 0",
					},
				},
			},
		},
		MuiAccordionDetails: {
			styleOverrides: {
				root: {
					backgroundColor: "rgba(0, 0, 0, 0.2)",
					padding: "12px",
				},
			},
		},
	},
});
