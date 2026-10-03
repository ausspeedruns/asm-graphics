import { useImperativeHandle, useRef, useState } from "react";
import clsx from "clsx";

import type { War } from "@asm-graphics/types/Incentives.js";
import type { TickerItemHandles } from "../ticker.js";

import { FitText } from "@asm-graphics/shared-browser/fit-text.js";
import styles from "./war.module.css";

const MAX_ALLOWED = 4;

interface GoalProps {
	war: War;
	ref: React.Ref<TickerItemHandles>;
}

export function WarGame(props: GoalProps) {
	const containerRef = useRef(null);
	const optionRefs = useRef<TickerItemHandles[]>([]);
	const [animLabel] = useState(props.war.index.toString() + "a");

	useImperativeHandle(props.ref, () => ({
		animation: (tl) => {
			// Start
			tl.fromTo(containerRef.current, { y: -64 }, { y: 0, duration: 1 });

			for (let i = 0; i < Math.min(props.war.options.length, MAX_ALLOWED - 1); i++) {
				const optionRef = optionRefs.current[props.war.options.length - 1 - i];

				if (!optionRef) continue;

				tl.add(optionRef.animation(tl), animLabel);
			}

			// End
			tl.to(containerRef.current, { y: 64, duration: 1 }, "+=10");
			tl.set(containerRef.current, { y: -64 });

			return tl;
		},
	}));

	let highest = 1; // Setting this to 0 could lead to a divide by zero lol :P
	props.war.options.forEach((option) => {
		if (option.total > highest) highest = option.total;
	});

	let allOptions = [];
	const sortedOptions = props.war.options.map((option) => ({ ...option }));
	sortedOptions.sort((a, b) => a.total - b.total);

	const overMax = props.war.options.length > MAX_ALLOWED;
	const displayCount = overMax ? MAX_ALLOWED - 1 : Math.min(props.war.options.length, 5);

	for (let i = 0; i < displayCount; i++) {
		const option = sortedOptions[props.war.options.length - 1 - i];

		if (!option) continue;

		allOptions.push(
			<WarChoice
				animLabel={animLabel}
				option={option}
				highest={highest}
				index={i}
				key={option.name}
				ref={(el) => {
					if (el) {
						optionRefs.current[props.war.options.length - 1 - i] = el;
					}
				}}
			/>,
		);
	}

	if (overMax) {
		const remaining = props.war.options.length - displayCount;
		allOptions.push(<MoreChoices key={"more"} more={remaining} />);
	}

	return (
		<div className={styles.warChoiceContainer} ref={containerRef}>
			<div className={clsx(styles.goal, styles.incentiveContainer)}>
				<FitText className={styles.game} text={props.war.game} />
				<FitText className={styles.incentiveName} text={props.war.incentive} />
			</div>
			<div className={styles.allOptionContainer}>{allOptions.length > 0 ? allOptions : <NoChoicesMade />}</div>
		</div>
	);
}

interface WarChoiceProps {
	option: War["options"][number];
	highest: number;
	animLabel: string;
	index?: number;
	ref: React.Ref<TickerItemHandles>;
}

function WarChoice(props: WarChoiceProps) {
	const percentage = (props.option.total / props.highest) * 100;
	const progressBarRef = useRef(null);

	useImperativeHandle(props.ref, () => ({
		animation: (tl) => {
			// Start
			tl.set(progressBarRef.current, { width: 0 }, "warStart");
			tl.to(progressBarRef.current, { width: `${percentage}%`, duration: 2 }, props.animLabel);
			return tl;
		},
	}));

	return (
		<div className={styles.progressContainer}>
			<div className={styles.progressBarContainer}
				ref={progressBarRef}
				style={{
					borderColor: "var(--accent)",
					background: isColor(props.option.name) ? props.option.name : "var(--accent)",
				}}
			/>
			<div className={styles.textDiv}>
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						background: "#FFFFFF",
						padding: "0 10px",
						maxWidth: "80%",
					}}
				>
					<FitText className={styles.optionName} text={props.option.name} />
					<span className={styles.currentAmount}>${Math.floor(props.option.total).toLocaleString()}</span>
				</div>
			</div>
		</div>
	);
}

function NoChoicesMade() {
	return <div className={styles.noChoicesContainer}>No names submitted</div>;
}

interface MoreChoicesProps {
	more: number;
}

function MoreChoices(props: MoreChoicesProps) {
	return <div className={styles.moreChoicesContainer}>{props.more} more options</div>;
}

function isColor(strColor: string) {
	const s = new Option().style;
	s.color = strColor;
	return s.color !== "";
}
