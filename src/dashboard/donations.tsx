import { createRoot } from "react-dom/client";
import { useReplicant } from "@nodecg/react-hooks";
import _ from "underscore";

import type { Donation } from "@asm-graphics/types/Donations.js";

import { darkTheme } from "./theme.js";
import { Paper, Stack, ThemeProvider } from "@mui/material";
import styles from "./donations.module.css";

export const Donations: React.FC = () => {
	const [donationTotalRep] = useReplicant("donationTotal");
	const [donations] = useReplicant("donations");

	return (
		<ThemeProvider theme={darkTheme}>
			<div className={styles.donationTotal}>${(donationTotalRep ?? 0).toLocaleString()}</div>
			<div className={styles.donationsList}>
				{donations
					?.map((donation) => {
						return <DonationEl key={donation.id} donation={donation} />;
					})
					.reverse()}
			</div>
		</ThemeProvider>
	);
};

/* Single Donation */

interface DonationProps {
	donation: Donation;
}

function DonationEl(props: DonationProps) {
	const timeText = new Date(props.donation.time).toLocaleTimeString();

	return (
		<Paper className={styles.donationContainer} elevation={2}>
			<Stack>
				<div>
					<span className={styles.amount}>
						{props.donation.currencySymbol}
						{props.donation.amount.toLocaleString()}
					</span>
					<span className={styles.name}>{props.donation.name}</span>
				</div>
				<span className={styles.dateText}>{timeText}</span>
				<span style={{ fontStyle: props.donation.desc ? "" : "italic" }}>
					{_.unescape(props.donation.desc || "No comment").replace("&#39;", "'")}
				</span>
			</Stack>
		</Paper>
	);
}

createRoot(document.getElementById("root")!).render(<Donations />);
