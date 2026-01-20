import { useState } from "react";
import { createRoot } from "react-dom/client";
import styled from "@emotion/styled";
import { useReplicant } from "@nodecg/react-hooks";
import { Button, StyledEngineProvider, ThemeProvider } from "@mui/material";
import { ArrowDownward, Campaign } from "@mui/icons-material";

import type { RunDataActiveRun, RunDataPlayer } from "../../bundles/nodecg-speedcontrol/src/types";

import { darkTheme } from "./theme";
import { EditPersonDialog } from "./stage-view/edit-person-dialog";
import { ScheduleInfo } from "./stage-view/schedule-info";
import { RunInfo } from "./stage-view/run-info";
import { Person } from "./stage-view/person";
// import { DroppableZone } from "./stage-view/droppable-zone";
import { useTalkback } from "./stage-view/use-talkback";
import { MainStage } from "./stage-view/main-stage";
import { RunTimeline } from "./stage-view/run-timeline";
import { UpcomingRun } from "./stage-view/upcoming-run";
import { TimeHeader } from "./stage-view/time-header";
import { StatusLights } from "./stage-view/status-lights";
import { CropGameDialog } from "./stage-view/crop-game";
import type { RunDataArray } from "@asm-graphics/types/RunData";

const DashboardStageViewContainer = styled.div``;

const TopBar = styled.div`
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
`;

const StageContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	padding: 20px 0;
`;

const StageRow = styled.div`
	display: flex;
	justify-content: space-around;
	flex-wrap: wrap;
	gap: 16px;
`;

const RowHeading = styled.div`
	min-height: 60px;
	display: flex;
	align-items: center;
	gap: 8px;
`;

const BottomBar = styled.div`
	display: flex;
	justify-content: space-around;
	flex-wrap: wrap;
`;

const ZONES = { commentators: "zone:commentators", host: "zone:host", runners: "zone:runners" } as const;

function toHost(person: RunDataPlayer): RunDataPlayer {
	return {
		id: "host",
		name: person.name,
		pronouns: person.pronouns,
		teamID: person.teamID,
		social: {
			twitch: person.social?.twitch,
		},
		customData: {
			microphone: person.customData?.microphone ?? "",
			tag: "Host",
		},
	};
}

const DISPLAY_NEXT_RUNS = 3;

export function DashboardStageView() {
	const [commentatorsRep, setCommentatorsRep] = useReplicant("commentators");
	const [runDataActiveRep] = useReplicant<RunDataActiveRun>("runDataActiveRun", { bundle: "nodecg-speedcontrol" });
	const [runDataArrayRep] = useReplicant<RunDataArray>("runDataArray", { bundle: "nodecg-speedcontrol" });
	const [personId, setPersonId] = useState<string | null>(null);
	const [personEditDialogOpen, setPersonEditDialogOpen] = useState(false);
	const [gameCropDialogOpen, setGameCropDialogOpen] = useState(false);

	const allRunners = runDataActiveRep?.teams.flatMap((team) => team.players);
	const {
		currentTalkbackTargets,
		setCurrentTalkbackTargets,
		isTalkingToAllCommentators,
		isTalkingToAllRunners,
		allCommentatorIds,
		allRunnerIds,
		host,
		allIds,
		toggleTalkbackCommentators,
		toggleTalkbackRunners,
		toggleTalkToAll,
		forceStopTalkback,
	} = useTalkback(commentatorsRep, allRunners);

	function handleClosePersonEditDialog() {
		setPersonEditDialogOpen(false);
	}

	const currentRunIndex = runDataArrayRep?.findIndex((run) => run.id === runDataActiveRep?.id) ?? -1;

	const nextRuns = runDataArrayRep
		?.filter((run) => run.id !== runDataActiveRep?.id)
		.slice(currentRunIndex + 1, currentRunIndex + 1 + DISPLAY_NEXT_RUNS);

	return (
		<StyledEngineProvider injectFirst>
			<head>
				<style>{`body { margin: 0; }`}</style>
			</head>
			<ThemeProvider theme={darkTheme}>
				<DashboardStageViewContainer>
					<TimeHeader />
					<StatusLights />
					<RunInfo run={runDataActiveRep} />
					<TopBar>
						{/* <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}> */}
						{/* <Button
							onClick={toggleTalkToAll}
							color="primary"
							variant={currentTalkbackTargets.length === allIds.length ? "contained" : "outlined"}
						>
							Talk to All
						</Button> */}
						{/* </div> */}
						{/* <ScheduleInfo /> */}
					</TopBar>
					<StageContainer>
						<MainStage
							openPersonEditDialog={(personId) => {
								console.log("Opening edit dialog for person:", personId);
								setPersonId(personId);
								setPersonEditDialogOpen(true);
							}}
							currentTalkbackIds={currentTalkbackTargets}
							setTalkbackIds={setCurrentTalkbackTargets}
						/>
					</StageContainer>
					<div style={{ display: "flex", justifyContent: "center" }}>
						<Button variant="contained" onClick={() => setGameCropDialogOpen(true)}>
							Open Game Crop
						</Button>
						<Button
							style={{ marginLeft: 20 }}
							onClick={toggleTalkToAll}
							color="primary"
							variant={
								currentTalkbackTargets.length === allIds.length || currentTalkbackTargets.length !== 0
									? "contained"
									: "outlined"
							}
							startIcon={<Campaign />}
						>
							{currentTalkbackTargets.length === allIds.length || currentTalkbackTargets.length !== 0
								? "Clear Talkback"
								: "Talk to All"}
						</Button>
					</div>
					<BottomBar>
						{/* <Button color="error" onClick={forceStopTalkback}>
						Force Stop Talkback
					</Button> */}
						<RunTimeline />
					</BottomBar>
					<UpcomingRun />
					<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
						<div>Next Runs</div>
						<div style={{ display: "flex", gap: 8, marginTop: 8 }}>
							{nextRuns?.map((run) => (
								<RunInfo key={run.id} run={run} />
							))}
						</div>
					</div>
				</DashboardStageViewContainer>
				<EditPersonDialog
					key={personId ?? "new-person"}
					personId={personId}
					open={personEditDialogOpen}
					onClose={handleClosePersonEditDialog}
				/>
				<CropGameDialog
					open={gameCropDialogOpen}
					onClose={() => setGameCropDialogOpen(false)}
					onCrop={() => {}}
				/>
			</ThemeProvider>
		</StyledEngineProvider>
	);
}

createRoot(document.getElementById("root")!).render(<DashboardStageView />);
