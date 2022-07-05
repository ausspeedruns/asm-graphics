import React from 'react';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';
import { Credits } from '../elements/credits';

const CreditsOverlayContainer = styled.div`
	height: 1016px;
	width: 1920px;
	position: relative;
	overflow: hidden;
`;

const LowerThird = styled.div`
	position: absolute;
	bottom: 0;
	padding-bottom: 50px;
	width: 100%;
	align-items: center;
	font-family: National Park;
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

const Name = styled.div`
	font-size: 30px;
	padding: 10px 20px;
	font-weight: bold;
	color: #251803;
	background: var(--pax-gold);
`;

const Title = styled.div`
	font-size: 25px;
	padding: 8px 16px;
	background: #251803;
	color: var(--text-light);
`;

interface Props {
	className?: string;
	style?: React.CSSProperties;
}

export const CreditsOverlay: React.FC<Props> = (props: Props) => {
	const [creditsNameRep] = useReplicant<{ name: string; title: string }, { name: string; title: string }>(
		'credits-name',
		{ name: '', title: '' },
	);
	return (
		<CreditsOverlayContainer className={props.className} style={props.style}>
			<Credits />
			<LowerThird
				style={{
					visibility: creditsNameRep.name === '' && creditsNameRep.title === '' ? 'hidden' : 'visible',
				}}>
				<Name>{creditsNameRep.name}</Name>
				<Title>{creditsNameRep.title}</Title>
			</LowerThird>
		</CreditsOverlayContainer>
	);
};
