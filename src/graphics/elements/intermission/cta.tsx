import React from 'react';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';

const InterCTAContainer = styled.div`
	z-index: 2;
	height: 115px;
	width: 100%;
	font-family: kulturista-web, sans-serif;
	background: #FFC629;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 54px;
	color: #251803;
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
	font-family: Noto Sans;
	z-index: 2;
`;

const LinesIMG = styled.img`
	position: absolute;
	left: 0;
`;

const CompassIMG = styled.img`
	position: absolute;
	right: 0;
`;

interface Props {
	style?: React.CSSProperties;
	className?: string;
}

export const InterCTA: React.FC<Props> = (props: Props) => {
	const [donationRep] = useReplicant<number, number>('donationTotal', 100);
	// const DonationAmount = 10000;

	return (
		<InterCTAContainer className={props.className} style={props.style}>
			<LinesIMG src="../shared/design/CTA_Lines.svg" />
			<DonateText>
				Donate at&nbsp;<b>ausspeedruns.com</b>
			</DonateText>
			<CharityLogo src={'../shared/design/CureCancer.svg'} />
			<Money>${Math.floor(donationRep || 10000).toLocaleString()}</Money>
			<CompassIMG src="../shared/design/CTA_Compass.svg" />
		</InterCTAContainer>
	);
};
