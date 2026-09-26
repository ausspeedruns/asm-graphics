import clsx from "clsx";
import { useReplicant } from "@nodecg/react-hooks";
import { Paper } from "@mui/material";
import { formatDistanceToNow } from "date-fns";

import type { DonationMatch as IDonationMatch } from "@asm-graphics/types/Donations";
import styles from "./donation-matches.module.css";

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

	return <div className={styles.donationMatchesContainer} style={props.style}>{allDonationMatches}</div>;
}

interface RunProps {
	donationMatch: IDonationMatch;
	active?: boolean;
	style?: React.CSSProperties;
}

function DonationMatch(props: RunProps) {
	return (
		<Paper className={clsx(styles.donationMatchContainer, !props.active && styles.inactive)} elevation={2} style={props.style}>
			<div className={styles.row}>
				<span className={styles.name}>{props.donationMatch.name}</span>
				<span className={styles.endTime}>Ends in {formatDistanceToNow(props.donationMatch.endsAt)}</span>
			</div>
			<div className={styles.row}>
				<div className={styles.progress}>
					<div className={styles.progressBar}
						style={{ width: `${(props.donationMatch.amount / props.donationMatch.pledge) * 100}%` }}
					>
						{props.donationMatch.currencySymbol}
						{props.donationMatch.amount.toLocaleString()}
					</div>
				</div>
				<span className={styles.total}>
					{props.donationMatch.currencySymbol}
					{props.donationMatch.pledge.toLocaleString()}
				</span>
			</div>
		</Paper>
	);
}
