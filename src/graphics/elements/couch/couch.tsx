import styles from "./couch.module.css";
import clsx from "clsx";

import type { AudioIndicator } from "@asm-graphics/types/Audio";
import type { RunDataPlayer } from "@asm-graphics/types/RunData";
import { HOST_TAG } from "@asm-graphics/shared/constants";
import { Person } from "./person";

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
					return undefined;
				}

				return (
					<Person
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
