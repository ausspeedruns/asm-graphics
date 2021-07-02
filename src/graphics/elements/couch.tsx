import React from 'react';
import styled from 'styled-components';
import { CouchPerson } from '../../types/OverlayProps';

const CouchContainer = styled.div`
	font-family: Noto Sans;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const LineBorder = styled.div`
	height: 4px;
	flex-grow: 1;
	background: var(--asm-orange);
`;

const MenuBar = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
	color: #ffffff;
	font-style: italic;
	font-size: 18px;
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
	if (props.couch.length === 0) return <></>;

	return (
		<CouchContainer className={props.className} style={props.style}>
			<MenuBar>
				<LineBorder />
				<div style={{ margin: '0 6px' }}>{props.couch.length > 1 ? 'Commentators' : 'Commentator'}</div>
				<LineBorder />
			</MenuBar>
			<PeopleContainer>
				{props.couch.map((person) => {
					return <PersonCompressed person={person} />;
				})}
			</PeopleContainer>
		</CouchContainer>
	);
};

const PersonCompressedContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 8px;
	color: #ffffff;
	background: #202545;
	font-size: 16px;
	margin: 4px;
`;

const Pronouns = styled.div`
	font-size: 12px;
	font-weight: lighter;
	text-transform: uppercase;
`;

interface PersonCompressedProps {
	person: CouchPerson;
}

export const PersonCompressed: React.FC<PersonCompressedProps> = (props) => {
	return (
		<PersonCompressedContainer>
			<Pronouns>{props.person.pronouns}</Pronouns>
			<div>{props.person.name}</div>
		</PersonCompressedContainer>
	);
};
