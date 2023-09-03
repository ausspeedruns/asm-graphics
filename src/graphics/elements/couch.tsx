import React from "react";
import styled from "styled-components";

import { CouchPerson } from "@asm-graphics/types/OverlayProps";
import { AudioIndicator } from "@asm-graphics/types/Audio";

const CouchContainer = styled.div`
	font-family: var(--main-font);
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const MenuBar = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	color: var(--text-light);
	font-size: 25px;
`;

const PeopleContainer = styled.div`
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
`;

interface Props {
	couch: CouchPerson[];
	audio?: AudioIndicator;
	style?: React.CSSProperties;
	className?: string;
}

export const Couch: React.FC<Props> = (props: Props) => {
	if (props.couch.length === 0) return <></>;

	const host = props.couch.find((person) => person.host);

	// Remove host from array now
	const couch = props.couch.filter((person) => !person.host);
	// console.log(props.audio)
	return (
		<CouchContainer className={props.className} style={props.style}>
			<MenuBar>
				<div style={{ margin: "0 6px" }}>{props.couch.length > 1 ? "Commentators" : "Commentator"}</div>
			</MenuBar>
			<PeopleContainer>
				{couch.map((person) => {
					// console.log(props.audio?.[person.microphone ?? '']);
					if (person.name === "") {
						return <></>;
					}
					return (
						<PersonCompressed
							key={person.name}
							person={person}
							speaking={props.audio?.[person.microphone ?? ""]}
						/>
					);
				})}
				{host && <PersonCompressed key={"Host"} person={host} speaking={props.audio?.["Host"]} host />}
			</PeopleContainer>
		</CouchContainer>
	);
};

const PersonCompressedContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	color: var(--text-light);
	font-size: 22px;
	margin: 4px;
	box-sizing: border-box;
	position: relative;
	background: var(--main);
	padding: 8px;
	border-radius: 8px;
	border: 1px solid var(--accent);
`;

const SpeakingColour = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	border-radius: 8px;
	width: 100%;
	height: 100%;
	opacity: ${(props: SpeakingProps) => (props.speaking ? 1 : 0)};
	background-color: #ffffff53;
	transition-duration: 0.2s;
	transition-delay: ${(props: SpeakingProps) => (props.speaking ? undefined : "0.5s")};
`;

interface SpeakingProps {
	speaking?: boolean;
}

const Name = styled.span`
	font-family: var(--secondary-font);
	/* font-weight: bold; */
	z-index: 2;
`;

const Pronouns = styled.div`
	font-size: 15px;
	text-transform: uppercase;
	font-family: var(--main-font);
	/* font-family: var(--secondary-font); */
	z-index: 2;
`;

interface PersonCompressedProps {
	person: CouchPerson;
	speaking?: boolean;
	host?: boolean;
}

export const PersonCompressed: React.FC<PersonCompressedProps> = (props) => {
	return (
		<PersonCompressedContainer>
			<SpeakingColour speaking={props.speaking} />
			<Name>{props.person.name}</Name>
			<Pronouns>
				<span style={{ fontWeight: "bold" }}>{props.host && "Host "}</span>
				{props.person.pronouns}
			</Pronouns>
		</PersonCompressedContainer>
	);
};
