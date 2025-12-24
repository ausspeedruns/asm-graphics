import styled from "styled-components";

import type { AudioIndicator } from "@asm-graphics/types/Audio";
import type { RunDataPlayer } from "@asm-graphics/types/RunData";

const CouchContainer = styled.div`
	font-family: var(--main-font);
	display: flex;
	flex-direction: column;
	align-items: center;
	// min-height: 114px;
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
		<CouchContainer className={props.className} style={props.style}>
			<MenuBar style={{ color: props.darkTitle ? "var(--text-dark)" : "var(--text-light)" }}>
				{/* <div style={{ margin: "0 6px" }}>{label}</div> */}
			</MenuBar>
			<PeopleContainer style={{ justifyContent: props.align ?? "center" }}>
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
	padding: 6px 6px;
	padding-top: 12px;
	margin-bottom: 6px;
	position: relative;
	display: flex;
	flex-direction: column;

	// ASAP2025
	background: #000;
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

	// ASAP2025
	font-family: Montserrat;
`;

const Pronouns = styled.div`
	font-size: 15px;
	text-transform: uppercase;
	font-family: var(--main-font);
	z-index: 2;

	// ASAP2025
	font-family: Montserrat;
	font-weight: 600;
`;

const Role = styled.div`
	font-weight: bold;
	font-size: 15px;
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
	const commentatorColour = props.commentator.customData.tag === "Host" ? "#3f7d8f" : "#cc7722";

	// ASAP2025
	const putTagOnSameRow = (!props.commentator.pronouns && props.commentator.id === "host") || !props.commentator.customData.tag;

	return (
		<PersonCompressedContainer style={props.style}>
			<NameContainer>
				<SpeakingColour speaking={props.speaking} />
				<div
					style={{
						position: "absolute",
						width: "100%",
						background: "#fff",
						height: 1,
						marginLeft: -6,
						top: 6,
					}}
				/>
				<Row>
					<Name style={{ textAlign: props.commentator.pronouns ? "left" : "center" }}>
						{props.commentator.name}
					</Name>
					{putTagOnSameRow && (
						<Role style={{ background: commentatorColour, marginLeft: 8 }}>
							{props.commentator.customData.tag
								? props.commentator.id === "host"
									? "H"
									: props.commentator.customData.tag
								: "C"}
						</Role>
					)}
				</Row>
				<Row>
					<Pronouns style={{ color: commentatorColour }}>{props.commentator.pronouns}</Pronouns>
					{!putTagOnSameRow && (
						<Role style={{ background: commentatorColour }}>
							{props.commentator.customData.tag
								? props.commentator.id === "host"
									? "H"
									: props.commentator.customData.tag
								: "C"}
						</Role>
					)}
				</Row>
			</NameContainer>
		</PersonCompressedContainer>
	);
}
