import type { CSSProperties } from "react";
import styles from "./run-info.module.css";

import { FitText } from "./fit-text";

/*			CATEGORY			*/
interface CategoryProps {
	category: string;
	style?: CSSProperties;
}

export function Category(props: CategoryProps) {
	return <FitText className={styles.categoryContainer} allowNewlines style={props.style} id="category" text={props.category} />;
}

/*			ESTIMATE			*/
interface EstimateProps {
	estimate: string;
	style?: CSSProperties;
}

export function Estimate(props: EstimateProps) {
	let formattedEstimate = props.estimate;

	if (formattedEstimate[0] === "0" && formattedEstimate[1] !== ":") {
		formattedEstimate = formattedEstimate.substring(1);
	}

	return (
		<div className={styles.estimateContainer} style={props.style} id="estimate">
			<span className={styles.estText}>{formattedEstimate && "EST "}</span>
			<span>{formattedEstimate}</span>
		</div>
	);
}

/*			GAME TITLE			*/
interface GameProps {
	game: string;
	style?: CSSProperties;
}

export function GameTitle(props: GameProps) {
	return <FitText className={styles.gameContainer} allowNewlines style={props.style} id="gameTitle" text={props.game} />;
}

/*			SYSTEM			*/
interface SystemProps {
	system: string;
	style?: CSSProperties;
}

export function System(props: SystemProps) {
	return <FitText className={styles.systemContainer} style={props.style} text={props.system} id="system" />;
}

/*			YEAR			*/
interface YearProps {
	year: string;
	style?: CSSProperties;
}

export function Year(props: YearProps) {
	return (
		<div className={styles.yearContainer} style={props.style} id="year">
			{props.year ? props.year : "????"}
		</div>
	);
}
