import styled from "@emotion/styled";

import { useNode } from "@craftjs/core";
import type { RunDataPlayer } from "@asm-graphics/types/RunData";
import { HOST_TAG } from "@asm-graphics/shared/constants";
import { useOverlayStore } from "../../../stores/overlay-store";
import { Box, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import {
	AlignHorizontalCenter,
	AlignHorizontalLeft,
	AlignHorizontalRight,
	TableRows,
	ViewColumn,
} from "@mui/icons-material";

const PeopleContainer = styled.div`
	font-family: var(--main-font);
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 8px;
`;

interface Props {
	style?: React.CSSProperties;
	className?: string;
	darkTitle?: boolean;
	align?: "left" | "center" | "right";
	direction?: "horizontal" | "vertical";
}

export function Couch(props: Props) {
	const {
		connectors: { connect, drag },
	} = useNode();
	const commentators = useOverlayStore((state) => state.commentators);
	const audio = useOverlayStore((state) => state.microphoneAudioIndicator);
	const showHost = useOverlayStore((state) => state.showHost);

	if (commentators.length === 0) return <></>;

	return (
		<PeopleContainer
			className={props.className}
			style={{
				justifyContent: props.align ?? "center",
				flexDirection: props.direction === "horizontal" ? "row" : "column",
				...props.style,
			}}
			ref={(ref) => {
				if (ref) {
					connect(drag(ref));
				}
			}}
		>
			{commentators.map((person, i) => {
				if (person.name === "" || (!showHost && person.customData["tag"] === HOST_TAG)) {
					return <></>;
				}

				return (
					<PersonCompressed
						key={person.id}
						commentator={person}
						speaking={audio?.[person.customData["microphone"] ?? ""]}
						index={i}
					/>
				);
			})}
		</PeopleContainer>
	);
}

function CouchSettings() {
	const {
		actions: { setProp },
		align,
		direction,
	} = useNode((node) => ({
		align: node.data.props["align"],
		direction: node.data.props["direction"],
	}));

	return (
		<>
			<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
				<Typography variant="caption">
					Alignment
				</Typography>
				<ToggleButtonGroup
					value={align}
					onChange={(_e, value: Props["align"] | null) => {
						if (!value) {
							return;
						}

						setProp((props: Props) => (props.align = value));
					}}
					exclusive
					size="small"
				>
					<ToggleButton value="left">
						<AlignHorizontalLeft fontSize="small" />
					</ToggleButton>
					<ToggleButton value="center">
						<AlignHorizontalCenter fontSize="small" />
					</ToggleButton>
					<ToggleButton value="right">
						<AlignHorizontalRight fontSize="small" />
					</ToggleButton>
				</ToggleButtonGroup>
			</Box>

			<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
				<Typography variant="caption">
					Direction
				</Typography>
				<ToggleButtonGroup
					value={direction}
					onChange={(_e, value: Props["direction"] | null) => {
						if (!value) {
							return;
						}

						setProp((props: Props) => (props.direction = value));
					}}
					exclusive
					size="small"
				>
					<ToggleButton value="horizontal">
						<ViewColumn fontSize="small" />
					</ToggleButton>
					<ToggleButton value="vertical">
						<TableRows fontSize="small" />
					</ToggleButton>
				</ToggleButtonGroup>
			</Box>
		</>
	);
}

Couch.craft = {
	displayName: "Couch",
	props: {
		direction: "vertical",
		align: "center",
	},
	related: {
		settings: CouchSettings,
	},
};

const PersonCompressedContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	color: var(--text-light);
	font-size: 17px;
	box-sizing: border-box;
	position: relative;
`;

const NameContainer = styled.div`
	background: #013853f1;
	padding: 6px 6px;
	margin-bottom: 6px;
	position: relative;
	display: flex;
	flex-direction: column;
	border-radius: 8px;
`;

interface SpeakingProps {
	speaking?: boolean;
}

const SpeakingColour = styled.div<SpeakingProps>`
	position: absolute;
	top: 0;
	left: 0;
	/* border-radius: 8px; */
	width: 100%;
	height: 100%;
	opacity: ${({ speaking }) => (speaking ? 1 : 0)};
	// background-color: #ffffff53;
	transition-duration: 0.2s;
	transition-delay: ${({ speaking }) => (speaking ? undefined : "0.5s")};

	outline: 4px solid white;
`;

// const Tag = styled.span`
// 	font-weight: bold;
// 	margin-right: 4px;
// 	font-family: var(--secondary-font);
// `;

const Name = styled.span`
	font-family: var(--secondary-font);
	font-weight: bold;
	z-index: 2;
	width: 100%;
`;

const Pronouns = styled.div`
	font-size: 75%;
	text-transform: uppercase;
	font-family: var(--main-font);
	z-index: 2;
`;

const Role = styled.div`
	font-weight: bold;
	font-size: 75%;
	border-radius: 15px;
	min-width: 20px;
	text-align: center;
`;

const Row = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

interface PersonCompressedProps {
	commentator: RunDataPlayer;
	speaking?: boolean;
	noTag?: boolean;
	index?: number;
	style?: React.CSSProperties;
}

export function PersonCompressed(props: PersonCompressedProps) {
	return (
		<PersonCompressedContainer style={props.style}>
			<NameContainer>
				<SpeakingColour speaking={props.speaking} />
				<Row>
					<Name>{props.commentator.name}</Name>
				</Row>
				<Row>
					{props.commentator.pronouns && <Pronouns>{props.commentator.pronouns}</Pronouns>}
					{props.commentator.customData["tag"] && <Role>{props.commentator.customData["tag"]}</Role>}
				</Row>
			</NameContainer>
		</PersonCompressedContainer>
	);
}
