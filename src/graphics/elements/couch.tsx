import styled from "styled-components";

import type { AudioIndicator } from "@asm-graphics/types/Audio";
import type { RunDataPlayer } from "@asm-graphics/types/RunData";

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
	host?: RunDataPlayer;
	audio?: AudioIndicator;
	style?: React.CSSProperties;
	className?: string;
	darkTitle?: boolean;
	align?: "left" | "center" | "right";
	showHost?: boolean;
}

export function Couch(props: Props) {
	if (props.commentators.length === 0 && !props.host) return <></>;

	let label = "";
	if (props.commentators.length > 1) {
		label = "Commentators";
	} else if (props.commentators.length == 1) {
		label = "Commentator";
	} else if (props.host && props.host.name) {
		label = "Host";
	}

	const showHost = typeof props.showHost === "boolean" ? props.showHost : true;

	return (
		<PeopleContainer
			className={props.className}
			style={{ justifyContent: props.align ?? "center", ...props.style }}
		>
			{props.commentators.map((person, i) => {
				if (person.name === "" || person.id === "host") {
					return <></>;
				}
				return (
					<PersonCompressed
						key={person.id}
						commentator={person}
						speaking={props.audio?.[person.customData.microphone ?? ""]}
						index={i}
					/>
				);
			})}
			{showHost && props.host && props.host.name && (
				<PersonCompressed
					key={"Host"}
					commentator={props.host}
					speaking={props.audio?.["Host"]}
					noTag={label === "Host"}
				/>
			)}
		</PeopleContainer>
	);
}

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
					{props.commentator.customData.tag && <Role>{props.commentator.customData.tag}</Role>}
				</Row>
			</NameContainer>
		</PersonCompressedContainer>
	);
}
