import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { useTickerStore } from "../stores/ticker-store";
import { useShallow } from "zustand/react/shallow";

const DonationMatchContainer = styled.div`
	background: white;
	font-size: 45px;
	padding: 0 8px;
`;

const GradientAnimation = keyframes`
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`;

const GradientText = styled.div`
	background: var(--goc-gradient);
	background-clip: text;
	-webkit-background-clip: text;
	color: transparent;

	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	animation: ${GradientAnimation} 5s ease infinite;
	background-size: 400% 400%;
`;

const MultiplierText = styled.div`
	font-weight: 900;
	height: 50px;
	margin-top: -6px;
`;

const DonationMatchLabel = styled.div`
	font-size: 30%;
	font-weight: bold;
`;

export function DonationMatchesFixture() {
	const donationMatches = useTickerStore((state) => state.donationMatches);
	const multiplierAmount = donationMatches.filter((match) => match.active).length;

	if (multiplierAmount === 0) {
		return null;
	}

	return (
		<DonationMatchContainer>
			<GradientText>
				<MultiplierText>{multiplierAmount + 1}×</MultiplierText>
				<DonationMatchLabel>Donation Match</DonationMatchLabel>
			</GradientText>
		</DonationMatchContainer>
	);
}
