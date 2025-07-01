import styled from "styled-components";

import type { Commentator } from "@asm-graphics/types/OverlayProps";
import type { AudioIndicator } from "@asm-graphics/types/Audio";

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
`;

interface Props {
	commentators: Commentator[];
	host?: Commentator;
	audio?: AudioIndicator;
	style?: React.CSSProperties;
	className?: string;
	darkTitle?: boolean;
}

export const Couch: React.FC<Props> = (props: Props) => {
	if (props.commentators.length === 0 && !props.host) return <></>;

	let label = "";
	if (props.commentators.length > 1) {
		label = "Commentators";
	} else if (props.commentators.length == 1) {
		label = "Commentator";
	} else if (props.host && props.host.name) {
		label = "Host";
	}

	return (
		<CouchContainer className={props.className} style={props.style}>
			<MenuBar style={{ color: props.darkTitle ? "var(--text-dark)" : "var(--text-light)" }}>
				{/* <div style={{ margin: "0 6px" }}>{label}</div> */}
			</MenuBar>
			<PeopleContainer>
				{props.commentators.map((person) => {
					if (person.name === "") {
						return <></>;
					}
					return (
						<PersonCompressed
							key={person.id}
							commentator={person}
							speaking={props.audio?.[person.microphone ?? ""]}
						/>
					);
				})}
				{props.host && props.host.name && (
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
};

const PersonCompressedContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	color: var(--text-light);
	font-size: 20px;
	margin: 4px;
	box-sizing: border-box;
	position: relative;
	background: var(--main);
	padding: 8px 12px;

	outline: 1px solid white;
	outline-offset: 3px;
	margin-bottom: 24px;
`;

const SpeakingColour = styled.div<SpeakingProps>`
	position: absolute;
	top: 0;
	left: 0;
	/* border-radius: 8px; */
	width: 100%;
	height: 100%;
	opacity: ${({ speaking }) => (speaking ? 1 : 0)};
	background-color: #ffffff53;
	transition-duration: 0.2s;
	transition-delay: ${({ speaking }) => (speaking ? undefined : "0.5s")};
`;

interface SpeakingProps {
	speaking?: boolean;
}

const Tag = styled.span`
	font-weight: bold;
	margin-right: 4px;
	font-family: var(--secondary-font);
`;

const Name = styled.span`
	font-family: var(--secondary-font);
	/* font-weight: bold; */
	z-index: 2;
`;

const Pronouns = styled.div`
	font-size: 15px;
	text-transform: uppercase;
	font-family: var(--main-font);
	z-index: 2;
`;

const Role = styled.div`
	position: absolute;
	font-weight: bold;
	font-size: 15px;
	bottom: -25px;
	left: -4px;
`;

interface PersonCompressedProps {
	commentator: Commentator;
	speaking?: boolean;
	noTag?: boolean;
	style?: React.CSSProperties;
}

export const PersonCompressed: React.FC<PersonCompressedProps> = (props) => {
	return (
		<PersonCompressedContainer style={props.style}>
			<SpeakingColour speaking={props.speaking} />
			<Name>{props.commentator.name}</Name>
			<Pronouns>
				{props.commentator.pronouns}
			</Pronouns>
			<Role>
				{props.commentator.tag}
			</Role>
		</PersonCompressedContainer>
	);
};
