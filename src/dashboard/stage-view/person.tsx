import clsx from "clsx";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Mic, MicOff, Edit, RecordVoiceOver } from "@mui/icons-material";
import { Button, IconButton, Tooltip } from "@mui/material";

import { Headsets } from "../../shared/audio-data";

import type { RunDataActiveRun, RunDataPlayer } from "@asm-graphics/types/RunData";
import { useReplicant } from "@nodecg/react-hooks";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { usePersonData } from "./use-person-data";
import styles from "./person.module.css";

function getHeadsetData(microphone: string | undefined) {
	return Headsets.find((h) => h.name === microphone) ?? undefined;
}

export function SortablePerson(props: PersonProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<Person
			ref={setNodeRef}
			style={style}
			isDragging={isDragging}
			dragAttributes={attributes}
			dragListeners={listeners}
			{...props}
		/>
	);
}

interface PersonProps {
	id: string;
	handleEditPerson?: (personId: string) => void;
	currentTalkbackTargets?: string[];
	updateTalkbackTargets?: (targets: string[]) => void;
	isInRunnerSection?: boolean;
	style?: React.CSSProperties;
	ref?: React.Ref<HTMLDivElement>;
	isDragging?: boolean;
	dragAttributes?: DraggableAttributes;
	dragListeners?: SyntheticListenerMap;
}

export function Person(props: PersonProps) {
	const personData = usePersonData(props.id);
	const [gameAudioRep] = useReplicant("game-audio-indicator");

	if (!personData) return null;

	function editCommentator() {
		if (!personData) return;
		props.handleEditPerson?.(props.id);
	}

	function toggleTalkback() {
		if (!props.currentTalkbackTargets) return;

		if (props.currentTalkbackTargets.includes(props.id)) {
			// Remove from talkback
			props.updateTalkbackTargets?.(props.currentTalkbackTargets.filter((id) => id !== props.id));
		} else {
			// Add to talkback
			props.updateTalkbackTargets?.([...props.currentTalkbackTargets, props.id]);
		}
	}

	function moveGameAudio() {
		if (gameAudioRep === props.id) {
			void nodecg.sendMessage("changeGameAudio", { manual: true, id: "" });
			return;
		}

		void nodecg.sendMessage("changeGameAudio", { manual: true, id: props.id });
	}

	const talkbackEnabled = props.currentTalkbackTargets?.includes(props.id) ?? false;

	const rawMicrophone =
		typeof personData.customData["microphone"] === "string" ? personData.customData["microphone"] : undefined;
	const headset = getHeadsetData(rawMicrophone);

	const isOnRunnersAudio = gameAudioRep === props.id;

	return (
		<div
			className={clsx(styles.personContainer, props.isDragging && styles.dragging)}
			style={props.style}
			ref={props.ref}
			{...props.dragAttributes}
			{...props.dragListeners}
		>
			<div className={styles.nameBlock}>
				<div className={styles.nameText}>{personData.name}</div>
				<div className={styles.pronounsText}>{personData.pronouns}</div>
			</div>
			{typeof personData.customData["tag"] === "string" && personData.customData["tag"] && (
				<div className={styles.tagBadge}>{personData.customData["tag"]}</div>
			)}

			<div className={styles.micRow}>
				<div
					className={clsx(styles.micIcon, !rawMicrophone && styles.noMic)}
					style={{ "--mic-bg": headset?.colour, "--mic-fg": headset?.textColour } as React.CSSProperties}
				>
					{rawMicrophone ? <Mic /> : <MicOff />}
				</div>
				<div className={clsx(styles.micLabel, !rawMicrophone && styles.noMic)}>
					{rawMicrophone ? rawMicrophone : "No Mic Assigned"}
					{headset && (
						<>
							<br />
							<span style={{ fontStyle: "italic" }}>Ch {headset.micInput}</span>
						</>
					)}
				</div>
				{rawMicrophone && !headset && <div style={{ fontSize: 12, opacity: 0.85 }}>?</div>}
			</div>

			<div className={styles.actionsRow}>
				<Tooltip placement="top" title={talkbackEnabled ? "Disable Talkback" : "Enable Talkback"}>
					<IconButton color={talkbackEnabled ? "primary" : "inherit"} onClick={toggleTalkback} size="small">
						<RecordVoiceOver />
					</IconButton>
				</Tooltip>
				<Tooltip placement="top" title="Edit">
					<span>
						<IconButton size="small" color="inherit" onClick={editCommentator}>
							<Edit fontSize="small" />
						</IconButton>
					</span>
				</Tooltip>
			</div>
			{props.isInRunnerSection && (
				<Button onClick={moveGameAudio}>
					{gameAudioRep === "" ? "Set" : isOnRunnersAudio ? "Clear" : "Transfer"} Game Audio Icon
				</Button>
			)}
		</div>
	);
}
