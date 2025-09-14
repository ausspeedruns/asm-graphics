import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useReplicant } from "@nodecg/react-hooks";
import _ from "underscore";
import { Box, Button, Grid, Tooltip } from "@mui/material";
import { Check } from "@mui/icons-material";
import { List, RowComponentProps } from "react-window";

import { Donation } from "@asm-graphics/types/Donations";

import { EditIncentiveDialog } from "./edit-incentive-dialog";

const DonationsContainer = styled.div`
	height: calc(100% - 56px);
	overflow-x: hidden;
	overflow-y: auto;
`;

type RowProps = {
	donations: Donation[];
};

// Donation object example
// desc: "for PeekingBoo a joy to watch and listen to! Goodluck!"
// id: "donation-18005983"
// read: false
// time: "2020-11-25T09:48:38.144Z"
// title: "Pip donated $22"
// used: false

// interface TiltifyDonation {
// 	id: number,
// 	amount: number,
// 	name: string,
// 	comment: string,
// 	completedAt: number,
// 	updatedAt: number,
// 	sustained: boolean,
// 	shown: boolean,
// 	read: boolean
// }

export const Donations = () => {
	const [donationsRep] = useReplicant<Donation[]>("donations");
	const [editIncentiveOpen, setEditIncentiveOpen] = useState(false);

	const reversedDonations = [...(donationsRep ?? [])].reverse() ?? [];

	return (
		<DonationsContainer>
			<div style={{ display: "flex", justifyContent: "center", padding: "1% 20%" }}>
				<Button onClick={() => setEditIncentiveOpen(true)} variant="outlined">
					Edit Incentives
				</Button>
			</div>
			<div style={{ padding: "0 8px", height: "100%" }}>
				{reversedDonations.length > 0 && (
					<List<RowProps>
						rowCount={reversedDonations.length}
						rowProps={{ donations: reversedDonations }}
						rowHeight={(index) => getRowHeight(reversedDonations?.[index].desc ?? "")}
						rowComponent={VirtualisedDonation}
					/>
				)}
			</div>
			<EditIncentiveDialog open={editIncentiveOpen} onClose={() => setEditIncentiveOpen(false)} />
		</DonationsContainer>
	);
};

/* Single Donation */

interface DonationProps {
	donation: Donation;
	style: React.CSSProperties;
}

const NewFlash = keyframes`
	from { background-color: #000000; }
	to { background-color: var(--inset-background); }
`;

const MARGIN = 6;
const PADDING = 8;

const DonationContainer = styled(Box)`
	display: flex;
	justify-content: space-between;
	font-size: 13px;
	border-radius: 7px;
	/* animation-name: ${NewFlash};
	animation-duration: 0.5s; */
	background-color: var(--inset-background);
	position: relative;
	padding: ${PADDING}px;
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

const DisabledCover = styled.div`
	position: absolute;
	height: 100%;
	width: 100%;
	background: rgba(0, 0, 0, 0.35);
	top: 0px;
	left: 0px;
	border-radius: 7px;
`;

function getRowHeight(description: string) {
	return 96 + Math.floor(description.length / 2.5);
}

function VirtualisedDonation({ index, style, donations }: RowComponentProps<RowProps>) {
	return (
		<DonationEl
			style={{
				...style,
				top: parseFloat(style?.top?.toString() ?? "0") + (MARGIN + PADDING) * 2,
				height: parseFloat(style?.height?.toString() ?? "0") - (MARGIN + PADDING) * 2,
				width: "97%",
			}}
			donation={donations[index]}
		/>
	);
}

function DonationEl(props: DonationProps) {
	const timeText = new Date(props.donation.time).toLocaleTimeString();

	const toggleRead = () => {
		nodecg.sendMessage("markDonationReadUnread", props.donation.id);
	};

	return (
		<DonationContainer
			boxShadow={2}
			style={{
				...props.style,
				paddingTop: MARGIN,
			}}>
			<Grid direction="column" container style={{ paddingRight: 4, flexWrap: "nowrap" }}>
				<div>
					<Amount>
						${props.donation.amount.toLocaleString()}
						{props.donation.currencyCode !== "AUD" ? ` ${props.donation.currencyCode}` : ""}
					</Amount>
					<Name>{props.donation.name}</Name>
				</div>
				<DateText>{timeText}</DateText>
				<span style={{ fontStyle: props.donation.desc ? "" : "italic" }}>
					{_.unescape(props.donation.desc || "No comment").replace("&#39;", "'")}
				</span>
			</Grid>

			{props.donation.read ? (
				<DisabledCover />
			) : (
				<Tooltip title="Mark as read" placement="top">
					<Button color="success" variant="contained" onClick={toggleRead}>
						<Check />
					</Button>
				</Tooltip>
			)}
		</DonationContainer>
	);
}
