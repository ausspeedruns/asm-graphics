import { useReplicant } from "@nodecg/react-hooks";
import styles from "./donation-total.module.css";

export function DonationTotal() {
	const [donationTotalRep] = useReplicant("donationTotal");
	const [manualDonationRep] = useReplicant("manual-donation-total");

	return (
		<div className={styles.donationTotalContainer}>
			<div className={styles.total}>${((donationTotalRep ?? 0) + (manualDonationRep ?? 0)).toLocaleString()}</div>
		</div>
	);
}
