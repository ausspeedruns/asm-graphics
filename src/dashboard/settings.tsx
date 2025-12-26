import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";

import {
	Button,
	Checkbox,
	CircularProgress,
	FormControlLabel,
	FormGroup,
	IconButton,
	Input,
	InputAdornment,
	Slider,
	TextField,
	ThemeProvider,
} from "@mui/material";
import { darkTheme } from "./theme";
import { useReplicant } from "@nodecg/react-hooks";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { HostRead } from "@asm-graphics/shared/HostRead";
import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DragHandle, Refresh, VolumeUp } from "@mui/icons-material";
import type { IntermissionVideo } from "@asm-graphics/shared/IntermissionVideo";
import { Grid } from "@mui/material";
import type { ConnectionStatus } from "@asm-graphics/types/Connections";

const Row = styled.div`
	display: flex;
	gap: 8px;
	margin: 8px 0;
`;

const GridItem = styled(Grid)`
	padding: 16px;
	border: 1px solid #ffffff70;
	border-radius: 8px;

	& h3 {
		margin-top: 0;
	}
`;

export function Settings() {
	return (
		<ThemeProvider theme={darkTheme}>
			<Grid container spacing={2}>
				<GridItem size="grow">
					<HostReads />
				</GridItem>
				<GridItem size="grow">
					<IntermissionVideos />
				</GridItem>
				<GridItem size="grow">
					<EventUpload />
				</GridItem>
				<GridItem size="grow">
					<OBSSettings />
				</GridItem>
			</Grid>
		</ThemeProvider>
	);
}

function HostReads() {
	const [hostReadsRep, setHostReadsRep] = useReplicant("host-reads");

	const [newTitle, setNewTitle] = useState("");
	const [newContent, setNewContent] = useState("");

	function addNewHostRead() {
		void nodecg.sendMessage("host-reads:add", { id: crypto.randomUUID(), title: newTitle, content: newContent });

		setNewTitle("");
		setNewContent("");
	}

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (active.id !== over?.id) {
			if (!hostReadsRep) return;

			const oldIndex = hostReadsRep.findIndex((read) => read.id === active.id);
			const newIndex = hostReadsRep.findIndex((read) => read.id === over?.id);

			const newOrder = arrayMove(hostReadsRep, oldIndex, newIndex);

			setHostReadsRep(newOrder);
		}
	}

	return (
		<div>
			<h3>Host Reads</h3>
			<div style={{ marginBottom: 8 }}>
				<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
					<SortableContext items={hostReadsRep ?? []} strategy={verticalListSortingStrategy}>
						{hostReadsRep?.map((read) => (
							<HostReadComponent key={read.id} read={read} />
						))}
					</SortableContext>
				</DndContext>
			</div>
			<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
				<TextField
					name="Title"
					type="text"
					label="New Host Read Title"
					value={newTitle}
					onChange={(e) => setNewTitle(e.target.value)}
				/>
				<TextField
					multiline
					minRows={3}
					name="Content"
					label="New Host Read Content"
					value={newContent}
					onChange={(e) => setNewContent(e.target.value)}
				/>
				<Button
					color="success"
					variant="contained"
					fullWidth
					onClick={addNewHostRead}
					disabled={!newTitle || !newContent}
				>
					Add Host Read
				</Button>
			</div>
		</div>
	);
}

const SmallFontTextField = styled(TextField)`
	& .MuiInputBase-input {
		font-size: 80%;
	}
`;

interface HostReadComponentProps {
	read: HostRead;
}

function HostReadComponent(props: HostReadComponentProps) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.read.id });
	const { read } = props;
	const [title, setTitle] = useState(read.title);
	const [content, setContent] = useState(read.content);

	const hasBeenEdited = content !== read.content || title !== read.title;

	const style = {
		transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
		transition,
	};

	function deleteHostRead() {
		void nodecg.sendMessage("host-reads:remove", read.id);
	}

	function saveHostRead() {
		void nodecg.sendMessage("host-reads:update", { ...read, title, content });
	}

	return (
		<Accordion ref={setNodeRef} style={style}>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<DragHandle {...listeners} {...attributes} style={{ marginRight: 8 }} />
				<Typography>{title}</Typography>
			</AccordionSummary>
			<AccordionDetails sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
				<span style={{ fontSize: "70%", opacity: 0.6, marginBottom: 4 }}>{read.id}</span>
				<TextField
					label="Sponsor"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					fullWidth
					size="small"
					variant="outlined"
				/>
				<SmallFontTextField
					label="Content"
					multiline
					minRows={3}
					fullWidth
					value={content}
					onChange={(e) => setContent(e.target.value)}
					size="small"
					variant="outlined"
				/>
				<Row style={{ marginTop: 8 }}>
					<Button variant="outlined" color="error" onClick={deleteHostRead} size="small">
						Delete
					</Button>
					<Button
						variant="contained"
						color="success"
						onClick={saveHostRead}
						disabled={!hasBeenEdited}
						size="small"
						sx={{ flex: 2 }}
					>
						Save
					</Button>
				</Row>
			</AccordionDetails>
		</Accordion>
	);
}

function IntermissionVideos() {
	const [intermissionVideosRep, setIntermissionVideosRep] = useReplicant("intermission-videos");

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (active.id !== over?.id) {
			if (!intermissionVideosRep) return;

			const oldIndex = intermissionVideosRep.findIndex((video) => video.asset === active.data.current?.asset);
			const newIndex = intermissionVideosRep.findIndex((video) => video.asset === over?.data.current?.asset);

			const newOrder = arrayMove(intermissionVideosRep, oldIndex, newIndex);

			setIntermissionVideosRep(newOrder);
		}
	}

	return (
		<div>
			<h3>Intermission Videos</h3>
			<p>Upload videos in the assets page and then modify their settings here.</p>
			<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
				<SortableContext
					items={(intermissionVideosRep ?? []).map((video) => video.asset)}
					strategy={verticalListSortingStrategy}
				>
					{intermissionVideosRep?.map((video) => (
						<IntermissionVideoComponent key={video.asset} video={video} />
					))}
				</SortableContext>
			</DndContext>
		</div>
	);
}

interface IntermissionVideoProps {
	video: IntermissionVideo;
}

function IntermissionVideoComponent(props: IntermissionVideoProps) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		id: props.video.asset,
	});
	const { video: intermissionVideo } = props;
	const [title, setTitle] = useState(intermissionVideo.displayName);
	const [volumeInput, setVolumeInput] = useState(intermissionVideo.volume * 100);

	const hasBeenEdited = title !== intermissionVideo.displayName || volumeInput !== intermissionVideo.volume * 100;

	const style = {
		transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
		transition,
	};

	function setIntermissionVideoEnabled(isEnabled: boolean) {
		void nodecg.sendMessage("intermission-videos:update", { ...intermissionVideo, enabled: isEnabled });
	}

	function handleSaveIntermissionVideo() {
		void nodecg.sendMessage("intermission-videos:update", {
			...intermissionVideo,
			displayName: title,
			volume: volumeInput / 100,
		});
	}

	function handleSliderChange(_: Event, newValue: number) {
		setVolumeInput(newValue);
	}

	function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		setVolumeInput(event.target.value === "" ? 0 : Number(event.target.value));
	}

	function handleBlur() {
		if (volumeInput < 0) {
			setVolumeInput(0);
		} else if (volumeInput > 100) {
			setVolumeInput(100);
		}
	}

	return (
		<Accordion ref={setNodeRef} style={style}>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<DragHandle {...listeners} {...attributes} style={{ marginRight: 8 }} />
				<Typography>{title}</Typography>
			</AccordionSummary>
			<AccordionDetails sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
				<TextField
					label="Video Name"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					fullWidth
					variant="outlined"
					size="small"
				/>
				<div style={{ aspectRatio: "16 / 9", width: "100%", outline: "1px solid gray" }}>
					<video src={intermissionVideo.asset} style={{ width: "100%", height: "100%" }} controls />
				</div>
				{intermissionVideo.loading ? (
					<div style={{ display: "flex", justifyContent: "center", padding: "16px" }}>
						<CircularProgress />
					</div>
				) : (
					<>
						<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
							{intermissionVideo.videoInfo ? (
								<Typography variant="caption" component="div">
									<span style={{ opacity: 0.7 }}>Duration: </span>
									{Math.round(intermissionVideo.videoInfo.duration)}s |{" "}
									<span style={{ opacity: 0.7 }}>Res: </span>
									{intermissionVideo.videoInfo.horizontalResolution}x
									{intermissionVideo.videoInfo.verticalResolution} |{" "}
									<span style={{ opacity: 0.7 }}>Aspect: </span>
									{intermissionVideo.videoInfo.aspectRatio}
								</Typography>
							) : (
								<Typography variant="caption">No video information available</Typography>
							)}
							<IconButton
								size="small"
								onClick={() =>
									nodecg.sendMessage("intermission-videos:refreshInfo", intermissionVideo.asset)
								}
							>
								<Refresh fontSize="small" />
							</IconButton>
						</div>
						<div style={{ display: "flex", alignItems: "center", gap: 2 }}>
							<VolumeUp />
							<Slider
								value={volumeInput}
								onChange={handleSliderChange}
								aria-labelledby="input-slider"
								size="small"
							/>
							<Input
								value={volumeInput}
								size="small"
								onChange={handleInputChange}
								onBlur={handleBlur}
								inputProps={{
									step: 1,
									min: 0,
									max: 100,
									type: "number",
									"aria-labelledby": "input-slider",
									style: { textAlign: "center" },
								}}
								sx={{ width: "50px" }}
							/>
						</div>
						<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
							<FormControlLabel
								control={
									<Checkbox
										checked={intermissionVideo.enabled}
										onChange={(e) => setIntermissionVideoEnabled(e.target.checked)}
										size="small"
									/>
								}
								label="Enabled"
							/>
							<Button
								variant="contained"
								color="success"
								onClick={handleSaveIntermissionVideo}
								disabled={!hasBeenEdited}
								size="small"
							>
								Save
							</Button>
						</div>
					</>
				)}
			</AccordionDetails>
		</Accordion>
	);
}

function EventUpload() {
	return (
		<div>
			<h3>Event Upload (NOT IMPLEMENTED)</h3>
			<p>
				Upload a ZIP file containing all event assets and configuration. The event will be set up automatically.
			</p>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					const form = e.target as HTMLFormElement;
					const fileInput = form.elements.namedItem("eventZip") as HTMLInputElement;
					if (!fileInput.files?.[0]) return;
					const file = fileInput.files[0];
					const data = new FormData();
					data.append("eventZip", file);
					// await nodecg.sendMessage("event:upload", data);
					fileInput.value = "";
				}}
			>
				<label
					htmlFor="eventZip"
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						border: "2px dashed #888",
						borderRadius: 8,
						padding: "32px 0",
						cursor: "pointer",
						background: "#222",
						color: "#ccc",
						marginBottom: 16,
						transition: "border-color 0.2s",
					}}
					onDragOver={(e) => {
						e.preventDefault();
						e.currentTarget.style.borderColor = "#1976d2";
					}}
					onDragLeave={(e) => {
						e.preventDefault();
						e.currentTarget.style.borderColor = "#888";
					}}
					onDrop={(e) => {
						e.preventDefault();
						e.currentTarget.style.borderColor = "#888";
						const fileInput = document.getElementById("eventZip") as HTMLInputElement;
						if (e.dataTransfer.files.length > 0 && fileInput) {
							fileInput.files = e.dataTransfer.files;
						}
					}}
				>
					<input
						type="file"
						id="eventZip"
						name="eventZip"
						accept=".zip"
						required
						style={{ display: "none" }}
					/>
					<span style={{ fontSize: 24, marginBottom: 8 }}>📦</span>
					<span style={{ fontWeight: 500 }}>Click or drag ZIP file here to upload</span>
					<span style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>.zip only</span>
				</label>
				<Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
					Upload Event ZIP
				</Button>
			</form>
		</div>
	);
}

function OBSSettings() {
	const [obsStatusRep] = useReplicant("obs:status");
	const [obsDoLocalRecordingsRep, setObsDoLocalRecordingsRep] = useReplicant("obs:localRecordings");
	const [obsAutoReconnectRep, setObsAutoReconnectRep] = useReplicant("obs:autoReconnect");
	const [obsReconnectIntervalRep, setObsReconnectIntervalRep] = useReplicant("obs:reconnectInterval");

	return (
		<div>
			<h3>
				OBS Settings <ConnectionTag status={obsStatusRep} />
			</h3>
			<Row>
				<Button
					variant="contained"
					color="success"
					fullWidth
					disabled={obsStatusRep === "connected"}
					loading={obsStatusRep === "connecting"}
					onClick={() => void nodecg.sendMessage("obs:setConnected", true)}
				>
					Connect
				</Button>
				<Button
					variant="outlined"
					color="error"
					fullWidth
					disabled={obsStatusRep === "disconnected"}
					onClick={() => void nodecg.sendMessage("obs:setConnected", false)}
				>
					Disconnect
				</Button>
			</Row>
			<TextField label="OBS Address" fullWidth margin="dense" />
			<TextField label="OBS Password" type="password" fullWidth margin="dense" />
			<TextField
				label="Reconnect Interval (ms)"
				slotProps={{ input: { endAdornment: <InputAdornment position="end">ms</InputAdornment> } }}
				type="number"
				fullWidth
				value={obsReconnectIntervalRep}
				onChange={(e) => setObsReconnectIntervalRep(Number(e.target.value))}
				margin="normal"
			/>

			<FormGroup>
				<FormControlLabel
					control={
						<Checkbox
							checked={obsDoLocalRecordingsRep ?? false}
							onChange={(e) => setObsDoLocalRecordingsRep(e.target.checked)}
						/>
					}
					label="Enable OBS Local Recordings"
				/>

				<FormControlLabel
					control={
						<Checkbox
							checked={obsAutoReconnectRep ?? false}
							onChange={(e) => setObsAutoReconnectRep(e.target.checked)}
						/>
					}
					label="Auto-reconnect to OBS"
				/>
			</FormGroup>
		</div>
	);
}

function X32Settings() {
	const [x32StatusRep] = useReplicant("x32:status");

	return (
		<div>
			<h3>X32 Settings</h3>
			<p>NOT IMPLEMENTED</p>
		</div>
	);
}

function ConnectionTag(props: { status?: ConnectionStatus }) {
	const { status } = props;

	let color = "#888";
	let text = "Disconnected";

	if (status === "connected") {
		color = "#4caf50";
		text = "Connected";
	} else if (status === "connecting") {
		color = "#ff9800";
		text = "Connecting...";
	} else if (status === "error") {
		color = "#f44336";
		text = "Error";
	} else if (status === "warning") {
		color = "#ff9800";
		text = "Warning";
	}

	return (
		<span
			style={{
				backgroundColor: color,
				color: "#fff",
				padding: "2px 8px",
				borderRadius: 4,
				fontSize: "0.8em",
			}}
		>
			{text}
		</span>
	);
}

createRoot(document.getElementById("root")!).render(<Settings />);
