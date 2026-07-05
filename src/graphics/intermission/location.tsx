import { useState, useEffect } from "react";
import { format } from "date-fns";
import styles from "./location.module.css";

export function Location() {
	const [currentTime, setCurrentTime] = useState(format(new Date(), "h:mm a EEE"));

	useEffect(() => {
		function setTime() {
			const now = new Date();
			setCurrentTime(format(now, "h:mm a EEE"));
		}

		setTime();

		const interval = setInterval(setTime, 1000);

		return () => {
			clearInterval(interval);
		};
	}, []);
	return (
		<div className={styles.locationInfo}>
			<b>Adelaide</b>
			<span>Australia</span>
			<span className={styles.timeContainer}>{currentTime}</span>
		</div>
	);
}
