import React from 'react';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';

const InterCTAContainer = styled.div`
	z-index: 2;
	height: 115px;
	width: 100%;
	font-family: Noto Sans;
	background: #FFFFFF;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 54px;
	color: var(--main-col);
	border-top: 1px solid var(--asm-orange);
	border-bottom: 1px solid var(--asm-orange);
`;

const DonateText = styled.span`
	text-transform: uppercase;
`;

const CharityLogo = styled.img`
	width: 265px;
	height: 84px;
	object-fit: contain;
	margin-left: 35px;
`;

const Money = styled.span`
	font-size: 66px;
	font-weight: bold;
	margin-left: 16px;
`;

interface Props {
	style?: React.CSSProperties;
	className?: string;
}

export const InterCTA: React.FC<Props> = (props: Props) => {
	const [donationRep] = useReplicant<number, number>('donationTotal', 100, {
		namespace: 'asm-donations',
	});
	// const DonationAmount = 10000;

	return (
		<InterCTAContainer className={props.className} style={props.style}>
			<DonateText>
				Donate at&nbsp;<b>ausspeedruns.com</b>
			</DonateText>
			<CharityLogo src={require('../../media/Sponsors/PSBB.png')} />
			<Money>${Math.floor(donationRep || 10000).toLocaleString()}</Money>
		</InterCTAContainer>
	);
};
