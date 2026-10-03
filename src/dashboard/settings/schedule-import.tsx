import type { RunDataArray } from "@asm-graphics/types/RunData";
import { Download } from "@mui/icons-material";
import { Button, Accordion, AccordionSummary, AccordionDetails, TextField } from "@mui/material";
import { useReplicant } from "@nodecg/react-hooks";

export function GameYearsSettings() {
	const [runsRep] = useReplicant<RunDataArray>("runDataArray", { bundle: "nodecg-speedcontrol" });
	const [ausSpeedrunsWebsiteSettings, setAusSpeedrunsWebsiteSettings] = useReplicant("ausspeedruns-website:settings");

	if (!ausSpeedrunsWebsiteSettings) {
		return <div>Loading...</div>;
	}

	const runsWithoutYear = runsRep?.filter((run) => !run.release) ?? [];

	function handleImport() {
		console.log("Importing schedule...");
		nodecg.sendMessage("scheduleImport:import");
	}

	function handleDownload() {
		const blob = new Blob([JSON.stringify(runsRep)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "runs.json";
		a.click();
		URL.revokeObjectURL(url);
	}

	return (
		<div>
			<h3>Schedule Importer</h3>

			<TextField
				label="Event Slug"
				fullWidth
				value={ausSpeedrunsWebsiteSettings.eventSlug}
				onChange={(e) =>
					setAusSpeedrunsWebsiteSettings({ ...ausSpeedrunsWebsiteSettings, eventSlug: e.target.value })
				}
				margin="dense"
			/>

			<div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 16 }}>
				<Button
					disabled={!ausSpeedrunsWebsiteSettings?.eventSlug}
					variant="contained"
					color="secondary"
					fullWidth
					onClick={handleImport}
				>
					Import {ausSpeedrunsWebsiteSettings?.eventSlug} schedule
				</Button>
			</div>
			<Accordion>
				<AccordionSummary>List of Runs with No Year ({runsWithoutYear.length})</AccordionSummary>
				<AccordionDetails>
					<ul>
						{runsWithoutYear.map((run) => {
							const shouldNotHaveYear = run.system === "IRL";
							return (
								<li
									style={{
										fontStyle: shouldNotHaveYear ? "italic" : undefined,
										opacity: shouldNotHaveYear ? 0.4 : undefined,
									}}
									key={run.id}
								>
									<a
										href={`https://google.com/search?q=${encodeURIComponent(run.game ?? "")}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										{run.game}
									</a>
								</li>
							);
						})}
					</ul>
				</AccordionDetails>
			</Accordion>
			<Button onClick={handleDownload} startIcon={<Download />}>
				Download Current runs.json
			</Button>
		</div>
	);
}
