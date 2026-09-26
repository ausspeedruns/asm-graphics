import { useImperativeHandle, useRef } from "react";

import { TickerTitle } from "./title";

import type { Incentive } from "@asm-graphics/types/Incentives";
import type { TickerItemHandles } from "../ticker";
import { GoalBar } from "./goal";
import { WarGame } from "./war";
import styles from "./incentives.module.css";

const NUMBER_TO_SHOW = 5;

interface Props {
	incentives: Incentive[];
	ref: React.Ref<TickerItemHandles>;
}

export function TickerIncentives(props: Props) {
	const containerRef = useRef<HTMLDivElement>(null);
	const incentiveRefs = useRef<TickerItemHandles[]>([]);

	const incentivesToDisplay = props.incentives.filter((incentive) => incentive.active).slice(0, NUMBER_TO_SHOW);

	useImperativeHandle(props.ref, () => ({
		animation: (tl) => {
			if (incentivesToDisplay.length === 0) {
				return tl;
			}

			// Start
			tl.addLabel("goalStart");
			tl.set(containerRef.current, { y: -64 });
			tl.to(containerRef.current, { y: 0, duration: 1 });

			for (let i = 0; i < incentivesToDisplay.length; i++) {
				const ref = incentiveRefs.current[i];

				if (!ref) continue;
				tl.add(ref.animation(tl));
			}

			// End
			tl.to(containerRef.current, { y: 64, duration: 1 }, "-=1");

			return tl;
		},
	}));

	const incentiveElements = incentivesToDisplay.map((incentive, i) => {
		if (incentive.type === "Goal") {
			return (
				<GoalBar
					goal={incentive}
					ref={(el) => {
						incentiveRefs.current[i] = el as TickerItemHandles;
					}}
					key={incentive.id}
				/>
			);
		} else {
			return (
				<WarGame
					war={incentive}
					ref={(el) => {
						incentiveRefs.current[i] = el as TickerItemHandles;
					}}
					key={incentive.id}
				/>
			);
		}
	});

	return (
		<div className={styles.tickerIncentivesContainer} ref={containerRef}>
			<TickerTitle>Incentives</TickerTitle>
			<div className={styles.multiIncentiveContainer}>{incentiveElements}</div>
		</div>
	);
}
