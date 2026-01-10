import { useState } from "react";
import { createRoot } from "react-dom/client";
import styled from "@emotion/styled";
import { DndContext, type DragEndEvent, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { useReplicant } from "@nodecg/react-hooks";
import { Button, ThemeProvider } from "@mui/material";
import { Add, ArrowDownward, RecordVoiceOver } from "@mui/icons-material";

import type { RunDataActiveRun, RunDataPlayer } from "../../bundles/nodecg-speedcontrol/src/types";

import { CouchEditDialog } from "./commentator-edit-dialog";
import { darkTheme } from "./theme";
import { EditRunnerDialog } from "./stage-view/edit-person-dialog";
import { ScheduleInfo } from "./stage-view/schedule-info";
import { CurrentRunInfo } from "./stage-view/current-run-info";
import { Person } from "./stage-view/person";
// import { DroppableZone } from "./stage-view/droppable-zone";
import { useTalkback } from "./stage-view/use-talkback";

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

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
	);

	function containerOf(id?: string) {
		if (!id) return undefined;
		if (id === ZONES.commentators || (commentatorsRep ?? []).some((c) => c.id === id)) return ZONES.commentators;
		if (id === ZONES.host || id === "host") return ZONES.host;
		if (id === ZONES.runners || allRunnerIds.includes(id)) return ZONES.runners;
		return undefined;
	}

	function handleCrossDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!over) return;

		const from = active.data.current?.type as "commentator" | "runner" | "host";
		const to = containerOf(over.id?.toString());

		// Same-container? defer to existing sort handlers
		if (to === ZONES.commentators && from === "commentator") return handleCommentatorDragEnd(event);
		if (to === ZONES.runners && from === "runner") return handleRunnerDragEnd(event);
		if (!to) return;

		if (to === ZONES.commentators) {
			const comm = active.data.current?.person;
			void nodecg.sendMessage("update-commentator", comm);

			if (from === "host") {
				// Clear host
				void nodecg.sendMessage("delete-commentator", "host");
			}
			// If source was commentator, you may want to delete the original to avoid duplicates:
			// if (from === "commentator" && active.id !== "host") nodecg.sendMessage("delete-commentator", active.id as string);
			return;
		}

		if (to === ZONES.host) {
			// Move previous host into commentators (if any)
			if (host)
				void nodecg.sendMessage("update-commentator", {
					...host,
					id: "",
					customData: { ...host.customData, tag: "" },
				});
			// Promote dropped to host
			void nodecg.sendMessage("update-commentator", toHost(active.data.current?.person));
			// Remove original if it was a commentator
			if (from === "commentator") void nodecg.sendMessage("delete-commentator", active.id as string);
			return;
		}

		if (to === ZONES.runners) {
			// Start simple: only allow reordering existing runners (conversion would need an "add runner" API).
			if (from !== "runner") return;
			// Your existing runner reorder will run via handleRunnerDragEnd when same-container;
			// Here we do nothing for cross-drop.
			return;
		}
	}

	function handleCommentatorDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (active.id !== over?.id) {
			if (!commentatorsRep) return;

			const oldIndex = commentatorsRep.findIndex((commentator) => commentator.id === active.id);
			const newIndex = commentatorsRep.findIndex((commentator) => commentator.id === over?.id);

			const newOrder = arrayMove(commentatorsRep, oldIndex, newIndex);

			setCommentatorsRep(newOrder);
		}
	}

	function handleRunnerDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (active.id !== over?.id) {
			if (!runDataActiveRep) return;

			const oldIndex = runDataActiveRep.teams
				.flatMap((team) => team.players.map((c) => c.id))
				.findIndex((id) => id === active.id);
			const newIndex = runDataActiveRep.teams
				.flatMap((team) => team.players.map((c) => c.id))
				.findIndex((id) => id === over?.id);

			const newOrder = arrayMove(
				runDataActiveRep.teams.flatMap((team) => team.players),
				oldIndex,
				newIndex,
			);

			console.log(newOrder);
			void nodecg.sendMessage("speedcontrol:reorderRunners", { runId: runDataActiveRep.id, newOrder });
		}
	}

	function addCommentator() {
		setEditingCommentator(null);
		setPersonEditDialogOpen("Commentator");
	}

	function handleEditCommentator(commentator: RunDataPlayer) {
		setEditingCommentator(commentator);
		setPersonEditDialogOpen("Commentator");
	}

	function handleEditRunner(runner: RunDataPlayer) {
		setRunner(runner);
		setPersonEditDialogOpen("Runner");
	}

	function handleClosePersonEditDialog() {
		setPersonEditDialogOpen(null);
		setEditingCommentator(null);
	}

	const commentatorAndHostIds = commentatorsRep?.map((c) => c.id) ?? [];

	return (
		<ThemeProvider theme={darkTheme}>
			<DashboardStageViewContainer>
				<TopBar>
					<CurrentRunInfo />
					<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
						{/* <Button
							onClick={toggleTalkToAll}
							color="primary"
							variant={currentTalkbackTargets.length === allIds.length ? "contained" : "outlined"}
						>
							Talk to All
						</Button> */}
					</div>
					<ScheduleInfo />
				</TopBar>
				<StageContainer>
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
				</BottomBar>
			</DashboardStageViewContainer>
			<CouchEditDialog
				key={editingCommentator?.id ?? "new-commentator"}
				open={personEditDialogOpen === "Commentator"}
				onClose={handleClosePersonEditDialog}
				person={editingCommentator ?? undefined}
			/>
			<EditRunnerDialog
				key={runner?.id ?? "new-runner"}
				open={personEditDialogOpen === "Runner"}
				onClose={handleClosePersonEditDialog}
				runner={runner ?? undefined}
			/>
		</ThemeProvider>
	);
}

createRoot(document.getElementById("root")!).render(<DashboardStageView />);
