import styled from "@emotion/styled";

import type { AudioIndicator } from "@asm-graphics/types/Audio";
import type { RunDataPlayer } from "@asm-graphics/types/RunData";
import { HOST_TAG } from "@asm-graphics/shared/constants";
import { FitText } from "./fit-text";

import CommentatorsNormalBG from "../media/asm26/CommentatorsNormal.png";
import CommentatorsHostBG from "../media/asm26/CommentatorsHost.png";

const PeopleContainer = styled.div`
	font-family: var(--main-font);
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 8px;
`;

interface Props {
	commentators: RunDataPlayer[];
	audio?: AudioIndicator;
	style?: React.CSSProperties;
	className?: string;
	darkTitle?: boolean;
	align?: "left" | "center" | "right";
	showHost?: boolean;
}

export function Couch(props: Props) {
	if (props.commentators.length === 0) return <></>;

	const showHost = typeof props.showHost === "boolean" ? props.showHost : true;

	return (
		<PeopleContainer
			className={props.className}
			style={{ justifyContent: props.align ?? "center", ...props.style }}
		>
			{props.commentators.map((person, i) => {
				if (person.name === "" || (!showHost && person.customData["tag"] === HOST_TAG)) {
					return <></>;
				}
				return (
					<PersonCompressed
						key={person.id}
						commentator={person}
						speaking={props.audio?.[(person.customData["microphone"] as string | undefined) ?? ""]}
						index={i}
					/>
				);
			})}
		</PeopleContainer>
	);
}

interface SpeakingProps {
	speaking?: boolean;
	isHost?: boolean;
}

const PersonCompressedContainer = styled.div<SpeakingProps>`
	background-image: url(${({ isHost }) => (isHost ? CommentatorsHostBG : CommentatorsNormalBG)});
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center;
	height: 80px;
	width: 210px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 4px;
	color: var(--text-light);
	font-size: 19px;
	box-sizing: border-box;
	position: relative;
	box-sizing: border-box;
	padding: 20px;
	margin: -10px;
	filter: ${({ speaking }) => (speaking ? "drop-shadow(0px 0px 10px #ff9c6e)" : "none")};
`;

const Name = styled(FitText)`
	font-family: var(--secondary-font);
	font-weight: bold;
	z-index: 2;
	width: 100%;
	max-width: 100%;
	text-box: trim-both ex text;
`;

const Pronouns = styled.div`
	font-size: 75%;
	text-transform: uppercase;
	font-family: var(--main-font);
	z-index: 2;
	text-box: trim-both ex text;
`;

const Role = styled.div`
	font-weight: bold;
	font-size: 75%;
	border-radius: 15px;
	min-width: 20px;
	text-align: center;
	text-box: trim-both ex text;
`;

const Row = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	gap: 4px;
`;

interface PersonCompressedProps {
	commentator: RunDataPlayer;
	speaking?: boolean;
	noTag?: boolean;
	index?: number;
	style?: React.CSSProperties;
}

export function PersonCompressed(props: PersonCompressedProps) {
	let isHost = false;
	let displayTag = props.commentator.customData["tag"] as string | undefined;
	if (displayTag === HOST_TAG) {
		displayTag = "";
		isHost = true;
	}

	return (
		<PersonCompressedContainer isHost={isHost} speaking={props.speaking} style={props.style}>
			{/* <SpeakingColour speaking={props.speaking} /> */}
			<Row>
				<Name text={props.commentator.name} alignment="left" />
			</Row>
			<Row>
				{props.commentator.pronouns && <Pronouns>{props.commentator.pronouns}</Pronouns>}
				{displayTag && <Role>{displayTag}</Role>}
			</Row>
		</PersonCompressedContainer>
	);
}
