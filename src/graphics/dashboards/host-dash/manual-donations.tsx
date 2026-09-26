import { useState } from "react";
import { useReplicant } from "@nodecg/react-hooks";
import _, { uniqueId } from "underscore";
import { Button, InputAdornment, Paper, Stack, TextField, Tooltip } from "@mui/material";
import { Check, Delete, Undo } from "@mui/icons-material";

import type { Donation } from "@asm-graphics/types/Donations";
import NumberField from "../../elements/number-field";
import styles from "./manual-donations.module.css";

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
	const [donations] = useReplicant("manual-donations");
	const [author, setAuthor] = useState("");
	const [message, setMessage] = useState("");
	const [amount, setAmount] = useState(0);

	const allDonations =
		donations
			?.map((donation, index) => (
				<DonationEl donation={donation} key={donation.id.toString() + index.toString()} />
			))
			.reverse() ?? [];

	function newDonation() {
		if (isNaN(amount)) {
			console.error("Amount was NaN", author, message, amount);
			return;
		}

		console.log("New Manual Donation", author, message, amount);
		const donation = {
			amount: amount,
			currencySymbol: "$",
			name: author,
			read: false,
			time: new Date().getTime(),
			desc: message,
			id: uniqueId(),
		} as Donation;

		void nodecg.sendMessage("manual-donations:new", donation);

		setAmount(0);
		setAuthor("");
		setMessage("");
	}

	const canAddNewDonation = author.trim() !== "" && !isNaN(amount) && amount > 0;

	return (
		<div className={styles.donationsContainer}>
			<div className={styles.donationForm}>
				<div className={styles.formTopRow}>
					<TextField
						margin="dense"
						label="Name"
						fullWidth
						value={author}
						onChange={(e) => setAuthor(e.target.value)}
					/>
					<NumberField
						margin="dense"
						label="Amount"
						fullWidth
						value={amount}
						startAdornment={<InputAdornment position="start">$</InputAdornment>}
						onValueChange={(value) => setAmount(value ?? 0)}
					/>
				</div>
				<TextField
					margin="dense"
					label="Message"
					multiline
					rows={2}
					fullWidth
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
					<Button
						color="success"
						variant="contained"
						onClick={newDonation}
						disabled={!canAddNewDonation}
						size="large"
					>
						Add
					</Button>
				</div>
			</div>
			<Stack style={{ padding: 8, wordBreak: "break-word" }}>
				{allDonations}
			</Stack>
		</div>
	);
};

/* Single Donation */

interface DonationProps {
	donation: Donation;
}

const DonationEl: React.FC<DonationProps> = (props: DonationProps) => {
	const timeText = new Date(props.donation.time).toLocaleTimeString();

	const toggleRead = () => {
		void nodecg.sendMessage("manual-donations:toggleRead", props.donation.id);
	};

	const deleteDono = () => {
		void nodecg.sendMessage("manual-donations:remove", props.donation.id);
	};

	return (
		<Paper className={styles.donationContainer} elevation={2}>
			<Tooltip title="Delete" placement="top">
				<Button color="error" variant="contained" onClick={deleteDono} style={{ flexGrow: 0, marginRight: 8 }}>
					<Delete />
				</Button>
			</Tooltip>
			<Stack style={{ flexGrow: 1, gap: 4 }}>
				<div>
					<span className={styles.amount}>${props.donation.amount.toLocaleString()}</span>
					<span className={styles.name}>{props.donation.name}</span>
				</div>
				<span className={styles.dateText}>{timeText}</span>
				<span style={{ fontStyle: props.donation.desc ? "" : "italic" }}>
					{_.unescape(props.donation.desc || "No comment").replace("&#39;", "'")}
				</span>
			</Stack>

			{props.donation.read && <div className={styles.disabledCover} />}

			{props.donation.read ? (
				<Tooltip title="Mark as unread" placement="top">
					<Button color="inherit" variant="outlined" onClick={toggleRead} style={{ flexGrow: 0 }}>
						<Undo />
					</Button>
				</Tooltip>
			) : (
				<Tooltip title="Mark as read" placement="top">
					<Button color="success" variant="contained" onClick={toggleRead} style={{ flexGrow: 0 }}>
						<Check />
					</Button>
				</Tooltip>
			)}
		</Paper>
	);
};
