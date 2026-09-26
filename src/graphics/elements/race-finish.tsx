import { useRef, useEffect } from "react";
import gsap from "gsap";
import clsx from "clsx";
import styles from "./race-finish.module.css";

function timeFormat(time?: string) {
	if (!time) return "";

	let formattedTime = time;
	if (formattedTime[0] === "0") {
		formattedTime = formattedTime?.substring(1);
	} else {
		return formattedTime;
	}

	if (formattedTime[0] === "0") {
		formattedTime = formattedTime?.substring(2);
	} else {
		return formattedTime;
	}

	if (formattedTime[0] === "0") {
		formattedTime = formattedTime?.substring(1);
	}

	return formattedTime;
}

interface RaceFinishProps {
	time?: string;
	place?: number;
	style?: React.CSSProperties;
	className?: string;
}

export const RaceFinish: React.FC<RaceFinishProps> = (props: RaceFinishProps) => {
	const animRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (props.time) {
			gsap.to(animRef.current, { y: 0, duration: 1 });
			return;
		}
		gsap.to(animRef.current, { y: 35 });
	}, [props.time]);

	let bgColour = "#e0e0e0";
	switch (props.place) {
		case 1:
			bgColour = "#dab509";
			break;
		case 2:
			bgColour = "#a1a1a1";
			break;
		case 3:
			bgColour = "#ae7058";
			break;
	}

	return (
		<div className={clsx(styles.raceFinishContainer, props.className)} style={props.style}>
			<div className={styles.animatedContainer} ref={animRef} style={{ backgroundColor: bgColour }}>
				<div className={styles.position}>{props.place === -1 ? "X" : props.place}</div>
				<div className={styles.finalTime}>{timeFormat(props.time)}</div>
			</div>
		</div>
	);
};
