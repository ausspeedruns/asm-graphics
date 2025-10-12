import { useState } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { useReplicant } from "@nodecg/react-hooks";
import { Button, ThemeProvider } from "@mui/material";
import { Add, ArrowDownward, RecordVoiceOver } from "@mui/icons-material";

import type { Commentator } from "@asm-graphics/types/OverlayProps";
import type { RunDataActiveRun, RunDataPlayer } from "../../bundles/nodecg-speedcontrol/src/types";

import { CouchEditDialog } from "./commentator-edit-dialog";
import { darkTheme } from "./theme";
import { EditRunnerDialog } from "./stage-view/edit-person-dialog";
import { ScheduleInfo } from "./stage-view/schedule-info";
import { CurrentRunInfo } from "./stage-view/current-run-info";
import { Person } from "./stage-view/person";
import { DroppableZone } from "./stage-view/droppable-zone";
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

function toCommentator(person: Commentator | RunDataPlayer): Commentator {
	if ("teamID" in person) {
		return {
			id: "", // let extension assign if new
			name: person.name,
			pronouns: person.pronouns,
			twitch: person.social?.twitch,
			microphone: person.customData?.microphone,
		};
	}
	return {
		...person,
		tag: person.id === "host" ? undefined : person.tag,
		id: person.id === "host" ? "" : person.id,
	};
}

function toHost(person: Commentator | RunDataPlayer): Commentator {
	const base =
		"teamID" in person
			? {
					name: person.name,
					pronouns: person.pronouns,
					twitch: person.social?.twitch,
					microphone: person.customData?.microphone,
				}
			: {
					name: person.name,
					pronouns: person.pronouns,
					twitch: person.twitch,
					microphone: person.microphone,
				};
	return { id: "host", tag: "Host", ...base };
}

export function DashboardStageView() {
	const [commentatorsRep, setCommentatorsRep] = useReplicant<Commentator[]>("commentators");
	const [runDataActiveRep] = useReplicant<RunDataActiveRun>("runDataActiveRun", { bundle: "nodecg-speedcontrol" });
	const [gameAudioIndex] = useReplicant<number>("game-audio-indicator");
	const [editingCommentator, setEditingCommentator] = useState<Commentator | null>(null);
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
			const comm = toCommentator(active.data.current?.person as any);
			nodecg.sendMessage("update-commentator", comm);

			if (from === "host") {
				// Clear host
				nodecg.sendMessage("delete-commentator", "host");
			}
			// If source was commentator, you may want to delete the original to avoid duplicates:
			// if (from === "commentator" && active.id !== "host") nodecg.sendMessage("delete-commentator", active.id as string);
			return;
		}

		if (to === ZONES.host) {
			// Move previous host into commentators (if any)
			if (host) nodecg.sendMessage("update-commentator", toCommentator(host));
			// Promote dropped to host
			nodecg.sendMessage("update-commentator", toHost(active.data.current?.person as any));
			// Remove original if it was a commentator
			if (from === "commentator") nodecg.sendMessage("delete-commentator", active.id as string);
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
			nodecg.sendMessage("speedcontrol:reorderRunners", { runId: runDataActiveRep.id, newOrder });
		}
	}

	function addCommentator() {
		setEditingCommentator(null);
		setPersonEditDialogOpen("Commentator");
	}

	function handleEditCommentator(commentator: Commentator) {
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
						<i>I am aware this is a bit buggy. It will be remade next event.</i>
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
					<DndContext onDragEnd={handleCrossDragEnd} sensors={sensors}>
						<RowHeading>
							Commentators
							{/* <Button
								startIcon={<RecordVoiceOver />}
								onClick={toggleTalkbackCommentators}
								color="primary"
								variant={
									isTalkingToAllCommentators &&
									currentTalkbackTargets.length === allCommentatorIds.length
										? "contained"
										: "outlined"
								}
							>
								Talk to Commentators
							</Button> */}
						</RowHeading>
						<StageRow>
							<DroppableZone id="zone:commentators">
								<SortableContext items={commentatorAndHostIds} strategy={horizontalListSortingStrategy}>
									{commentatorsRep
										?.filter((c) => c.id !== "host")
										?.map((c) => (
											<Person
												key={c.id}
												person={c}
												handleEditPerson={handleEditCommentator}
												currentTalkbackTargets={currentTalkbackTargets}
												updateTalkbackTargets={setCurrentTalkbackTargets}
											/>
										))}
								</SortableContext>
							</DroppableZone>
							<Button color="inherit" onClick={addCommentator}>
								<Add />
							</Button>
							<DroppableZone id="zone:host" isHost isEmpty={!host}>
								{host && (
									<Person
										person={host}
										handleEditPerson={handleEditCommentator}
										currentTalkbackTargets={currentTalkbackTargets}
										updateTalkbackTargets={setCurrentTalkbackTargets}
									/>
								)}
							</DroppableZone>
						</StageRow>
						<hr style={{ width: "50%", opacity: 0.5 }} />
						<RowHeading>
							Runners{" "}
							{/* <Button
								startIcon={<RecordVoiceOver />}
								onClick={toggleTalkbackRunners}
								color="primary"
								variant={
									isTalkingToAllRunners && currentTalkbackTargets.length === allRunnerIds.length
										? "contained"
										: "outlined"
								}
							>
								Talk to Runners
							</Button> */}
						</RowHeading>
						<DroppableZone id="zone:runners">
							<StageRow>
								<SortableContext
									items={
										runDataActiveRep?.teams.flatMap((team) => team.players.map((c) => c.id)) ?? []
									}
									strategy={horizontalListSortingStrategy}
								>
									{runDataActiveRep?.teams.flatMap((team, i) =>
										team.players.map((c, j) => (
											<Person
												key={c.id}
												person={c}
												isRunner
												handleEditPerson={handleEditRunner}
												currentTalkbackTargets={currentTalkbackTargets}
												updateTalkbackTargets={setCurrentTalkbackTargets}
												tempIndex={i + j}
												audioIndex={gameAudioIndex}
											/>
										)),
									)}
								</SortableContext>
							</StageRow>
						</DroppableZone>
					</DndContext>
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
