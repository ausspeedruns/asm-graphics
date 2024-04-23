import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useReplicant } from "@nodecg/react-hooks";
import _, { uniqueId } from "underscore";
import { Box, Grid, TextField, Tooltip } from "@mui/material";
import { Check } from "@mui/icons-material";

import { Donation } from "@asm-graphics/types/Donations";

import { GreenButton, RedButton } from "../../dashboard/elements/styled-ui";

const DonationsContainer = styled.div`
	height: calc(100% - 56px);
	overflow-x: hidden;
	overflow-y: auto;
`;

const DonationForm = styled.div`
	padding: 8px;
`;

const FormTopRow = styled.div`
	display: flex;
	width: 100%;
	justify-content: space-between;
`;

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

export const ManualDonations: React.FC = () => {
	const [donations] = useReplicant<Donation[]>("manual-donations");
	const [author, setAuthor] = useState("");
	const [message, setMessage] = useState("");
	const [amount, setAmount] = useState("");

	const allDonations =
		donations?.map((donation, index) => <DonationEl donation={donation} key={donation.id.toString() + index.toString()} />).reverse() ?? [];

	function newDonation() {
		if (isNaN(parseFloat(amount))) {
			console.error("Amount was NaN", author, message, amount);
			return;
		}

		console.log("New Manual Donation", author, message, amount);
		const donation = {
			amount: parseFloat(amount),
			currencySymbol: "$",
			name: author,
			read: false,
			time: new Date().getTime(),
			desc: message,
			id: uniqueId(),
		} as Donation;

		nodecg.sendMessage("manual-donations:new", donation);

		setAmount("");
		setAuthor("");
		setMessage("");
	}

	return (
		<DonationsContainer>
			<DonationForm>
				<FormTopRow>
					<TextField
						margin="dense"
						label="Name"
						fullWidth
						value={author}
						onChange={(e) => setAuthor(e.target.value)}
					/>
					<TextField
						margin="dense"
						label="Amount"
						type="number"
						fullWidth
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
					/>
				</FormTopRow>
				<TextField
					margin="dense"
					label="Message"
					multiline
					rows={2}
					fullWidth
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<GreenButton variant="contained" onClick={newDonation} style={{ float: "right" }}>
					Add
				</GreenButton>
			</DonationForm>
			<Grid container direction="column" style={{ padding: 8 }}>
				{allDonations}
			</Grid>
		</DonationsContainer>
	);
};

/* Single Donation */

interface DonationProps {
	donation: Donation;
}

const NewFlash = keyframes`
	from { background-color: #000000; }
	to { background-color: #eee; }
`;

const DonationContainer = styled(Box)`
	margin: 6px 0;
	display: flex;
	justify-content: space-between;
	font-size: 13px;
	padding: 8px;
	border-radius: 7px;
	animation-name: ${NewFlash};
	animation-duration: 0.5s;
	background-color: #eee;
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

const DisabledCover = styled.div`
	position: absolute;
	height: 100%;
	width: 100%;
	background: rgba(0, 0, 0, 0.35);
	top: 0px;
	left: 0px;
	border-radius: 7px;
`;

const DonationEl: React.FC<DonationProps> = (props: DonationProps) => {
	const timeText = new Date(props.donation.time).toLocaleTimeString();

	const toggleRead = () => {
		nodecg.sendMessage("markDonationReadUnread", props.donation.id);
	};

	const deleteDono = () => {
		nodecg.sendMessage("manual-donations:remove", props.donation.id);
	};

	return (
		<DonationContainer boxShadow={2}>
			<Grid direction="column" container>
				<div>
					<Amount>${props.donation.amount.toLocaleString()}</Amount>
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
					<GreenButton variant="contained" onClick={toggleRead}>
						<Check />
					</GreenButton>
				</Tooltip>
			)}

			<Tooltip title="Mark as read" placement="top">
				<RedButton variant="contained" onClick={deleteDono}>
					–
				</RedButton>
			</Tooltip>
		</DonationContainer>
	);
};
