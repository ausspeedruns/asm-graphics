import type { RunDataPlayer } from "@asm-graphics/types/RunData";
import clsx from "clsx";
import { FitText } from "../fit-text";
import styles from "./person.module.css";

interface PersonCompressedProps {
	commentator: RunDataPlayer;
	speaking?: boolean;
	noTag?: boolean;
	index?: number;
	style?: React.CSSProperties;
}

export function Person(props: PersonCompressedProps) {
	const displayTag = props.commentator.customData["tag"] as string | undefined;

	return (
		<div className={clsx(styles.commentator, props.speaking && styles.speaking)} style={props.style}>
			{/* <SpeakingColour speaking={props.speaking} /> */}
			<div className={styles.row}>
				<FitText className={styles.name} text={props.commentator.name} alignment="left" />
			</div>
			<div className={styles.row}>
				{props.commentator.pronouns && <div className={styles.pronouns}>{props.commentator.pronouns}</div>}
				{displayTag && <div className={styles.role}>{displayTag}</div>}
			</div>
		</div>
	);
}
