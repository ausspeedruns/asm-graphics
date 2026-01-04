import type { RunDataArray } from "@asm-graphics/types/RunData";
import { Button, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { useReplicant } from "@nodecg/react-hooks";

export function GameYearsSettings() {
	const [runsRep] = useReplicant<RunDataArray>("runDataArray", { bundle: "nodecg-speedcontrol" });
	const [ausSpeedrunsWebsiteSettings] = useReplicant("ausspeedruns-website:settings");

	const runsWithoutYear = runsRep?.filter((run) => !run.release) ?? [];

	return (
		<div>
			<h3>Schedule Importer</h3>

			<div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 16 }}>
				<Button
					disabled={!ausSpeedrunsWebsiteSettings?.eventSlug}
					variant="contained"
					color="secondary"
					fullWidth
					onClick={() => nodecg.sendMessage("scheduleImport:import")}
				>
					Import {ausSpeedrunsWebsiteSettings?.eventSlug} schedule
				</Button>
				<Button color="secondary" fullWidth onClick={() => nodecg.sendMessage("scheduleImport:getGameYears")}>
					Set the Game Years
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
									{run.game}
								</li>
							);
						})}
					</ul>
				</AccordionDetails>
			</Accordion>
		</div>
	);
}
