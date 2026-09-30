import styles from "./timer.module.css";

interface Props {
	milliseconds?: number;
	style?: React.CSSProperties;
}

export function Timer(props: Props) {
	let millis = 0;
	if (props.milliseconds) {
		millis = Math.floor((props.milliseconds % 1000) / 100);
	}

	// A run over 10 hours though possible is unlikely for now
	let compressedTime = millisecondsToDisplayTime(props.milliseconds ?? 0);

	return (
		<div className={styles.timerContainer} style={props.style} id="timer">
			<span data-text={compressedTime}>{compressedTime}</span>
			<span className={styles.milliText} data-text={`.${millis}`}>
				.{millis}
			</span>
		</div>
	);
}

function millisecondsToDisplayTime(milliseconds: number): string {
	const totalSeconds = Math.floor(milliseconds / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	let result = "";

	if (hours > 0) {
		if (hours >= 10) {
			result = String(hours).padStart(2, "0") + ":";
		} else {
			result = String(hours) + ":";
		}
	}

	result += String(minutes).padStart(2, "0") + ":";
	result += String(seconds).padStart(2, "0");

	return result;
}
