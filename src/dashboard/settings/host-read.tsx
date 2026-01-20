import { useState } from "react";
import styled from "@emotion/styled";
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
import { DragHandle } from "@mui/icons-material";
import { TextField, Button, Accordion, AccordionSummary, Typography, AccordionDetails } from "@mui/material";
import { useReplicant } from "@nodecg/react-hooks";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import type { HostRead } from "@asm-graphics/shared/HostRead";
import { Incentives, TwitchRevenue, Prizes } from "./default-host-reads";

const DEFAULT_HOST_READS = [Prizes, TwitchRevenue, Incentives];
const DEFAULT_HOST_READS_IDS = DEFAULT_HOST_READS.map((read) => read.title.toLowerCase().replace(/\s+/g, "-"));

export function HostReads() {
	const [hostReadsRep, setHostReadsRep] = useReplicant("host-reads");

	const [newTitle, setNewTitle] = useState("");
	const [newContent, setNewContent] = useState("");
	const [accordionExpanded, setAccordionExpanded] = useState(false);

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

	function addDeafaultHostReads() {
		DEFAULT_HOST_READS.forEach(async (read) => {
			await nodecg.sendMessage("host-reads:add", {
				id: read.title.toLowerCase().replace(/\s+/g, "-"),
				title: read.title,
				content: read.content,
			});
		});
	}

	const hostReadHasAtLeastOneDefault = hostReadsRep?.some((read) => DEFAULT_HOST_READS_IDS.includes(read.id));

	return (
		<div>
			<h3>Host Reads</h3>
			{!hostReadHasAtLeastOneDefault && (
				<Button fullWidth onClick={addDeafaultHostReads}>
					Add Defaults
				</Button>
			)}
			<Accordion expanded={accordionExpanded} onChange={() => setAccordionExpanded(!accordionExpanded)}>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>Add Host Read</AccordionSummary>
				<AccordionDetails>
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
							label="New Host Read Content (Markdown supported)"
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
				</AccordionDetails>
			</Accordion>
			<div style={{ marginTop: 8 }}>
				<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
					<SortableContext items={hostReadsRep ?? []} strategy={verticalListSortingStrategy}>
						{hostReadsRep?.map((read) => (
							<HostReadComponent key={read.id} read={read} />
						))}
					</SortableContext>
				</DndContext>
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
					label="Content (Markdown supported)"
					multiline
					minRows={3}
					fullWidth
					value={content}
					onChange={(e) => setContent(e.target.value)}
					size="small"
					variant="outlined"
				/>
				<div style={{ display: "flex", marginTop: 8, gap: 8 }}>
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
				</div>
			</AccordionDetails>
		</Accordion>
	);
}
