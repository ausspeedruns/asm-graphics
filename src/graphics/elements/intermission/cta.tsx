import React from 'react';
import styled from 'styled-components';

import GoCLogo from '../../media/Sponsors/GOCCCFullColour.svg';

const InterCTAContainer = styled.div`
	height: 300px;
	width: 100%;
	font-family: var(--secondary-font);
	/* background: #ffffff; */
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-size: 52px;
	color: var(--text-dark);
	/* border-bottom: 1px solid var(--sec); */
	background: var(--sec);
`;

const Horizontal = styled.div`
	z-index: 2;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 16px;
`;

const DonateText = styled.span`
	text-transform: uppercase;
	z-index: 2;
`;

const CharityLogo = styled.img`
	width: 400px;
	height: 150px;
	object-fit: contain;
	/* margin-left: 35px; */
	z-index: 2;
`;

const Money = styled.span`
	font-size: 100px;
	font-weight: bold;
	margin-left: 16px;
	font-family: Noto Sans;
	z-index: 2;
`;

const DollarSign = styled.span`
	font-size: 75px;
`;

interface Props {
	donation: number;
	style?: React.CSSProperties;
	className?: string;
}

export const InterCTA: React.FC<Props> = (props: Props) => {
	const testDonationAmount = 0;

	return (
		<InterCTAContainer className={props.className} style={props.style}>
			<DonateText>
				Donate at&nbsp;<b>ausspeedruns.com</b>
			</DonateText>
			<Horizontal>
				<CharityLogo src={GoCLogo} />
				<Money>
					<DollarSign>$</DollarSign>
					{Math.floor(testDonationAmount > 0 ? testDonationAmount : props.donation ?? 0).toLocaleString()}
				</Money>
			</Horizontal>
		</InterCTAContainer>
	);
};
