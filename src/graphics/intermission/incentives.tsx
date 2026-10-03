import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { FitText } from "@asm-graphics/shared-browser/fit-text";

import { WarGame } from "./incentives/incent-wars";
import { GoalBar } from "./incentives/incent-goal";
import { Prizes } from "./incentives/incent-prizes";
import { Photos } from "./incentives/incent-photos";
import { UpcomingRuns } from "./incentives/incent-upcoming-runs";
import { useIntermissionStore } from "../stores/intermission-store";
import styles from "./incentives.module.css";

gsap.registerPlugin(useGSAP);

export interface TickerItemHandles {
	animation(timeline: gsap.core.Timeline): gsap.core.Timeline;
}

const MAX_INCENTIVES: number = 10; // Type is there because we sometimes set it to a number and then it would get upset at us since we test for -1 when it can't possibly be that.
const TEST_RANGE: number[] = [];

export function IntermissionIncentives() {
	const incentives = useIntermissionStore((state) => state.incentives);
	const prizes = useIntermissionStore((state) => state.prizes);
	const allRuns = useIntermissionStore((state) => state.runArray);
	const currentRunId = useIntermissionStore((state) => state.activeRun?.id);
	const upcomingRuns = allRuns.slice(allRuns.findIndex((run) => run.id === currentRunId) + 1);
	const photos = useIntermissionStore((state) => state.photos);

	const containerRef = useRef<HTMLDivElement>(null);
	const labelsRef = useRef<HTMLDivElement>(null);
	const incentivesRef = useRef<Array<TickerItemHandles | null>>([]);
	const timelineRef = useRef<gsap.core.Timeline | null>(null);
	const startupTimeoutRef = useRef<number | null>(null);
	const [currentPanel, setCurrentPanel] = useState(0);

	const allPanels: ReactNode[] = [];
	const allLabels: { header: string; subheading?: string }[] = [];

	const incentivesToShow = incentives
		.filter((incentive) => incentive.active)
		.filter((_, i) => {
			if (TEST_RANGE.length === 0) {
				return MAX_INCENTIVES === -1 || i < MAX_INCENTIVES;
			} else {
				return TEST_RANGE.includes(i);
			}
		});

	allPanels.push(
		...incentivesToShow.map((incentive, i) => {
			switch (incentive.type) {
				case "Goal":
					return (
						<GoalBar
							key={incentive.index}
							goal={incentive}
							ref={(el) => {
								incentivesRef.current[i] = el;
							}}
						/>
					);

				case "War":
					return (
						<WarGame
							key={incentive.index}
							war={incentive}
							ref={(el) => {
								incentivesRef.current[i] = el;
							}}
						/>
					);

				default:
					return <></>;
			}
		}),
	);

	allLabels.push(
		...incentivesToShow.map((incentive) => {
			return { header: incentive.game, subheading: incentive.incentive };
		}),
	);

	// Prizes
	if (prizes.length > 0) {
		allPanels.push(
			<Prizes
				key="ASMPrizes"
				ref={(el) => {
					incentivesRef.current[10] = el;
				}}
				prizes={prizes}
			/>,
		);

		allLabels.push({ header: "Prizes" });
	}

	// Socials TODO: Redo
	// allPanels.push(
	// 	<Socials
	// 		key="ASMSocials"
	// 		ref={(el) => {
	// 			if (el) {
	// 				incentivesRef.current[15] = el;
	// 			}
	// 		}}
	// 	/>,
	// );
	// allLabels.push({ header: "Our Socials", subheading: "Follow us to stay up to date!" });

	// Event Photos
	if (photos && photos.length > 5) {
		allPanels.push(
			<Photos
				key="ASMPhotos"
				ref={(el) => {
					incentivesRef.current[20] = el;
				}}
			/>,
		);
		allLabels.push({ header: "ASM 2025 Photos" });
	}

	// Upcoming Runs
	if (upcomingRuns && upcomingRuns.length > 0) {
		allPanels.push(
			<UpcomingRuns
				upcomingRuns={upcomingRuns}
				key="ASMRuns"
				ref={(el) => {
					incentivesRef.current[25] = el;
				}}
			/>,
		);
		allLabels.push({ header: "Upcoming Runs", subheading: "AusSpeedruns.com/Schedule" });
	}

	const showContent = (element: TickerItemHandles) => {
		const tl = gsap.timeline();
		element.animation(tl);
		return tl;
	};

	const stopLoop = useCallback(() => {
		if (startupTimeoutRef.current !== null) {
			window.clearTimeout(startupTimeoutRef.current);
			startupTimeoutRef.current = null;
		}

		timelineRef.current?.kill();
		timelineRef.current = null;
	}, []);

	const runLoop = useCallback(() => {
		stopLoop();

		const usablePanels = incentivesRef.current.filter((item): item is TickerItemHandles => item !== null);

		if (usablePanels.length === 0 || !labelsRef.current) {
			return;
		}

		const localTl = gsap.timeline({
			onComplete: () => {
				timelineRef.current = null;
				runLoop();
			},
		});
		timelineRef.current = localTl;

		usablePanels.forEach((incentiveEl, i) => {
			localTl.add(showContent(incentiveEl));

			localTl.to(labelsRef.current, { xPercent: 100, duration: 1 }, "-=0.5");
			localTl.add(() => {
				setCurrentPanel((i + 1) % usablePanels.length);
			});
			localTl.set(labelsRef.current, { xPercent: -110 });
			localTl.to(labelsRef.current, { xPercent: 0, duration: 1 });
		});

	}, [stopLoop]);

	useGSAP(() => {
		gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.6 });
	}, []);

	useEffect(() => {
		gsap.defaults({ ease: "power2.inOut" });
		setCurrentPanel((panel) => {
			if (allLabels.length === 0) {
				return 0;
			}

			return panel % allLabels.length;
		});

		startupTimeoutRef.current = window.setTimeout(runLoop, 500);

		return stopLoop;
	}, [allLabels.length, runLoop, stopLoop]);

	return (
		<div className={styles.interIncentivesContainer} ref={containerRef}>
			<div className={styles.panelContainer}>{allPanels}</div>
			<div className={styles.currentLabels} ref={labelsRef}>
				<FitText className={styles.mainLabel} text={allLabels[currentPanel]?.header} />
				{allLabels[currentPanel]?.subheading && (
					<FitText className={styles.subheading} text={allLabels[currentPanel].subheading} />
				)}
			</div>
			<div className={styles.pipsContainer}>
				{allPanels.map((_, i) => {
					return <div className={clsx(styles.pip, i === currentPanel && styles.active)} key={i} />;
				})}
			</div>
		</div>
	);
}
