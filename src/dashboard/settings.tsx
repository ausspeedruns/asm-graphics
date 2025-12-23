import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";

import {
	Button,
	Checkbox,
	CircularProgress,
	FormControlLabel,
	IconButton,
	Input,
	Slider,
	TextField,
	ThemeProvider,
} from "@mui/material";
import { darkTheme } from "./theme";
import { useReplicant } from "@nodecg/react-hooks";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { HostRead } from "../extensions/host-reads";
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
import type { IntermissionVideo } from "@asm-graphics/types/IntermissionVideo";
import type { LowerThirdPerson } from "../extensions/full-screen-data";

const Row = styled.div`
	display: flex;
	gap: 8px;
	margin: 8px 0;
`;

export function Settings() {
	// const [obsDoLocalRecordingsRep, setObsDoLocalRecordingsRep] = useReplicant<boolean>("obs:localRecordings");

	const [creditsInfo, setCreditsInfo] = useState({ name: "", title: "" });
	const [creditsNameRep] = useReplicant<LowerThirdPerson>("lowerThirdPerson");

	useEffect(() => {
		if (
			creditsNameRep &&
			(creditsNameRep.name !== creditsInfo.name || creditsNameRep.title !== creditsInfo.title)
		) {
			setCreditsInfo(creditsNameRep);
		}
	}, [creditsNameRep]);

	function handleCreditsChange(
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		field: "name" | "title",
	) {
		setCreditsInfo((prev) => ({ ...prev, [field]: e.target.value }));
	}

	function updateCreditsInfo() {
		void nodecg.sendMessage("lowerthird:save-person", creditsInfo);
	}

	const canUpdate =
		creditsInfo.name !== (creditsNameRep?.name ?? "") || creditsInfo.title !== (creditsNameRep?.title ?? "");

	return (
		<ThemeProvider theme={darkTheme}>
			<Button color="success" variant="contained" fullWidth onClick={() => nodecg.sendMessage("start-credits")}>
				Roll Credits
			</Button>
			<hr style={{ margin: "24px 0" }} />
			<div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
				<TextField
					fullWidth
					label="Credits Name"
					value={creditsInfo?.name}
					onChange={(e) => handleCreditsChange(e, "name")}
				/>
				<TextField
					fullWidth
					label="Credits Title"
					value={creditsInfo?.title}
					onChange={(e) => handleCreditsChange(e, "title")}
				/>
			</div>
			<Button color="primary" variant="contained" fullWidth onClick={updateCreditsInfo} disabled={!canUpdate}>
				Update
			</Button>
			<Row>
				<Button
					color="success"
					variant="contained"
					fullWidth
					onClick={() => nodecg.sendMessage("lowerthird:show")}
				>
					Show Lowerthird
				</Button>
				<Button
					color="error"
					variant="contained"
					fullWidth
					onClick={() => nodecg.sendMessage("lowerthird:hide")}
				>
					Hide Lowerthird
				</Button>
			</Row>
			<hr style={{ margin: "24px 0" }} />
			<Row>
				<Button
					color="success"
					variant="contained"
					fullWidth
					onClick={() => nodecg.sendMessage("show-acknowledgementofcountry")}
				>
					Show AoC
				</Button>
				<Button
					color="error"
					variant="contained"
					fullWidth
					onClick={() => nodecg.sendMessage("hide-acknowledgementofcountry")}
				>
					Hide AoC
				</Button>
			</Row>
			{/* <FormControlLabel
				control={
					<Checkbox
						checked={obsDoLocalRecordingsRep ?? false}
						onChange={(e) => setObsDoLocalRecordingsRep(e.target.checked)}
					/>
				}
				label="Enable OBS Local Recordings"
			/> */}
			<hr style={{ margin: "24px 0" }} />
			<HostReads />
			<IntermissionVideos />
		</ThemeProvider>
	);
}

function HostReads() {
	const [hostReadsRep, setHostReadsRep] = useReplicant<HostRead[]>("host-reads");

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
	const [intermissionVideosRep, setIntermissionVideosRep] = useReplicant<IntermissionVideo[]>("intermission-videos");

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

createRoot(document.getElementById("root")!).render(<Settings />);
