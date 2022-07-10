import React from 'react';
import styled from 'styled-components';

import { CouchPerson } from '../../types/OverlayProps';
import { OBSAudioIndicator } from '../../types/Audio';

const CouchContainer = styled.div`
	font-family: Noto Sans;
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
				<div style={{ margin: '0 6px' }}>{props.couch.length > 0 ? 'Commentators' : 'Commentator'}</div>
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
	padding: 8px;
	color: var(--text-light);
	background: var(--main-dark);
	border: solid var(--accent) 5px;
	border-radius: 15px;
	font-size: 22px;
	margin: 4px;
	box-sizing: border-box;
	transition-duration: 0.2s;
`;

const Pronouns = styled.div`
	font-size: 15px;
	text-transform: uppercase;
`;

interface PersonCompressedProps {
	person: CouchPerson;
	speaking?: boolean;
	host?: boolean;
}

export const PersonCompressed: React.FC<PersonCompressedProps> = (props) => {
	return (
		<PersonCompressedContainer
			style={{
				background: props.speaking ? '#22467e' : undefined,
				transitionDelay: props.speaking ? undefined : '0.5s',
			}}>
			<span style={{ fontWeight: 'bold' }}>{props.person.name}</span>
			<Pronouns>
				<span style={{ fontWeight: 'bold' }}>{props.host && 'Host '}</span>
				{props.person.pronouns}
			</Pronouns>
		</PersonCompressedContainer>
	);
};
