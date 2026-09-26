import { useImperativeHandle, useRef } from "react";
import clsx from "clsx";

import type { Goal } from "@asm-graphics/types/Incentives";
import type { TickerItemHandles } from "../ticker";

import { FitText } from "../elements/fit-text";

import styles from "./goal.module.css";

interface GoalProps {
	goal: Goal;
	ref: React.Ref<TickerItemHandles>;
}

export function GoalBar(props: GoalProps) {
	const containerRef = useRef(null);
	const progressBarRef = useRef(null);

	const percentage = (props.goal.total / props.goal.goal) * 100;

	useImperativeHandle(props.ref, () => ({
		animation: (tl) => {
			// Start
			tl.fromTo(containerRef.current, { y: -64 }, { y: 0, duration: 1 }, "-=0.5");

			tl.fromTo(
				progressBarRef.current,
				{ width: 0 },
				{ width: `${percentage}%`, duration: Math.max(1, percentage / 45 + 0.5) },
				"+=0.1",
			);

			// End
			tl.to(containerRef.current, { y: 64, duration: 1 }, "+=10");
			tl.set(containerRef.current, { y: -64, duration: 1 });

			return tl;
		},
	}));

	let textOnRightSide: React.CSSProperties = {};
	if (percentage < 50) {
		textOnRightSide = {
			marginRight: -110,
			color: "var(--text-light)",
			textAlign: "left",
		};
	}

	return (
		<div className={styles.goalBarContainer} ref={containerRef}>
			<div className={clsx(styles.goalElement, styles.incentiveContainer)}>
				<FitText className={styles.game} text={props.goal.game} />
				<FitText className={styles.incentiveName} text={props.goal.incentive} />
			</div>
			<div className={styles.progressContainer}>
				<div className={styles.progressBarContainer} ref={progressBarRef}>
					<span className={styles.currentAmount} style={textOnRightSide}>
						${Math.floor(props.goal.total).toLocaleString()}
					</span>
				</div>
			</div>
			<div className={styles.goalElement}>
				<FitText className={styles.incentiveName} text={`$${props.goal.goal}`} />
			</div>
		</div>
	);
}
