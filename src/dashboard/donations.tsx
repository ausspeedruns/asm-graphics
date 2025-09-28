import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { useReplicant } from "@nodecg/react-hooks";
import _ from "underscore";

import { Donation } from "@asm-graphics/types/Donations";

import { darkTheme } from "./theme";
import { Box, Grid, ThemeProvider } from "@mui/material";

const DonationTotal = styled.div`
	width: 100%;
	text-align: center;
	font-size: 30px;
	font-weight: bold;
`;

const DonationsList = styled.div`
	max-height: 300px;
	display: flex;
	flex-direction: column;
	overflow-y: scroll;
`;

export const Donations: React.FC = () => {
	const [donationTotalRep] = useReplicant<number>("donationTotal");
	const [donations] = useReplicant<Donation[]>("donations");

	return (
		<ThemeProvider theme={darkTheme}>
			<DonationTotal>${(donationTotalRep ?? 0).toLocaleString()}</DonationTotal>
			<DonationsList>
				{donations
					?.map((donation) => {
						return <DonationEl key={donation.id} donation={donation} />;
					})
					.reverse()}
			</DonationsList>
		</ThemeProvider>
	);
};

/* Single Donation */

interface DonationProps {
	donation: Donation;
}

const DonationContainer = styled(Box)`
	margin: 6px 0;
	display: flex;
	justify-content: space-between;
	font-size: 13px;
	padding: 8px;
	border-radius: 7px;
	background-color: #4d5e80;
	position: relative;
`;

const Amount = styled.span`
	font-weight: bold;
	font-size: 1.2rem;
	margin-right: 6px;
`;

const Name = styled.span`
	font-weight: bold;
	font-size: 1.2rem;
`;

const DateText = styled.span`
	color: #aaa;
`;

const DonationEl: React.FC<DonationProps> = (props: DonationProps) => {
	const timeText = new Date(props.donation.time).toLocaleTimeString();

	return (
		<DonationContainer boxShadow={2}>
			<Grid direction="column" container>
				<div>
					<Amount>
						{props.donation.currencySymbol}
						{props.donation.amount.toLocaleString()}
					</Amount>
					<Name>{props.donation.name}</Name>
				</div>
				<DateText>{timeText}</DateText>
				<span style={{ fontStyle: props.donation.desc ? "" : "italic" }}>
					{_.unescape(props.donation.desc || "No comment").replace("&#39;", "'")}
				</span>
			</Grid>
		</DonationContainer>
	);
};

createRoot(document.getElementById("root")!).render(<Donations />);
