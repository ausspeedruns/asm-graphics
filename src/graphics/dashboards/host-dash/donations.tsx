import { useState } from "react";
import { useReplicant } from "@nodecg/react-hooks";
import _ from "underscore";
import { Button, Grid, Paper, Stack, Tooltip } from "@mui/material";
import { Check } from "@mui/icons-material";
import { List, type RowComponentProps } from "react-window";

import type { Donation } from "@asm-graphics/types/Donations";

import { EditIncentiveDialog } from "./edit-incentive-dialog";
import styles from "./donations.module.css";

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
	const [donationsRep] = useReplicant("donations");
	const [editIncentiveOpen, setEditIncentiveOpen] = useState(false);

	const reversedDonations = [...(donationsRep ?? [])].reverse() ?? [];

	return (
		<div className={styles.donationsContainer}>
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
						rowHeight={(index) => getRowHeight(reversedDonations?.[index]?.desc ?? "")}
						rowComponent={VirtualisedDonation}
					/>
				)}
			</div>
			<EditIncentiveDialog open={editIncentiveOpen} onClose={() => setEditIncentiveOpen(false)} />
		</div>
	);
};

/* Single Donation */

interface DonationProps {
	donation: Donation;
	style: React.CSSProperties;
}

const MARGIN = 6;
const PADDING = 8;

function getRowHeight(description: string) {
	return 96 + Math.floor(description.length / 2.5);
}

function VirtualisedDonation({ index, style, donations }: RowComponentProps<RowProps>) {
	const donation = donations[index];

	if (!donation) return <></>;

	return (
		<DonationEl
			style={{
				...style,
				top: parseFloat(style?.top?.toString() ?? "0") + (MARGIN + PADDING) * 2,
				height: parseFloat(style?.height?.toString() ?? "0") - (MARGIN + PADDING) * 2,
				width: "97%",
			}}
			donation={donation}
		/>
	);
}

function DonationEl(props: DonationProps) {
	const timeText = new Date(props.donation.time).toLocaleTimeString();

	const toggleRead = () => {
		void nodecg.sendMessage("donations:toggleRead", props.donation.id);
	};

	return (
		<Paper
			className={styles.donationContainer}
			elevation={2}
			style={{
				...props.style,
				paddingTop: MARGIN,
			}}
		>
			<Stack style={{ paddingRight: 4, flexWrap: "nowrap" }}>
				<div>
					<span className={styles.amount}>
						${props.donation.amount.toLocaleString()}
						{props.donation.currencyCode !== "AUD" ? ` ${props.donation.currencyCode}` : ""}
					</span>
					<span className={styles.name}>{props.donation.name}</span>
				</div>
				<span className={styles.dateText}>{timeText}</span>
				<span style={{ fontStyle: props.donation.desc ? "" : "italic" }}>
					{_.unescape(props.donation.desc || "No comment").replace("&#39;", "'")}
				</span>
			</Stack>

			{props.donation.read ? (
				<div className={styles.disabledCover} />
			) : (
				<Tooltip title="Mark as read" placement="top">
					<Button color="success" variant="contained" onClick={toggleRead}>
						<Check />
					</Button>
				</Tooltip>
			)}
		</Paper>
	);
}
