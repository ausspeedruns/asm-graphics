import { useState, useEffect } from "react";
import { format } from "date-fns";
import styles from "./current-time.module.css";

export function CurrentTime() {
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, 500);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className={styles.currentTimeArea}>
			<span>{format(currentTime, "h:mm a")}</span>
			<span>{format(currentTime, "E d")}</span>
		</div>
	);
}
