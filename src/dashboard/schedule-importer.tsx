import React from "react";
import { createRoot } from "react-dom/client";

import { Button, ThemeProvider } from "@mui/material";
import { darkTheme } from "./theme";

export const DashScheduleImporter: React.FC = () => {
	return (
		<ThemeProvider theme={darkTheme}>
			<Button
				variant="contained"
				color="secondary"
				fullWidth
				onClick={() => nodecg.sendMessage("scheduleImport:import")}
			>
				Import {nodecg.bundleConfig?.graphql?.event} schedule
			</Button>
		</ThemeProvider>
	);
};

createRoot(document.getElementById("root")!).render(<DashScheduleImporter />);
