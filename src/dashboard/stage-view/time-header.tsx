import { useEffect, useState } from "react";
import { format } from "date-fns";

import styles from "./time-header.module.css";

export function TimeHeader() {
	const [timeText, setTimeText] = useState(getTimeString());

	useEffect(() => {
		const updateTime = () => {
			setTimeText(getTimeString());
		};
		updateTime();
		const interval = setInterval(updateTime, 1000);
		return () => clearInterval(interval);
	});

	return <div className={styles.container}>{timeText}</div>;
}

function getTimeString() {
	const now = new Date();
	return `${format(now, "HH:mm:ss EEEE, dd MMMM yyyy")} (${getTimezoneName(now)})`;
}

function getTimezoneName(date: Date) {
	const shortZone = Intl.DateTimeFormat("en-AU", {
		timeZoneName: "short",
	})
		?.formatToParts(date)
		?.find((part) => part.type === "timeZoneName")?.value;

	return shortZone;
}
