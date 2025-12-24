import styled from "styled-components";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Mic, MicOff, RecordVoiceOver, Edit } from "@mui/icons-material";
import { Button, IconButton, Tooltip } from "@mui/material";

import { Headsets } from "../../extensions/audio-data";

import type { RunDataPlayer } from "@asm-graphics/types/RunData";

const MegaContainer = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

const PersonContainer = styled.div`
	position: relative;
	background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02));
	min-width: 170px;
	border-radius: 10px;
	border: 1px solid rgba(255, 255, 255, 1);
	padding: 8px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(6px);
	transition: transform 160ms ease, box-shadow 160ms ease;
	display: flex;
	flex-direction: column;
	gap: 8px;
	height: 100%;

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

type PersonProps =
	| (PersonBase<RunDataPlayer> & { isRunner: true; tempIndex: number; audioIndex?: number })
	| (PersonBase<RunDataPlayer> & { isRunner?: false });

export function Person(props: PersonProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: props.person.id,
		data: {
			type: props.isRunner ? "runner" : props.person.id === "host" ? "host" : "commentator",
			person: props.person,
		},
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

	function moveGameAudio() {
		if (!props.isRunner) return;
		void nodecg.sendMessage("changeGameAudio", { manual: true, index: props.tempIndex });
	}

	const talkbackEnabled = props.currentTalkbackTargets.includes(props.person.id);

	const style: React.CSSProperties = {
		transform: CSS.Translate.toString(transform),
		transition,
		zIndex: isDragging ? 20 : undefined,
		outline: talkbackEnabled ? "2px solid yellow" : undefined,
		animation: talkbackEnabled ? "flash 250ms step-start infinite" : undefined,
	};

	const rawMicrophone = props.person.customData.microphone;
	const headset = getHeadsetData(rawMicrophone);

	const isOnRunnersAudio = props.isRunner && props.audioIndex === props.tempIndex;

	return (
		<MegaContainer>
			<PersonContainer ref={setNodeRef} style={style} {...listeners} {...attributes}>
				<NameBlock>
					<NameText>{props.person.name}</NameText>
					<PronounsText>{props.person.pronouns}</PronounsText>
				</NameBlock>
				{!props.isRunner && props.person.customData.tag && <TagBadge>{props.person.customData.tag}</TagBadge>}

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
					{/* <Tooltip placement="top" title={talkbackEnabled ? "Disable Talkback" : "Enable Talkback"}>
						<IconButton
							color={talkbackEnabled ? "primary" : "inherit"}
							onClick={toggleTalkback}
							size="small"
						>
							<RecordVoiceOver />
						</IconButton>
					</Tooltip> */}
					<Tooltip
						placement="top"
						title={
							props.isRunner ? (
								<>
									Editing Runners not supported
									<br /> Please use the Run Editor Panel
								</>
							) : (
								"Edit"
							)
						}
					>
						<span>
							<IconButton
								size="small"
								color="inherit"
								onClick={editCommentator}
								disabled={props.isRunner}
							>
								<Edit fontSize="small" />
							</IconButton>
						</span>
					</Tooltip>
				</ActionsRow>
			</PersonContainer>
			{props.isRunner && (
				<>
					<Button
						onClick={moveGameAudio}
						disabled={isOnRunnersAudio}
						variant={isOnRunnersAudio ? "contained" : "outlined"}
					>
						{isOnRunnersAudio ? "Active" : "Move"} Game Audio
					</Button>
				</>
			)}
		</MegaContainer>
	);
}
