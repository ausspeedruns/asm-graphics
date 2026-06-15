import styled from "@emotion/styled";
import { useTickerStore } from "../stores/ticker-store";
import { LerpNum } from "./lerp-num";

import GoCLogo from "../media/Sponsors/GoCWhite.svg";

const TickerDonationTotalContainer = styled.div`
	height: 100%;
	width: fit-content;
	float: right;
	font-size: 37px;

	display: flex;
	align-items: center;
	padding: 0 10px;
	color: var(--text-light);
	font-weight: bold;
	font-family: var(--mono-font);

	background: var(--goc-gradient);
`;

const CharityLogo = styled.img`
	height: 45px;
	width: auto;
	margin-left: 10px;
`;

export function TickerDonationTotal() {
	const donationAmount = useTickerStore((state) => state.donationTotal + state.manualDonationTotal);

	return (
		<TickerDonationTotalContainer>
			$<LerpNum value={donationAmount} />
			<CharityLogo src={GoCLogo} />
		</TickerDonationTotalContainer>
	);
}
