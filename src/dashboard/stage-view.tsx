import { useState } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { DndContext, DragEndEvent, useDroppable, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useReplicant } from "@nodecg/react-hooks";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	IconButton,
	TextField,
	DialogTitle,
	ToggleButtonGroup,
	ToggleButton,
	Autocomplete,
	ThemeProvider,
} from "@mui/material";
import { Add, ArrowDownward, Edit, HeadsetMic, Mic, MicOff } from "@mui/icons-material";

import { Headsets } from "../extensions/audio-data";

import type { Commentator } from "@asm-graphics/types/OverlayProps";
import type { RunDataActiveRun, RunDataPlayer } from "../../bundles/nodecg-speedcontrol/src/types";
import { CouchEditDialog } from "./commentator-edit-dialog";
import { darkTheme } from "./theme";
import CloseIcon from "@mui/icons-material/Close";
import useSurroundingRuns from "../hooks/useSurroundingRuns";
import { format } from "date-fns/format";
import { formatDistanceStrict } from "date-fns";

const DashboardStageViewContainer = styled.div``;

const TopBar = styled.div`
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
`;

const StageContainer = styled.div`
	height: 400px;

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

export function DashboardStageView() {
	const [hostRep] = useReplicant<Commentator>("host");
	const [commentatorsRep, setCommentatorsRep] = useReplicant<Commentator[]>("commentators");
	const [runStartTimeRep] = useReplicant<number | null>("runStartTime");
	const [runDataActiveRep] = useReplicant<RunDataActiveRun>("runDataActiveRun", { bundle: "nodecg-speedcontrol" });
	const [editingCommentator, setEditingCommentator] = useState<Commentator | null>(null);
	const [runner, setRunner] = useState<RunDataPlayer | null>(null);
	const [personEditDialogOpen, setPersonEditDialogOpen] = useState<"Commentator" | "Runner" | null>(null);
	const [currentTalkbackTargets, setCurrentTalkbackTargets] = useState<string[]>([]);
	const [_, _1, nextRun] = useSurroundingRuns();

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
	);

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
		console.log("Closing dialog");
		setPersonEditDialogOpen(null);
		setEditingCommentator(null);
	}

	function forceStopTalkback() {
		setCurrentTalkbackTargets([]);
		nodecg.sendMessage("x32:talkback-stop");
	}

	const allCommentatorIds = commentatorsRep?.map((c) => c.id) ?? [];
	const allRunnerIds = runDataActiveRep?.teams.flatMap((team) => team.players.map((c) => c.id)) ?? [];
	const allIds = [...allCommentatorIds, ...allRunnerIds, ...(hostRep?.id ? [hostRep.id] : [])];
	const isTalkingToAllRunners = allRunnerIds.every((id) => currentTalkbackTargets.includes(id));
	const isTalkingToAllCommentators =
		commentatorsRep?.length && commentatorsRep.every((c) => currentTalkbackTargets.includes(c.id));

	function toggleTalkbackRunners() {
		if (isTalkingToAllRunners) {
			setCurrentTalkbackTargets([]);
			nodecg.sendMessage("x32:talkback-stop");
		} else {
			setCurrentTalkbackTargets(allRunnerIds);
			nodecg.sendMessage("x32:talkback-start", "runners"); // For now
		}
	}

	function toggleTalkbackCommentators() {
		if (isTalkingToAllCommentators) {
			setCurrentTalkbackTargets([]);
			nodecg.sendMessage("x32:talkback-stop");
		} else {
			setCurrentTalkbackTargets(commentatorsRep?.map((c) => c.id) ?? []);
			nodecg.sendMessage("x32:talkback-start", "couch"); // For now
		}
	}

	function toggleTalkToAll() {
		if (currentTalkbackTargets.length > 0) {
			setCurrentTalkbackTargets([]);
			nodecg.sendMessage("x32:talkback-stop");
		} else {
			setCurrentTalkbackTargets(allIds);
			nodecg.sendMessage("x32:talkback-start", "all"); // For now
		}
	}

	let estimatedEndTime = "Error";
	if (runDataActiveRep?.estimateS) {
		if (runStartTimeRep) {
			estimatedEndTime = `Est End: ${format(runStartTimeRep + runDataActiveRep.estimateS * 1000, "h:mm b")}`;
		} else if (runDataActiveRep.scheduledS) {
			const isoTimeString = new Date(
				runDataActiveRep.scheduledS + runDataActiveRep.estimateS * 1000,
			).toISOString();
			console.log(runDataActiveRep.scheduledS, runDataActiveRep.estimateS, isoTimeString);
			estimatedEndTime = `Run should end at: ${format(runDataActiveRep.scheduledS + runDataActiveRep.estimateS * 1000, "h:mm b")}`;
		}
	} else {
		estimatedEndTime = "No estimate on run";
	}

	const differenceTime =
		runDataActiveRep?.scheduledS && runStartTimeRep
			? formatDistanceStrict(runStartTimeRep, runDataActiveRep?.scheduledS * 1000, {
					roundingMethod: "ceil",
					unit: "minute",
				})
			: "Run not started";

	return (
		<ThemeProvider theme={darkTheme}>
			<DashboardStageViewContainer>
				<TopBar>
					<div style={{ display: "flex", flexDirection: "column" }}>
						<span style={{ fontWeight: "bold" }}>{runDataActiveRep?.game}</span>
						<span>{runDataActiveRep?.category}</span>
						<span>Est: {runDataActiveRep?.estimate}</span>
					</div>
					<div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
						<span>
							{runStartTimeRep ? (
								<>
									Run started at <b>{format(runStartTimeRep, "h:mm b")}</b>
								</>
							) : (
								"Run not started"
							)}
						</span>
						<span>{estimatedEndTime}</span>
						<span>
							We are {differenceTime}{" "}
							{runDataActiveRep?.scheduledS &&
							runStartTimeRep &&
							runStartTimeRep <= runDataActiveRep?.scheduledS * 1000
								? "AHEAD"
								: "BEHIND"}
						</span>
						<span>
							{nextRun?.scheduledS
								? `Next run starts at ${format(nextRun.scheduledS * 1000, "h:mm b")}`
								: "No next run"}
						</span>
					</div>
				</TopBar>
				<StageContainer>
					<DndContext onDragEnd={handleCommentatorDragEnd} sensors={sensors}>
						<RowHeading>
							Commentators
							<Button
								startIcon={<HeadsetMic />}
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
							</Button>
						</RowHeading>
						<StageRow>
							<SortableContext
								items={commentatorsRep ? commentatorsRep.map((c) => c.id) : []}
								strategy={horizontalListSortingStrategy}
							>
								{commentatorsRep?.map((c) => (
									<Person
										key={c.id}
										person={c}
										handleEditPerson={handleEditCommentator}
										currentTalkbackTargets={currentTalkbackTargets}
										updateTalkbackTargets={setCurrentTalkbackTargets}
									/>
								))}
							</SortableContext>
							<Button color="inherit" onClick={addCommentator}>
								<Add />
							</Button>
							<HostDroppable>
								{hostRep && (
									<Person
										person={hostRep}
										handleEditPerson={handleEditCommentator}
										currentTalkbackTargets={currentTalkbackTargets}
										updateTalkbackTargets={setCurrentTalkbackTargets}
									/>
								)}
							</HostDroppable>
						</StageRow>
					</DndContext>
					<DndContext sensors={sensors} onDragEnd={handleRunnerDragEnd}>
						<hr style={{ width: "50%", opacity: 0.5 }} />
						<RowHeading>
							Runners{" "}
							<Button
								startIcon={<HeadsetMic />}
								onClick={toggleTalkbackRunners}
								color="primary"
								variant={
									isTalkingToAllRunners && currentTalkbackTargets.length === allRunnerIds.length
										? "contained"
										: "outlined"
								}
							>
								Talk to Runners
							</Button>
						</RowHeading>
						<StageRow>
							<SortableContext
								items={runDataActiveRep?.teams.flatMap((team) => team.players.map((c) => c.id)) ?? []}
								strategy={horizontalListSortingStrategy}
							>
								{runDataActiveRep?.teams.flatMap((team) =>
									team.players.map((c) => (
										<Person
											key={c.id}
											person={c}
											isRunner
											handleEditPerson={handleEditRunner}
											currentTalkbackTargets={currentTalkbackTargets}
											updateTalkbackTargets={setCurrentTalkbackTargets}
										/>
									)),
								)}
							</SortableContext>
						</StageRow>
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
					<Button
						onClick={toggleTalkToAll}
						color="primary"
						variant={currentTalkbackTargets.length === allIds.length ? "contained" : "outlined"}
					>
						Talk to All
					</Button>
					<Button color="error" onClick={forceStopTalkback}>
						Force Stop Talkback
					</Button>
				</BottomBar>
			</DashboardStageViewContainer>
			<CouchEditDialog
				key={editingCommentator?.id ?? "new-commentator"}
				open={personEditDialogOpen === "Commentator"}
				onClose={handleClosePersonEditDialog}
				person={editingCommentator ?? undefined}
			/>
			<ThemeProvider theme={darkTheme}>
				<EditRunnerDialog
					key={runner?.id ?? "new-runner"}
					open={personEditDialogOpen === "Runner"}
					onClose={handleClosePersonEditDialog}
					runner={runner ?? undefined}
				/>
			</ThemeProvider>
		</ThemeProvider>
	);
}

const PersonContainer = styled.div`
	position: relative;
	background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02));
	min-width: 170px;
	max-width: 240px;
	border-radius: 10px;
	border: 1px solid rgba(255, 255, 255, 1);
	padding: 8px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(6px);
	transition: transform 160ms ease, box-shadow 160ms ease;
	display: flex;
	flex-direction: column;
	gap: 8px;

	@keyframes flash {
		0% {
			outline-color: yellow;
			border-color: yellow;
		}
		50% {
			outline-color: transparent;
			border-color: transparent;
		}
		100% {
			outline-color: yellow;
			border-color: yellow;
		}
	}
`;

const NameBlock = styled.div`
	display: flex;
	flex-direction: column;

	padding: 6px 8px;
	border-radius: 8px;
	background: #354050;
	user-select: none;
	border: 1px solid rgba(255, 255, 255, 0.03);
`;

const NameText = styled.div`
	font-weight: 700;
	font-size: 15px;
	line-height: 1;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const PronounsText = styled.div`
	font-size: 12px;
	opacity: 0.8;
`;

const TagBadge = styled.div`
	width: 100%;
	font-size: 12px;
	background: rgba(255, 255, 255, 1);
	color: black;
	padding: 6px 12px 3px;
	border-radius: 0 0 8px 8px;
	font-weight: 600;
	pointer-events: none;
	box-sizing: border-box;
	margin-top: -12px;
	z-index: -1;
	text-align: center;
`;

const MicRow = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 6px 8px;
	border-radius: 8px;
	background: rgba(255, 255, 255, 0.02);
	border: 1px solid rgba(255, 255, 255, 0.03);
`;

const MicIcon = styled.div<{ bg?: string; fg?: string }>`
	width: 36px;
	height: 36px;
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: ${({ bg }) => bg ?? "transparent"};
	color: ${({ fg }) => fg ?? "white"};
	flex-shrink: 0;
	font-size: 18px;
`;

const MicLabel = styled.div`
	font-size: 13px;
	flex-grow: 1;
	text-align: center;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	opacity: 0.95;
`;

const ActionsRow = styled.div`
	display: flex;
	justify-content: space-between;
	margin-top: auto;
`;

function getHeadsetData(microphone: string | undefined) {
	return Headsets.find((h) => h.name === microphone) ?? undefined;
}

type PersonBase<T> = {
	person: T;
	handleEditPerson?: (data: T) => void;
	currentTalkbackTargets: string[];
	updateTalkbackTargets?: (targets: string[]) => void;
};

type PersonProps = (PersonBase<RunDataPlayer> & { isRunner: true }) | (PersonBase<Commentator> & { isRunner?: false });

function Person(props: PersonProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: props.person.id,
	});

	function editCommentator() {
		if (props.isRunner) {
			props.handleEditPerson?.(props.person);
		} else {
			props.handleEditPerson?.(props.person);
		}
	}

	function toggleTalkback() {
		if (props.currentTalkbackTargets.includes(props.person.id)) {
			// Remove from talkback
			props.updateTalkbackTargets?.(props.currentTalkbackTargets.filter((id) => id !== props.person.id));
		} else {
			// Add to talkback
			props.updateTalkbackTargets?.([...props.currentTalkbackTargets, props.person.id]);
		}
	}

	const talkbackEnabled = props.currentTalkbackTargets.includes(props.person.id);

	const style: React.CSSProperties = {
		transform: CSS.Translate.toString(transform),
		transition,
		zIndex: isDragging ? 20 : undefined,
		outline: talkbackEnabled ? "2px solid yellow" : undefined,
		animation: talkbackEnabled ? "flash 250ms step-start infinite" : undefined,
	};

	const rawMicrophone = props.isRunner ? props.person.customData.microphone : props.person.microphone;
	const headset = getHeadsetData(rawMicrophone);

	return (
		<PersonContainer ref={setNodeRef} style={style} {...listeners} {...attributes}>
			<NameBlock>
				<NameText>{props.person.name}</NameText>
				<PronounsText>{props.person.pronouns}</PronounsText>
			</NameBlock>
			{!props.isRunner && props.person.tag && <TagBadge>{props.person.tag}</TagBadge>}

			<MicRow>
				<MicIcon bg={headset?.colour} fg={headset?.textColour}>
					{rawMicrophone ? <Mic /> : <MicOff />}
				</MicIcon>
				<MicLabel>
					{rawMicrophone ?? "No Mic"}
					{headset && (
						<>
							<br />
							<span style={{ fontStyle: "italic" }}>Ch {headset.micInput}</span>
						</>
					)}
				</MicLabel>
				{rawMicrophone && !headset && <div style={{ fontSize: 12, opacity: 0.85 }}>?</div>}
			</MicRow>

			<ActionsRow>
				{/* <Button
					color="primary"
					variant={talkbackEnabled ? "contained" : "outlined"}
					onClick={toggleTalkback}
					size="small"
					startIcon={<HeadsetMic />}
					disabled={
						props.currentTalkbackTargets.length > 1 ||
						(props.currentTalkbackTargets.length === 1 && !talkbackEnabled)
					}
				>
					Talk
				</Button>
				<Button color="inherit" onClick={editCommentator} size="small" startIcon={<Edit />}>
					Edit
				</Button> */}
				<IconButton
					color="primary"
					onClick={toggleTalkback}
					size="small"
				>
					<HeadsetMic />
				</IconButton>
				<IconButton size="small" color="inherit" onClick={editCommentator}>
					<Edit fontSize="small" />
				</IconButton>
			</ActionsRow>
		</PersonContainer>
	);
}

const HostDroppableContainer = styled.div<{ isEmpty: boolean }>`
	border: 2px dashed white;
	background-color: ${({ isEmpty }) => (isEmpty ? "rgba(255, 255, 255, 0.1)" : "transparent")};
	min-height: 150px;
	min-width: 150px;
	border-radius: 5px;
	border-color: ${({ isEmpty }) => (isEmpty ? "white" : "transparent")};
	margin-left: 48px;
`;

interface HostDroppableProps {
	children: React.ReactNode;
}

function HostDroppable(props: HostDroppableProps) {
	const { setNodeRef } = useDroppable({
		id: "host",
	});

	return (
		<HostDroppableContainer ref={setNodeRef} isEmpty={!props.children}>
			{props.children}
		</HostDroppableContainer>
	);
}

interface EditRunnerDialogProps {
	runner?: RunDataPlayer;
	open: boolean;
	onClose: () => void;
}

function EditRunnerDialog(props: EditRunnerDialogProps) {
	if (!props.runner) {
		return null;
	}

	const [runnerData, setRunnerData] = useState<RunDataPlayer>({
		...props.runner,
	});

	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target;
		setRunnerData((prev) => ({
			...prev,
			[name]: value,
		}));
	}

	function handleSocialChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target;
		setRunnerData((prev) => ({
			...prev,
			social: {
				...prev.social,
				[name]: value,
			},
		}));
	}

	function handleMicrophoneChange(microphone: string | undefined) {
		setRunnerData((prev) => ({
			...prev,
			customData: {
				...prev.customData,
				microphone: microphone ?? "",
			},
		}));
	}

	function handlePronounChange(pronouns: string) {
		setRunnerData((prev) => ({
			...prev,
			pronouns: pronouns,
		}));
	}

	const handleClose = () => {
		props.onClose();
	};

	const handleSave = () => {
		console.log("Saving runner data:", runnerData);
		props.onClose();
	};

	const hasUpdatedValues =
		runnerData.name !== props.runner.name ||
		runnerData.pronouns !== props.runner.pronouns ||
		runnerData.social?.twitch !== props.runner.social?.twitch ||
		runnerData.customData?.microphone !== props.runner.customData?.microphone;

	return (
		<Dialog open={props.open} onClose={handleClose} fullWidth maxWidth="md" style={{ colorScheme: "dark" }}>
			<DialogTitle>
				Edit Runner
				<IconButton
					aria-label="close"
					onClick={handleClose}
					sx={{
						position: "absolute",
						right: 8,
						top: 8,
						color: (theme) => theme.palette.grey[500],
					}}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent>
				<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
					<div style={{ display: "flex", gap: 16 }}>
						<TextField fullWidth label="Name" name="name" value={runnerData.name} onChange={handleChange} />
						<Autocomplete
							freeSolo
							options={["He/Him", "She/Her", "They/Them"]}
							renderInput={(params) => <TextField {...params} label="Pronouns" />}
							onInputChange={(_, newInputValue) => {
								handlePronounChange(newInputValue);
							}}
							inputValue={runnerData.pronouns}
							sx={{ minWidth: "30%" }}
						/>
					</div>
					<div>
						<TextField
							fullWidth
							label="Twitch"
							name="twitch"
							value={runnerData.social?.twitch || ""}
							onChange={handleSocialChange}
						/>
					</div>
					<div>
						<span style={{ display: "block" }}>Headset</span>
						<ToggleButtonGroup
							value={props.runner.customData?.microphone}
							onChange={(_, headset) => handleMicrophoneChange(headset)}
							exclusive
							style={{ flexWrap: "wrap" }}
						>
							{Headsets.map((headset) => {
								return (
									<ToggleButton value={headset.name} key={headset.name}>
										{headset.name}
									</ToggleButton>
								);
							})}
						</ToggleButtonGroup>
					</div>
				</div>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={handleSave} disabled={!hasUpdatedValues} variant="contained" color="success">
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}

createRoot(document.getElementById("root")!).render(<DashboardStageView />);
