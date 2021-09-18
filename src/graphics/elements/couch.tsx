import React from 'react';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';
import { CouchPerson } from '../../types/OverlayProps';

const CouchContainer = styled.div`
	font-family: National Park;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const MenuBar = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	color: var(--text-col);
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
	style?: React.CSSProperties;
	className?: string;
}

export const Couch: React.FC<Props> = (props: Props) => {
	const [currentHost] = useReplicant<CouchPerson, CouchPerson>('host', {
		name: '',
		pronouns: '',
	});

	if (props.couch.length === 0 && currentHost.name === '') return <></>;

	return (
		<CouchContainer className={props.className} style={props.style}>
			<MenuBar>
				<div style={{ margin: '0 6px' }}>{props.couch.length > 0 ? 'Commentators' : 'Commentator'}</div>
			</MenuBar>
			<PeopleContainer>
				{props.couch.map((person) => {
					return <PersonCompressed key={person.name} person={person} />;
				})}
				<PersonCompressed key={'Host'} person={currentHost} host />
			</PeopleContainer>
		</CouchContainer>
	);
};

const PersonCompressedContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 8px;
	color: var(--text-col);
	background: #251803;
	font-size: 22px;
	margin: 4px;
`;

const Pronouns = styled.div`
	font-size: 15px;
	font-weight: lighter;
	text-transform: uppercase;
`;

interface PersonCompressedProps {
	person: CouchPerson;
	host?: boolean;
}

export const PersonCompressed: React.FC<PersonCompressedProps> = (props) => {
	return (
		<PersonCompressedContainer>
			<span style={{ fontWeight: 'bold' }}>{props.person.name}</span>
			<Pronouns>
				<span style={{ fontWeight: 'bold' }}>{props.host && 'Host '}</span>
				{props.person.pronouns}
			</Pronouns>
		</PersonCompressedContainer>
	);
};
