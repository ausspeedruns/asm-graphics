import { useState } from "react";
import { createRoot } from "react-dom/client";

import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Checkbox,
	FormControlLabel,
	Stack,
	ThemeProvider,
} from "@mui/material";
import { RichTreeView, type TreeViewBaseItem } from "@mui/x-tree-view";
import { darkTheme } from "./theme";
import { useReplicant } from "@nodecg/react-hooks";
import type { RunDataArray } from "@asm-graphics/types/RunData";

const layoutsRegex = /LAYOUT:\s*(.*)/;
const unknownLayoutLabel = "Unknown Layout";
function collectLayouts(runDataArray: RunDataArray): TreeViewBaseItem[] {
	const layouts: Record<string, { label: string; runId: string }[]> = {};
	runDataArray.forEach((run) => {
		const gameName = run.game ?? `??? - ${run.id}`;

		if (Object.hasOwn(run.customData, "specialRequirements")) {
			const match = layoutsRegex.exec(run.customData.specialRequirements ?? "");

			if (match) {
				const layoutName = match[1]?.trim();

				if (!layoutName) {
					if (!layouts[unknownLayoutLabel]) {
						layouts[unknownLayoutLabel] = [];
					}

					layouts[unknownLayoutLabel].push({
						label: gameName,
						runId: run.id,
					});

					return;
				}

				if (!layouts[layoutName]) {
					layouts[layoutName] = [];
				}

				layouts[layoutName].push({
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
