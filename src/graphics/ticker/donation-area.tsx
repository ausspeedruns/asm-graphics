import { useTickerStore } from "../stores/ticker-store.js";
import { LerpNum } from "./lerp-num.js";

import GoCLogo from "../media/game-on-cancer/word-mark.svg?react";
import styles from "./donation-area.module.css";

export function TickerDonationTotal() {
	const donationAmount = useTickerStore((state) => state.donationTotal + state.manualDonationTotal);

	return (
		<div className={styles.tickerDonationTotalContainer}>
			$<LerpNum value={donationAmount} />
			<GoCLogo className={styles.charityLogo} />
		</div>
	);
}
