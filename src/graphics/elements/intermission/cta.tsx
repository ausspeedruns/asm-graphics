import React from 'react';
import styled from 'styled-components';

import GoCLogo from '../../media/Sponsors/GoCCWhiteColour.svg';

const InterCTAContainer = styled.div`
	height: 184px;
	width: 100%;
	font-family: Orbitron;
	/* background: #ffffff; */
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-size: 42px;
	color: var(--text-light);
	border-bottom: 1px solid var(--sec);
`;

const Horizontal = styled.div`
	z-index: 2;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const DonateText = styled.span`
	text-transform: uppercase;
	z-index: 2;
`;

const CharityLogo = styled.img`
	width: 265px;
	height: 84px;
	object-fit: contain;
	margin-left: 35px;
	z-index: 2;
`;

const Money = styled.span`
	font-size: 66px;
	font-weight: bold;
	margin-left: 16px;
	font-family: Noto Sans;
	z-index: 2;
`;

interface Props {
	donation: number;
	style?: React.CSSProperties;
	className?: string;
}

export const InterCTA: React.FC<Props> = (props: Props) => {
	// const DonationAmount = 10000;

	return (
		<InterCTAContainer className={props.className} style={props.style}>
			<DonateText>
				Donate at&nbsp;<b>ausspeedruns.com</b>
			</DonateText>
			<Horizontal>
				<CharityLogo src={GoCLogo} />
				<Money>${Math.floor(props.donation ?? 10000).toLocaleString()}</Money>
			</Horizontal>
		</InterCTAContainer>
	);
};
