import type { RunDataPlayer } from "@asm-graphics/types/RunData";
import clsx from "clsx";
import { FitText } from "../fit-text";
import styles from "./person.module.css";
import { HOST_TAG } from "@asm-graphics/shared/constants";

// ASAP2026
import Ticket from "../../media/asap26/ticket.svg?react";

interface PersonCompressedProps {
	commentator: RunDataPlayer;
	speaking?: boolean;
	noTag?: boolean;
	index?: number;
	style?: React.CSSProperties;
}

export function Person(props: PersonCompressedProps) {
	const displayTag =
		typeof props.commentator.customData["tag"] === "string" ? props.commentator.customData["tag"] : undefined;

	return (
		<>
			{/* ASAP2026: Ticket-style commentator card */}
			<div className={clsx(styles.commentator, props.speaking && styles.speaking)} style={props.style}>
				{/* ASAP2026: Inline SVG inherits its color from CSS. */}
				<Ticket className={styles.ticket} aria-hidden="true" />
				<div className={styles.frame}>
					<div className={styles.label}>
						<span className={styles.labelText}>{displayTag ?? "COMM"}</span>
					</div>
					<div className={styles.content}>
						<FitText className={styles.name} text={props.commentator.name} alignment="left" />
						{props.commentator.pronouns && (
							<div className={styles.pronouns}>{props.commentator.pronouns}</div>
						)}
					</div>
				</div>
			</div>
			{/* ASAP2026: Original layout retained, commented out.
			<div className={clsx(styles.commentator, props.speaking && styles.speaking)} style={props.style}>
				<div className={styles.row}>
					<FitText className={styles.name} text={props.commentator.name} alignment="left" />
				</div>
				<div className={styles.row}>
					{props.commentator.pronouns && <div className={styles.pronouns}>{props.commentator.pronouns}</div>}
					{displayTag && <div className={styles.role}>{displayTag}</div>}
				</div>
			</div>
			*/}
		</>
	);
}
