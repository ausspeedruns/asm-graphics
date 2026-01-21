import styled from "@emotion/styled";
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

const MegaContainer = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

const PersonContainer = styled.div<{ isDragging?: boolean }>`
	box-sizing: border-box;
	position: relative;
	background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02));
	min-width: 170px;
	border-radius: 10px;
	border: 1px solid rgba(255, 255, 255, 1);
	padding: 8px;
	backdrop-filter: blur(6px);
	transition: transform 160ms ease, box-shadow 160ms ease;
	display: flex;
	flex-direction: column;
	gap: 8px;
	height: 100%;
	opacity: ${(props) => (props.isDragging ? 0.8 : 1)};
	box-shadow: ${(props) => (props.isDragging ? "0 12px 32px rgba(0, 0, 0, 0.7)" : "0 4px 12px rgba(0, 0, 0, 0.5)")};

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

	const rawMicrophone = personData.customData['microphone'];
	const headset = getHeadsetData(rawMicrophone);

	const isOnRunnersAudio = gameAudioRep === props.id;

	return (
		<PersonContainer
			style={props.style}
			ref={props.ref}
			isDragging={props.isDragging}
			{...props.dragAttributes}
			{...props.dragListeners}
		>
			<NameBlock>
				<NameText>{personData.name}</NameText>
				<PronounsText>{personData.pronouns}</PronounsText>
			</NameBlock>
			{personData.customData['tag'] && <TagBadge>{personData.customData['tag']}</TagBadge>}

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
			</ActionsRow>
			{props.isInRunnerSection && (
				<Button onClick={moveGameAudio}>
					{gameAudioRep === "" ? "Set" : isOnRunnersAudio ? "Clear" : "Transfer"} Game Audio Icon
				</Button>
			)}
		</PersonContainer>
	);
}
