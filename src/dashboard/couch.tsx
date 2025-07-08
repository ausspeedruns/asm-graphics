import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { useReplicant } from "@nodecg/react-hooks";
import { darkTheme } from "./theme";

import { Button, IconButton, ThemeProvider } from "@mui/material";
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

namespace Alert {
	type Name =
		| "ImportConfirm"
		| "ReturnToStartConfirm"
		| "RemoveAllRunsConfirm"
		| "RemoveRunConfirm"
		| "TwitchLogoutConfirm"
		| "NoTwitchGame";

	export interface Dialog extends Window {
		openDialog: (opts: { name: Name; data?: { idk?: string }; func?: (confirm: boolean) => void }) => void;
	}
}

/**
 * Check if a dialog is "loaded" or not (due to NodeCG v2.2.2 changes with lazy iframes).
 * If it's not, will quickly open and close it to load it.
 * @param name Name of dialog.
 */
function checkDialog(name: string): Promise<void> {
	return new Promise<void>((res) => {
		const dialog = nodecg.getDialog(name);
		const iframe = dialog?.querySelector("iframe");
		if (iframe && dialog) {
			// We check if it's loaded or not if our custom "openDialog" function exists.
			const openDialog = (iframe.contentWindow as Alert.Dialog | null)?.openDialog;
			if (openDialog) {
				res();
			} else {
				iframe.addEventListener(
					"load",
					() => {
						dialog.close();
						res();
					},
					{ once: true },
				);
				dialog.open();
			}
		} else {
			res();
		}
	});
}

/**
 * Gets dialog's contentWindow based on name, if possible.
 * @param name Name of dialog.
 */
function getDialog(name: string): Window | null {
	try {
		const dialog = nodecg.getDialog(name);
		const iframe = dialog?.querySelector("iframe")?.contentWindow || null;
		if (!iframe) {
			throw new Error("Could not find the iFrame");
		}
		return iframe;
	} catch (err) {
		nodecg.log.error(`getDialog could not successfully find dialog "${name}":`, err);
		 
		window.alert(
			`Attempted to open the NodeCG "${name}" dialog but failed (if you are using a standalone version of a dashboard panel, this is not yet supported).`,
		);
	}
	return null;
}

export function DashCouch() {
	const [commentatorsRep, setCommentatorsRep] = useReplicant<Commentator[]>("commentators");
	const [hostRep] = useReplicant<Commentator>("host");
	const [showHostRep] = useReplicant<boolean>("showHost");

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	async function addCommentator() {
		await checkDialog("commentator-edit-dialog");
		const dialog = getDialog("commentator-edit-dialog") as CouchEditDialog.Dialog;
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
		nodecg.sendMessage("showHost", checked);
	}

	return (
		<ThemeProvider theme={darkTheme}>
			<div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 8 }}>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: 5,
					}}>
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
					{hostRep && <HostComponent commentator={hostRep} id="host" />}
					<hr style={{ width: "90%", opacity: 0.5 }} />

					{/* {commentatorsRep?.map((commentator) => <HostComponent commentator={commentator} />)} */}
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
		</ThemeProvider>
	);
};

const HostComponentContainer = styled.div`
	display: flex;
	gap: 6px;
	align-items: center;
	justify-content: space-between;
	background: #4d5e80;
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

	const isHost = props.commentator.tag === "Host";

	async function editCommentator() {
		await checkDialog("commentator-edit-dialog");
		const dialog = getDialog("commentator-edit-dialog") as CouchEditDialog.Dialog;
		if (dialog) {
			dialog.openDialog({ data: props.commentator });
		}
	}

	return (
		<HostComponentContainer ref={setNodeRef} style={style}>
			{!isHost && (
				<IconButton {...listeners} {...attributes}>
					<DragHandle />
				</IconButton>
			)}
			<Name>
				<Tag>{props.commentator.tag}</Tag>
				{props.commentator.name}
				<Pronouns>{props.commentator.pronouns}</Pronouns>
				{props.commentator.microphone && <Microphone>- Mic: {props.commentator.microphone}</Microphone>}
			</Name>

			<IconButton style={{ alignSelf: "flex-end" }} onClick={editCommentator}>
				<Edit />
			</IconButton>
		</HostComponentContainer>
	);
};

createRoot(document.getElementById("root")!).render(<DashCouch />);
