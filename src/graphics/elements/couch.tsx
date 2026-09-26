import clsx from "clsx";

import type { AudioIndicator } from "@asm-graphics/types/Audio";
import type { RunDataPlayer } from "@asm-graphics/types/RunData";
import { HOST_TAG } from "@asm-graphics/shared/constants";
import { FitText } from "./fit-text";
import styles from "./couch.module.css";

interface Props {
	commentators: RunDataPlayer[];
	audio?: AudioIndicator;
	style?: React.CSSProperties;
	className?: string;
	darkTitle?: boolean;
	align?: "left" | "center" | "right";
	showHost?: boolean;
}

export function Couch(props: Props) {
	if (props.commentators.length === 0) return <></>;

	const showHost = typeof props.showHost === "boolean" ? props.showHost : true;

	return (
		<div
			className={clsx(styles.peopleContainer, props.className)}
			style={{ justifyContent: props.align ?? "center", ...props.style }}
		>
			{props.commentators.map((person, i) => {
				if (person.name === "" || (!showHost && person.customData["tag"] === HOST_TAG)) {
					return <></>;
				}
				return (
					<PersonCompressed
						key={person.id}
						commentator={person}
						speaking={props.audio?.[(person.customData["microphone"] as string | undefined) ?? ""]}
						index={i}
					/>
				);
			})}
		</div>
	);
}

interface PersonCompressedProps {
	commentator: RunDataPlayer;
	speaking?: boolean;
	noTag?: boolean;
	index?: number;
	style?: React.CSSProperties;
}

export function PersonCompressed(props: PersonCompressedProps) {
	const displayTag = props.commentator.customData["tag"] as string | undefined;

	return (
		<div
			className={clsx(styles.commentator, props.speaking && styles.speaking)}
			style={props.style}
		>
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
