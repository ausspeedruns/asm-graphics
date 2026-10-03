import { useImperativeHandle, useRef } from "react";

import type { Goal } from "@asm-graphics/types/Incentives.js";
import type { TickerItemHandles } from "../incentives.js";

import { FitText } from "@asm-graphics/shared-browser/fit-text.js";
import styles from "./incent-goal.module.css";

interface GoalProps {
	goal: Goal;
	ref: React.Ref<TickerItemHandles>;
}

export const GoalBar = (props: GoalProps) => {
	const containerRef = useRef(null);
	const progressBarRef = useRef(null);

	useImperativeHandle(props.ref, () => ({
		animation: (tl) => {
			// Start
			tl.fromTo(containerRef.current, { xPercent: -110 }, { xPercent: 0, duration: 1 }, "-=0.5");
			tl.addLabel("startBarFilling", "+=0.1");

			const percentage = (props.goal.total / props.goal.goal) * 100;
			tl.fromTo(
				progressBarRef.current,
				{ width: 0 },
				{
					width: `${percentage}%`,
					duration: Math.max(1, percentage / 45 + 0.5),
				},
				"startBarFilling",
			);

			// End
			tl.to(containerRef.current, { xPercent: 110, duration: 1 }, "+=10");
			return tl;
		},
	}));

	let textOutside: React.CSSProperties = {};
	if (props.goal.total / props.goal.goal < 0.5) {
		textOutside = {
			marginRight: -80,
			color: "var(--text-light)",
		};
	}

	return (
		<div className={styles.goalBarContainer} ref={containerRef}>
			<div className={styles.bottomBar}>
				<div className={styles.goalDiv}>
					<FitText className={styles.incentiveName} text={`$${props.goal.goal}`} />
				</div>
				<div className={styles.progressContainer}>
					<div className={styles.progressBarContainer} ref={progressBarRef}>
						<span className={styles.currentAmount} style={textOutside}>
							${Math.floor(props.goal.total).toLocaleString()}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
