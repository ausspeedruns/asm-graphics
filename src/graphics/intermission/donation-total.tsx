import clsx from "clsx";
import styles from "./donation-total.module.css";

import { LerpNum } from "../ticker/lerp-num";
import { useIntermissionStore } from "../stores/intermission-store";

export function IntermissionDonationTotal() {
	const donationTotal = useIntermissionStore((state) => state.donationTotal);
	// const donationMatchMultiplier = useIntermissionStore((state) => state.donationMatchMultiplier);
	const donationMatchMultiplier = 2;

	return (
		<div className={styles.donationTotal}>
			<div
				className={clsx(
					styles.total,
					donationMatchMultiplier && donationMatchMultiplier > 1 && styles.donationMultiplier,
				)}
			>
				<span className={styles.dollarSign}>$</span>
				<LerpNum value={donationTotal} />

				{donationMatchMultiplier && donationMatchMultiplier > 1 && (
					<span className={styles.matchMultiplier}>
						<span className={styles.number}>
							{donationMatchMultiplier}×<br />
							<span className={styles.text}>MATCH</span>
						</span>
					</span>
				)}
			</div>

			<div className={styles.link}>AusSpeedruns.com/Donate</div>
		</div>
	);
}
