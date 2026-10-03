import { useTickerStore } from "../stores/ticker-store.js";
import styles from "./donation-matches-fixture.module.css";

export function DonationMatchesFixture() {
	const donationMatches = useTickerStore((state) => state.donationMatches);
	const multiplierAmount = donationMatches.filter((match) => match.active).length;

	if (multiplierAmount === 0) {
		return null;
	}

	return (
		<div className={styles.donationMatchContainer}>
			<div className={styles.gradientText}>
				<div className={styles.multiplierText}>{multiplierAmount + 1}×</div>
				<div className={styles.donationMatchLabel}>Donation Match</div>
			</div>
		</div>
	);
}
