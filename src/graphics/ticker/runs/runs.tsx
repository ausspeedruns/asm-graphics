import { Fragment, useImperativeHandle, useRef } from "react";
import { clone } from "underscore";

import { TickerTitle } from "../title.js";

import type { TickerItemHandles } from "../../ticker.js";
import type { RunDataArray, RunDataActiveRun, RunData } from "@asm-graphics/types/RunData.js";
import { Run } from "./run.js";
import styles from "./runs.module.css";

interface Props {
	runArray: RunDataArray;
	currentRun: RunDataActiveRun;
	ref: React.Ref<TickerItemHandles>;
}

const numOfUpcomingRuns = 3;

// TODO: Show as many runs as fit in the space instead of a fixed number
export function TickerRuns(props: Props) {
	const containerRef = useRef(null);
	const currentRunIndex = props.runArray.findIndex((run) => run.id === props.currentRun?.id);
	const upcomingRuns = clone(props.runArray)
		.slice(currentRunIndex + 1)
		.slice(0, numOfUpcomingRuns);

	const runsArray = upcomingRuns.map((run, i) => {
		return (
			<Fragment key={run.id}>
				<Run run={run} key={run.id} />
				{i < upcomingRuns.length - 1 && <div className={styles.borderItem} />}
			</Fragment>
		);
	});

	useImperativeHandle(props.ref, () => ({
		animation: (tl) => {
			// Start
			tl.fromTo(containerRef.current, { y: -64 }, { y: 0, duration: 1 });

			// End
			tl.to(containerRef.current, { y: 64, duration: 1 }, "+=10");
			tl.set(containerRef.current, { y: -64, duration: 1 });

			return tl;
		},
	}));

	console.log(runsArray);

	return (
		<div className={styles.tickerRunsContainer} ref={containerRef}>
			<TickerTitle>Coming Up</TickerTitle>
			{runsArray}
		</div>
	);
}
