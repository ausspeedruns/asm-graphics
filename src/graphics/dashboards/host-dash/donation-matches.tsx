import styled from "@emotion/styled";
import { useReplicant } from "@nodecg/react-hooks";
import { Box } from "@mui/material";
import { formatDistanceToNow } from "date-fns";

import type { DonationMatch as IDonationMatch } from "@asm-graphics/types/Donations";

const DonationMatchesContainer = styled.div`
	display: flex;
	flex-direction: column;
	padding: 8px;
	padding-right: 24px;
`;

interface Props {
	style?: React.CSSProperties;
}

export function DonationMatches(props: Props) {
	const [donationMatchesRep] = useReplicant("donation-matches");

	const reversedMatches = [...(donationMatchesRep ?? [])].reverse();

	const allDonationMatches = reversedMatches.map((donationMatch) => {
		if (donationMatch.endsAt > Date.now()) {
			return (
				<DonationMatch
					key={donationMatch.id}
					active={donationMatch.endsAt > Date.now()}
					donationMatch={donationMatch}
				/>
			);
		}

		return <></>;
	});

	return <DonationMatchesContainer style={props.style}>{allDonationMatches}</DonationMatchesContainer>;
}

const DonationMatchContainer = styled(Box)<ActiveProps>`
	margin: 6px 0;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	font-size: 20px;
	padding: 8px;
	border-radius: 7px;
	width: 100%;
	background: var(--inset-background);
	opacity: ${({ active }) => (active ? "1" : "0.4")};
`;

const Row = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 1.1em;
`;

const Name = styled.span`
	font-size: 1.2em;
	/* font-weight: bold; */
`;
const EndTime = styled.span`
	font-weight: bold;
`;

const Progress = styled.div`
	background: #3f3f3f;
	flex-grow: 1;
	border-radius: 8px;
	height: 2em;
`;

const ProgressBar = styled.div`
	background: #c72;
	height: 100%;
	/* padding: 8px; */
	border-radius: 8px;
	color: white;
	padding-left: 8px;
	line-height: 2em;
	box-sizing: border-box;
`;

const Total = styled.span`
	font-weight: bold;
	width: 70px;
	text-align: right;
	line-height: 2em;
`;

interface RunProps {
	donationMatch: IDonationMatch;
	active?: boolean;
	style?: React.CSSProperties;
}

interface ActiveProps {
	active?: boolean;
}

function DonationMatch(props: RunProps) {
	return (
		<DonationMatchContainer boxShadow={2} active={props.active} style={props.style}>
			<Row>
				<Name>{props.donationMatch.name}</Name>
				<EndTime>Ends in {formatDistanceToNow(props.donationMatch.endsAt)}</EndTime>
			</Row>
			<Row>
				<Progress>
					<ProgressBar
						style={{ width: `${(props.donationMatch.amount / props.donationMatch.pledge) * 100}%` }}
					>
						{props.donationMatch.currencySymbol}
						{props.donationMatch.amount.toLocaleString()}
					</ProgressBar>
				</Progress>
				<Total>
					{props.donationMatch.currencySymbol}
					{props.donationMatch.pledge.toLocaleString()}
				</Total>
			</Row>
		</DonationMatchContainer>
	);
}
