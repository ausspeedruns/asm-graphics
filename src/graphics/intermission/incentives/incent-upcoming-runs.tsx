import { useImperativeHandle, useRef } from "react";

import type { TickerItemHandles } from "../incentives";
import { FitText, FitTextElements } from "@asm-graphics/shared-browser/fit-text";
import type { RunData } from "@asm-graphics/types/RunData";

import { format } from "date-fns";
import styles from "./incent-upcoming-runs.module.css";

const RUNS_LIMIT = 3;
const RUNS_PER_PAGE = 1;
const RUNS_SPEED = 2;
const RUNS_DURATION = 10;
const RUNS_PAGE_STAGGER = 0.05;

interface UpcomingRunsProps {
	upcomingRuns: RunData[];
	ref: React.Ref<TickerItemHandles>;
}

export function UpcomingRuns(props: UpcomingRunsProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const runsRefs = useRef<TickerItemHandles[]>([]);

	const groupedRuns: RunData[][] = [];
	for (let i = 0; i < RUNS_LIMIT; i += RUNS_PER_PAGE) {
		groupedRuns.push(props.upcomingRuns.slice(i, i + RUNS_PER_PAGE));
	}

	useImperativeHandle(props.ref, () => ({
		animation: (tl) => {
			tl.addLabel("runsStart");
			tl.fromTo(containerRef.current, { xPercent: -110 }, { xPercent: 0 });
			runsRefs.current.reverse().forEach((runRef) => {
				tl.add(runRef.animation(tl));
			});
			return tl;
		},
	}));

	return (
		<div className={styles.upcomingRunsContainer} ref={containerRef}>
			{groupedRuns.map((runs, i) => (
				<div className={styles.runsPage} key={i}>
					{runs.map((run, j) => (
						<Run
							run={run}
							index={i * RUNS_PER_PAGE + j}
							key={run.id}
							ref={(el) => {
								runsRefs.current[i * RUNS_PER_PAGE + j] = el!;
							}}
						/>
					))}
				</div>
			))}
		</div>
	);
}

const BORDER_RADIUS = 4;

interface RunProps {
	run: RunData;
	index: number;
	style?: React.CSSProperties;
	ref: React.Ref<TickerItemHandles>;
}

const RUN_STAGGER_INVERSE = 1 / RUNS_PAGE_STAGGER;

export function Run(props: RunProps) {
	const containerRef = useRef(null);

	const pageTimeOffset = Math.floor(props.index / RUNS_PER_PAGE) * (RUNS_DURATION + 1.5);

	useImperativeHandle(props.ref, () => ({
		animation: (tl) => {
			tl.fromTo(
				containerRef.current,
				{ xPercent: -110 },
				{ xPercent: 0, duration: RUNS_SPEED, ease: "power3.out" },
				`upcomingRuns+=${props.index / RUN_STAGGER_INVERSE + pageTimeOffset}`,
			);

			// console.log(`${props.run.game} | upcomingRuns+=${props.index / RUN_STAGGER_INVERSE + pageTimeOffset}`, props.index, RUN_STAGGER_INVERSE, pageTimeOffset)

			tl.to(
				containerRef.current,
				{ xPercent: 110, duration: RUNS_SPEED, ease: "power3.in" },
				`upcomingRuns+=${props.index / RUN_STAGGER_INVERSE + RUNS_DURATION + pageTimeOffset}`,
			);
			return tl;
		},
	}));

	return (
		<div className={styles.upcomingRunContainer} ref={containerRef} style={props.style}>
			<div className={styles.metaDataContainer}>
				<div className={styles.leftSideContainer}>
					<span className={styles.time}>{props.run.scheduled ? format(props.run.scheduled, "h:mm a") : "Soon"}</span>
					<FitText
						className={styles.runnerNames}
						text={props.run.teams.map((team) => team.players.map((player) => player.name)).join(", ")}
					/>
				</div>
			</div>
			<div className={styles.runInfoContainer}>
				<FitTextElements className={styles.gameName} text={<>{props.run.game}</>} />
				<FitTextElements className={styles.category} text={props.run.category} />
			</div>
		</div>
	);
}
