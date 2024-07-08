import { createRoot } from "react-dom/client";

import { Accordion, AccordionDetails, AccordionSummary, Button, ThemeProvider } from "@mui/material";
import { darkTheme } from "./theme";
import { useReplicant } from "@nodecg/react-hooks";
import { RunDataArray } from "@asm-graphics/types/RunData";

export const DashScheduleImporter = () => {
	const [runsRep] = useReplicant<RunDataArray>("runDataArray", { bundle: "nodecg-speedcontrol" });

	return (
		<ThemeProvider theme={darkTheme}>
			<Button
				variant="contained"
				color="secondary"
				fullWidth
				onClick={() => nodecg.sendMessage("scheduleImport:import")}>
				Import {nodecg.bundleConfig?.graphql?.event} schedule
			</Button>
			<Button
				variant="contained"
				color="secondary"
				fullWidth
				onClick={() => nodecg.sendMessage("scheduleImport:getGameYears")}
				style={{ marginTop: 8 }}>
				Set the Game Years
			</Button>
			<Accordion>
				<AccordionSummary>List of Runs with No Year</AccordionSummary>
				<AccordionDetails>
					<ul>
						{runsRep
							?.filter((run) => !run.release)
							.map((run) => {
								const shouldNotHaveYear = run.system === "IRL";
								return (
									<li
										style={{
											fontStyle: shouldNotHaveYear ? "italic": undefined,
											opacity: shouldNotHaveYear ? 0.4: undefined,
										}}
										key={run.id}>
										{run.game}
									</li>
								);
							})}
					</ul>
				</AccordionDetails>
			</Accordion>
			<Button
				variant="contained"
				color="secondary"
				fullWidth
				onClick={() => nodecg.sendMessage("scheduleImport:inject-5-min-runs")}
				style={{ marginTop: 8 }}>
				Add 5 min run games (ONLY PRESS DURING THE RUN BEFORE)
			</Button>
		</ThemeProvider>
	);
};

createRoot(document.getElementById("root")!).render(<DashScheduleImporter />);
