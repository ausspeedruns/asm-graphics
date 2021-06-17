import React from 'react';
import styled from 'styled-components';
import { CouchPerson } from '../../types/OverlayProps';

const CouchContainer = styled.div`
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
`;

interface Props {
	couch: CouchPerson[];
	wide?: boolean;
	wideColumns?: number;
}

export const Couch: React.FC<Props> = (props: Props) => {
	let couchEls: JSX.Element[];

	if (props.wide) {
		let alternate = true;
		couchEls = props.couch.map((person) => {
			if ((props.wideColumns || 1) > 1) alternate = !alternate;
			return (
				<PersonWide
					width={100 / (props.wideColumns || 1)}
					person={person}
					flipped={alternate}
				/>
			);
		});
	} else {
		couchEls = props.couch.map((person) => {
			return <PersonCompressed person={person} />;
		});
	}

	if (!couchEls) return <></>;

	return (
		<CouchContainer>
			<MenuBar>
				<LineBorder />
				<div style={{ margin: '0 6px' }}>Couch</div>
				<LineBorder />
			</MenuBar>
			<PeopleContainer
				style={{
					justifyContent: props.wide ? 'space-between' : 'center',
				}}>
				{couchEls}
			</PeopleContainer>
		</CouchContainer>
	);
};

const PersonCompressedContainer = styled.div`
	display: flex;
	flex-direction: column;
	padding: 5px;
	color: #ffffff;
	background: #202545;
	font-size: 16px;
	margin: 8px;
`;

const Pronouns = styled.div`
	font-size: 12px;
	font-weight: lighter;
	text-transform: uppercase;
`;

interface PersonCompressedProps {
	person: CouchPerson;
}

const PersonCompressed: React.FC<PersonCompressedProps> = (props) => {
	return (
		<PersonCompressedContainer>
			<Pronouns>{props.person.pronouns}</Pronouns>
			<div>{props.person.name}</div>
		</PersonCompressedContainer>
	);
};

const PersonWideContainer = styled.div`
	display: flex;
	padding: 5px;
	color: #ffffff;
	background: #202545;
	align-items: center;
	margin: 4px 0;
`;

const PersonName = styled.div`
	flex-grow: 1;
	font-size: 16px;
`;

interface PersonWideProps {
	person: CouchPerson;
	width: number;
	flipped?: boolean;
}

const PersonWide: React.FC<PersonWideProps> = (props) => {
	return (
		<PersonWideContainer
			style={{
				flex: `1 1 ${props.width}%`,
				margin: props.flipped ? '4px 0 4px 4px' : '4px 4px 4px 0',
				flexDirection: props.flipped ? 'row-reverse' : 'row',
			}}>
			<Pronouns style={{ fontSize: 16 }}>
				{props.person.pronouns}
			</Pronouns>
			<PersonName style={{textAlign: props.flipped ? 'left' : 'right'}}>{props.person.name}</PersonName>
		</PersonWideContainer>
	);
};
