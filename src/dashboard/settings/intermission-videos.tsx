import { useState } from "react";
import {
	useSensors,
	useSensor,
	PointerSensor,
	KeyboardSensor,
	type DragEndEvent,
	DndContext,
	closestCenter,
} from "@dnd-kit/core";
import {
	sortableKeyboardCoordinates,
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
	useSortable,
} from "@dnd-kit/sortable";
import { DragHandle, Refresh, VolumeUp } from "@mui/icons-material";
import {
	Accordion,
	AccordionSummary,
	Typography,
	AccordionDetails,
	TextField,
	CircularProgress,
	IconButton,
	Slider,
	Input,
	FormControlLabel,
	Checkbox,
	Button,
} from "@mui/material";
import { useReplicant } from "@nodecg/react-hooks";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import type { IntermissionVideo } from "@asm-graphics/shared/IntermissionVideo";
import NumberField from "../elements/number-field";

export function IntermissionVideos() {
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

	function handleInputChange(value: number | null) {
		setVolumeInput(value ?? 0);
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
							<NumberField
								value={volumeInput}
								size="small"
								onValueChange={handleInputChange}
								onBlur={handleBlur}
								min={0}
								max={100}
								sx={{ width: "90px" }}
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
