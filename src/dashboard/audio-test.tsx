import React from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";

import { Button, ThemeProvider } from "@mui/material";
import { darkTheme } from "./theme";

const Grid = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
`;

export const Settings: React.FC = () => {
	return (
		<ThemeProvider theme={darkTheme}>
			Do not touch during an event for the love of god
			<Grid>
				<Button variant="contained" fullWidth onClick={() => nodecg.sendMessage("transition:toGame", { to: "idk", from: "test" })}>
					To Game
				</Button>
				<Button variant="contained" fullWidth onClick={() => nodecg.sendMessage("transition:toIntermission", { to: "idk", from: "test" })}>
					To Transition
				</Button>
			</Grid>
		</ThemeProvider>
	);
};

createRoot(document.getElementById("root")!).render(<Settings />);
