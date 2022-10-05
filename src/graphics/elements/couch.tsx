import React from 'react';
import styled from 'styled-components';

import { CouchPerson } from '../../types/OverlayProps';
import { OBSAudioIndicator } from '../../types/Audio';

const CouchContainer = styled.div`
	font-family: Nasalization;
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
	audio?: OBSAudioIndicator[];
	style?: React.CSSProperties;
	className?: string;
}

export const Couch: React.FC<Props> = (props: Props) => {
	if (props.couch.length === 0) return <></>;

	const host = props.couch.find((person) => person.host);

	// Remove host from array now
	const couch = props.couch.filter((person) => !person.host);

	return (
		<CouchContainer className={props.className} style={props.style}>
			<MenuBar>
				<div style={{ margin: '0 6px' }}>{props.couch.length > 1 ? 'Commentators' : 'Commentator'}</div>
			</MenuBar>
			<PeopleContainer>
				{couch.map((person) => {
					return (
						<PersonCompressed
							key={person.name}
							person={person}
							speaking={props.audio?.find((audio) => audio.id == person.name)?.active}
						/>
					);
				})}
				{host && (
					<PersonCompressed
						key={'Host'}
						person={host}
						speaking={props.audio?.find((audio) => audio.id == host.name)?.active}
						host
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
	font-size: 22px;
	margin: 4px;
	box-sizing: border-box;
	position: relative;
`;

const SpeakingColour = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	opacity: ${(props: SpeakingProps) => (props.speaking ? 1 : 0)};
	background: linear-gradient(
		90deg,
		rgba(255, 198, 41, 0) 0%,
		rgba(255, 198, 41, 0.588) 50%,
		rgba(255, 198, 41, 0) 100%
	);
	transition-duration: 0.2s;
	transition-delay: ${(props: SpeakingProps) => (props.speaking ? undefined : '0.5s')};
`;

interface SpeakingProps {
	speaking?: boolean;
}

const GradientBorder = styled.div`
	height: 2px;
	width: 100%;
	background: linear-gradient(90deg, rgba(255, 198, 41, 0) 0%, #ffc629 50%, rgba(255, 198, 41, 0) 100%);
	z-index: 2;
`;

const Name = styled.span`
	font-weight: bold;
	padding: 0 8px;
	z-index: 2;
`;

const Pronouns = styled.div`
	font-size: 15px;
	padding: 0 8px;
	text-transform: uppercase;
	font-family: 'Orbitron';
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
			<GradientBorder style={{ marginBottom: 6 }} />
			<Name>{props.person.name}</Name>
			<Pronouns>
				<span style={{ fontWeight: 'bold' }}>{props.host && 'Host '}</span>
				{props.person.pronouns}
			</Pronouns>
			<GradientBorder style={{ marginTop: 6 }} />
		</PersonCompressedContainer>
	);
};
