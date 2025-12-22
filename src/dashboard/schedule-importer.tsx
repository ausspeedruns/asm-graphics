import { useState } from "react";
import { createRoot } from "react-dom/client";

import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Button,
	Checkbox,
	FormControlLabel,
	Stack,
	ThemeProvider,
} from "@mui/material";
import { RichTreeView, TreeViewBaseItem } from "@mui/x-tree-view";
import { darkTheme } from "./theme";
import { useReplicant } from "@nodecg/react-hooks";
import { RunDataArray } from "@asm-graphics/types/RunData";

const layoutsRegex = /LAYOUT:\s*(.*)/;
const unknownLayoutLabel = "Unknown Layout";
function collectLayouts(runDataArray: RunDataArray): TreeViewBaseItem[] {
	const layouts: Record<string, { label: string; runId: string }[]> = {};
	runDataArray.forEach((run) => {
		const gameName = run.game ?? `??? - ${run.id}`;

		if (Object.hasOwn(run.customData, "specialRequirements")) {
			const match = layoutsRegex.exec(run.customData.specialRequirements);

			if (match) {
				if (!layouts[match[1]]) {
					layouts[match[1]] = [];
				}

				layouts[match[1]].push({
					label: gameName,
					runId: run.id,
				});
			} else {
				if (!layouts[unknownLayoutLabel]) {
					layouts[unknownLayoutLabel] = [];
				}

				layouts[unknownLayoutLabel].push({
					label: gameName,
					runId: run.id,
				});
			}
		} else {
			if (!layouts[unknownLayoutLabel]) {
				layouts[unknownLayoutLabel] = [];
			}

			layouts[unknownLayoutLabel].push({
				label: gameName,
				runId: run.id,
			});
		}
	});

	const layoutsArray = Object.entries(layouts).map(([layout, runs]) => {
		return {
			id: `DRAWER-${layout}`,
			label: layout,
			children: runs.map((run) => ({
				id: run.runId,
				label: run.label,
				data: run,
			})),
		};
	});

	return layoutsArray;
}

export const DashScheduleImporter = () => {
	const [loadRunOnSelect, setLoadRunOnSelect] = useState(false);
	const [runsRep] = useReplicant<RunDataArray>("runDataArray", { bundle: "nodecg-speedcontrol" });

	const layouts = collectLayouts(runsRep ?? []);

	function loadRun(_event: React.SyntheticEvent | null, itemId: string, isSelected: boolean) {
		if (!isSelected || !loadRunOnSelect) return;
		if (itemId.startsWith("DRAWER-")) return;

		const runId = itemId;
		void nodecg.sendMessageToBundle("changeActiveRun", "nodecg-speedcontrol", runId);
	}

	return (
		<ThemeProvider theme={darkTheme}>
			<Stack spacing={2}>
				<Button
					variant="contained"
					color="secondary"
					fullWidth
					onClick={() => nodecg.sendMessage("scheduleImport:import")}
				>
					Import {nodecg.bundleConfig?.graphql?.event} schedule
				</Button>
				<Button
					variant="contained"
					color="secondary"
					fullWidth
					onClick={() => nodecg.sendMessage("scheduleImport:getGameYears")}
				>
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
												fontStyle: shouldNotHaveYear ? "italic" : undefined,
												opacity: shouldNotHaveYear ? 0.4 : undefined,
											}}
											key={run.id}
										>
											{run.game}
										</li>
									);
								})}
						</ul>
					</AccordionDetails>
				</Accordion>

				<FormControlLabel
					control={
						<Checkbox checked={loadRunOnSelect} onChange={(_, checked) => setLoadRunOnSelect(checked)} />
					}
					label="Load Run on Select"
				/>

				<Accordion>
					<AccordionSummary>Runs and Layouts</AccordionSummary>
					<AccordionDetails>
						<RichTreeView items={layouts} onItemSelectionToggle={loadRun} />
					</AccordionDetails>
				</Accordion>
			</Stack>
		</ThemeProvider>
	);
};

createRoot(document.getElementById("root")!).render(<DashScheduleImporter />);
