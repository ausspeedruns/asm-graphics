import styled from "styled-components";

import type { Commentator } from "@asm-graphics/types/OverlayProps";
import type { AudioIndicator } from "@asm-graphics/types/Audio";

const CouchContainer = styled.div`
	font-family: var(--main-font);
	display: flex;
	flex-direction: column;
	align-items: center;
	// min-height: 114px;
	padding: 8px 0;
`;

const MenuBar = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	color: var(--text-light);
	font-family: var(--main-font);
	font-size: 25px;
`;

const PeopleContainer = styled.div`
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 8px;
`;

interface Props {
	commentators: Commentator[];
	host?: Commentator;
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
		<CouchContainer className={props.className} style={props.style}>
			<MenuBar style={{ color: props.darkTitle ? "var(--text-dark)" : "var(--text-light)" }}>
				{/* <div style={{ margin: "0 6px" }}>{label}</div> */}
			</MenuBar>
			<PeopleContainer style={{ justifyContent: props.align ?? "center" }}>
				{props.commentators.map((person, i) => {
					if (person.name === "") {
						return <></>;
					}
					return (
						<PersonCompressed
							key={person.id}
							commentator={person}
							speaking={props.audio?.[person.microphone ?? ""]}
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
		</CouchContainer>
	);
}

const PersonCompressedContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	color: var(--text-light);
	font-size: 20px;
	margin: 4px;
	box-sizing: border-box;
	position: relative;
`;

const NameContainer = styled.div`
	background: var(--main);
	padding: 8px 12px;
	outline: 1px solid white;
	outline-offset: 3px;
	margin-bottom: 6px;
	position: relative;
	display: flex;
	flex-direction: column;
`;

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

interface SpeakingProps {
	speaking?: boolean;
}

// const Tag = styled.span`
// 	font-weight: bold;
// 	margin-right: 4px;
// 	font-family: var(--secondary-font);
// `;

const Name = styled.span`
	font-family: var(--secondary-font);
	/* font-weight: bold; */
	z-index: 2;
	width: 100%;
`;

const Pronouns = styled.div`
	font-size: 15px;
	text-transform: uppercase;
	font-family: var(--main-font);
	z-index: 2;
`;

const Role = styled.div`
	// position: absolute;
	font-weight: bold;
	font-size: 15px;
	// bottom: -25px;
	left: -4px;
`;

interface PersonCompressedProps {
	commentator: Commentator;
	speaking?: boolean;
	noTag?: boolean;
	index?: number;
	style?: React.CSSProperties;
}

// Note to future me: Just copy the component from a previous event, I have really messed it up for ASM2025.

export function PersonCompressed(props: PersonCompressedProps) {
	return (
		<PersonCompressedContainer style={props.style}>
			<NameContainer>
				<SpeakingColour speaking={props.speaking} />
				<Name style={{ textAlign: props.commentator.pronouns ? "left" : "center" }}>
					{props.commentator.name}
				</Name>
				<Pronouns>{props.commentator.pronouns}</Pronouns>
			</NameContainer>
			<Role>{props.commentator.tag ? props.commentator.tag : `COMMS ${props.index}`}</Role>
		</PersonCompressedContainer>
	);
}
