import { useState } from "react";
import { createRoot } from "react-dom/client";
import styled from "@emotion/styled";
import { useReplicant } from "@nodecg/react-hooks";
import { Button, StyledEngineProvider, ThemeProvider } from "@mui/material";
import { ArrowDownward } from "@mui/icons-material";

import type { RunDataActiveRun, RunDataPlayer } from "../../bundles/nodecg-speedcontrol/src/types";

import { darkTheme } from "./theme";
import { EditPersonDialog } from "./stage-view/edit-person-dialog";
import { ScheduleInfo } from "./stage-view/schedule-info";
import { CurrentRunInfo } from "./stage-view/current-run-info";
import { Person } from "./stage-view/person";
// import { DroppableZone } from "./stage-view/droppable-zone";
import { useTalkback } from "./stage-view/use-talkback";
import { MultipleContainers } from "./stage-view/main-stage";
import { RunTimeline } from "./stage-view/run-timeline";
import { UpcomingRun } from "./stage-view/upcoming-run";
import { TimeHeader } from "./stage-view/time-header";
import { StatusLights } from "./stage-view/status-lights";
import { CropGameDialog } from "./stage-view/crop-game";

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

export function DashboardStageView() {
	const [commentatorsRep, setCommentatorsRep] = useReplicant("commentators");
	const [runDataActiveRep] = useReplicant<RunDataActiveRun>("runDataActiveRun", { bundle: "nodecg-speedcontrol" });
	const [gameAudioIndex] = useReplicant("game-audio-indicator");
	const [editingCommentator, setEditingCommentator] = useState<RunDataPlayer | null>(null);
	const [runner, setRunner] = useState<RunDataPlayer | null>(null);
	const [personEditDialogOpen, setPersonEditDialogOpen] = useState<"Commentator" | "Runner" | null>(null);
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
		setPersonEditDialogOpen(null);
		setEditingCommentator(null);
	}

	return (
		<StyledEngineProvider injectFirst>
			<head>
				<style>{`body { margin: 0; }`}</style>
			</head>
			<ThemeProvider theme={darkTheme}>
				<DashboardStageViewContainer>
					<TimeHeader />
					<StatusLights />
					<CurrentRunInfo />
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
						<MultipleContainers />
					</StageContainer>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							opacity: 0.7,
							margin: 40,
						}}
					>
						Crowd <ArrowDownward />
					</div>
					<BottomBar>
						{/* <Button color="error" onClick={forceStopTalkback}>
						Force Stop Talkback
					</Button> */}
						<RunTimeline />
					</BottomBar>
					<UpcomingRun />
					<Button onClick={() => setGameCropDialogOpen(true)}>Open Game Crop</Button>
				</DashboardStageViewContainer>
				<EditPersonDialog
					key={runner?.id ?? "new-runner"}
					open={personEditDialogOpen === "Runner"}
					onClose={handleClosePersonEditDialog}
					runner={runner ?? undefined}
				/>
				<CropGameDialog
					open={gameCropDialogOpen}
					videoSourceName="TestImage1"
					onClose={() => setGameCropDialogOpen(false)}
					onCrop={() => {}}
				/>
			</ThemeProvider>
		</StyledEngineProvider>
	);
}

createRoot(document.getElementById("root")!).render(<DashboardStageView />);
