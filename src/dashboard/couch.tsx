import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { useReplicant } from "@nodecg/react-hooks";
import { darkTheme } from "./theme";

import { Button, Dialog, DialogTitle, IconButton, ThemeProvider } from "@mui/material";
import { Edit, Add, DragHandle } from "@mui/icons-material";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { Commentator } from "@asm-graphics/types/OverlayProps";
import type { CouchEditDialog } from "./commentator-edit-dialog";
import { Checkbox, FormControlLabel } from "@mui/material";
import { useState } from "react";
import { checkAndGetDialog } from "./utils/getDialog";

export function DashCouch() {
	const [commentatorsRep, setCommentatorsRep] = useReplicant<Commentator[]>("commentators");
	const [showHostRep] = useReplicant<boolean>("showHost");
	const [hostOnCouchInstructionsOpen, setHostOnCouchInstructionsOpen] = useState(false);

	const host = (commentatorsRep ?? []).find((comm) => comm.id === "host");

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	async function addCommentator() {
		const dialog = (await checkAndGetDialog("commentator-edit-dialog")) as CouchEditDialog.Dialog;
		if (dialog) {
			dialog.openDialog({ data: { id: "", name: "" } });
		}
	}

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (active.id !== over?.id) {
			if (!commentatorsRep) return;

			const oldIndex = commentatorsRep.findIndex((commentator) => commentator.id === active.id);
			const newIndex = commentatorsRep.findIndex((commentator) => commentator.id === over?.id);

			const newOrder = arrayMove(commentatorsRep, oldIndex, newIndex);

			setCommentatorsRep(newOrder);
		}
	}

	function handleShowHost(checked: boolean) {
		void nodecg.sendMessage("showHost", checked);
	}

	return (
		<ThemeProvider theme={darkTheme}>
			<div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 8 }}>
				Editing of commentators is currently done via Stage View or through the Runner Tablet Graphic or Host
				Dashboard.
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: 5,
					}}
				>
					<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 24 }}>
						<span>Host</span>

						<FormControlLabel
							control={
								<Checkbox
									checked={showHostRep}
									onChange={(e) => handleShowHost(e.target.checked)}
									color="primary"
								/>
							}
							label="Show Host?"
							labelPlacement="start"
						/>
					</div>
					{host && <HostComponent commentator={host} id="host" />}
					<Button onClick={() => setHostOnCouchInstructionsOpen(true)}>Host on Couch</Button>
					<hr style={{ width: "90%", opacity: 0.5 }} />
					<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
						<SortableContext items={commentatorsRep ?? []} strategy={verticalListSortingStrategy}>
							{commentatorsRep?.map((commentator) => (
								<HostComponent key={commentator.id} id={commentator.id} commentator={commentator} />
							))}
						</SortableContext>
					</DndContext>
					<Button variant="outlined" onClick={addCommentator} startIcon={<Add />}>
						New Commentator
					</Button>
				</div>
			</div>
			<Dialog open={hostOnCouchInstructionsOpen} onClose={() => setHostOnCouchInstructionsOpen(false)}>
				<DialogTitle>Host on Couch Instructions</DialogTitle>
				<div style={{ padding: 16, maxWidth: 400 }}>
					<ul>
						<li>Move laptop and host to the couch</li>
						<li>Add the host as a normal commentator</li>
						<li>Disable "Show Host" at the top</li>
					</ul>
					<div style={{ textAlign: "right", marginTop: 16 }}>
						<Button onClick={() => setHostOnCouchInstructionsOpen(false)}>Close</Button>
					</div>
				</div>
			</Dialog>
		</ThemeProvider>
	);
}

const HostComponentContainer = styled.div`
	display: flex;
	gap: 6px;
	align-items: center;
	justify-content: space-between;
	background-color: rgba(255, 255, 255, 0.05);
	backdrop-filter: blur(5px);
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 4px;
	padding: 4px 4px 4px 8px;
`;

const Tag = styled.span`
	font-weight: bold;
`;

const Name = styled.span`
	font-size: 18px;
	line-height: 36px;
	margin-right: 8px;

	display: flex;
	gap: 4px;
`;

const Pronouns = styled.span`
	font-size: 90%;
	font-weight: lighter;
	font-style: italic;
	line-height: 36px;
`;

const Microphone = styled.span`
	font-size: 90%;
	font-weight: lighter;
	font-style: italic;
	line-height: 36px;
`;

interface HostComponentProps {
	commentator: Commentator;
	preview?: boolean;
	inputs?: string[];
	id: string;
}

const HostComponent: React.FC<HostComponentProps> = (props: HostComponentProps) => {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const isHost = props.commentator.id === "host";

	async function editCommentator() {
		const dialog = (await checkAndGetDialog("commentator-edit-dialog")) as CouchEditDialog.Dialog;
		if (dialog) {
			dialog.openDialog({ data: props.commentator });
		}
	}

	return (
		<HostComponentContainer ref={setNodeRef} style={style}>
			{!isHost && <DragHandle {...listeners} {...attributes} />}
			<Name>
				<Tag>{props.commentator.id !== "host" && props.commentator.tag}</Tag>
				{props.commentator.name}
				<Pronouns>{props.commentator.pronouns}</Pronouns>
				{props.commentator.microphone && <Microphone>- Mic: {props.commentator.microphone}</Microphone>}
			</Name>

			<IconButton style={{ alignSelf: "flex-end" }} onClick={editCommentator} disabled>
				<Edit />
			</IconButton>
		</HostComponentContainer>
	);
};

createRoot(document.getElementById("root")!).render(<DashCouch />);
