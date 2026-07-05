import { memo, type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { FitText } from "../elements/fit-text";

import { WarGame } from "./incentives/incent-wars";
import { GoalBar } from "./incentives/incent-goal";
import { Prizes } from "./incentives/incent-prizes";
import { Socials } from "./incentives/incent-socials";
import { Photos } from "./incentives/incent-photos";
import { UpcomingRuns } from "./incentives/incent-upcoming-runs";
import { useIntermissionStore } from "../stores/intermission-store";

gsap.registerPlugin(useGSAP);

const InterIncentivesContainer = styled.div`
	overflow: hidden;
	position: relative;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	gap: 12px;

	padding: 10px;
`;

const PanelContainer = styled.div`
	/* height: 236px; */
	box-sizing: border-box;
	position: relative;
	flex-grow: 1;
`;

const PipsContainer = styled.div`
	display: flex;
	justify-content: space-between;
	gap: 16px;
	/* padding: 0 8px 32px 8px; */
	width: 90%;
	margin: auto;
`;

const Pip = styled.div<{ $active?: boolean }>`
	height: 5px;
	min-width: 10px;
	flex-grow: 1;
	background: transparent;
	border-radius: 5px;
	transition: 1s;
	background: #ddffd9;

	${(props) =>
		props.$active &&
		css`
			background: #cc3622;
		`}
`;

const CurrentLabels = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	height: 40px;
	font-size: 25px;
	gap: 4px;

	& * {
		text-box: trim-both cap alphabetic;
	}
`;

const MainLabel = styled(FitText)`
	font-size: 100%;
	max-width: 100%;
	font-family: var(--secondary-font);
	font-weight: bold;
`;

const Subheading = styled(FitText)`
	font-size: 100%;
	max-width: 100%;
`;

export interface TickerItemHandles {
	animation(timeline: gsap.core.Timeline): gsap.core.Timeline;
}

const MAX_INCENTIVES: number = 10; // Type is there because we sometimes set it to a number and then it would get upset at us since we test for -1 when it can't possibly be that.
const TEST_RANGE: number[] = [0];

export function IntermissionIncentives() {
	const incentives = useIntermissionStore((state) => state.incentives);
	const prizes = useIntermissionStore((state) => state.prizes);
	const allRuns = useIntermissionStore((state) => state.runArray);
	const currentRunId = useIntermissionStore((state) => state.activeRun?.id);
	const upcomingRuns = allRuns.slice(allRuns.findIndex((run) => run.id === currentRunId) + 1);
	const photos = useIntermissionStore((state) => state.photos);

	const containerRef = useRef<HTMLDivElement>(null);
	const labelsRef = useRef<HTMLDivElement>(null);
	const incentivesRef = useRef<TickerItemHandles[]>([]);
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
								if (el) {
									incentivesRef.current[i] = el;
								}
							}}
						/>
					);

				case "War":
					return (
						<WarGame
							key={incentive.index}
							war={incentive}
							ref={(el) => {
								if (el) {
									incentivesRef.current[i] = el;
								}
							}}
						/>
					);

				default:
					return <></>;
			}
		}),
	);

	allLabels.push(
		...incentives.map((incentive) => {
			return { header: incentive.game, subheading: incentive.incentive };
		}),
	);

	// Prizes
	if (prizes.length > 0) {
		allPanels.push(
			<Prizes
				key="ASMPrizes"
				ref={(el) => {
					if (el) {
						incentivesRef.current[10] = el;
					}
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
					el ? (incentivesRef.current[20] = el) : undefined;
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
					if (el) {
						incentivesRef.current[25] = el;
					}
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

	const runLoop = useCallback(() => {
		const localTl = gsap.timeline({ onComplete: runLoop });

		const usablePanels = incentivesRef.current.filter((item) => item !== undefined);
		usablePanels.forEach((incentiveEl, i) => {
			localTl.add(showContent(incentiveEl));

			localTl.to(labelsRef.current, { xPercent: 100, duration: 1 }, "-=0.5");
			localTl.add(() => {
				setCurrentPanel((i + 1) % usablePanels.length);
			});
			localTl.set(labelsRef.current, { xPercent: -100 });
			localTl.to(labelsRef.current, { xPercent: 0, duration: 1 });
		});

		localTl.play();
	}, []);

	useGSAP(() => {
		gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.6 });
	}, []);

	useEffect(() => {
		gsap.defaults({ ease: "power2.inOut" });
		const timer = setTimeout(runLoop, 500);
		return () => clearTimeout(timer);
	}, [runLoop]);

	return (
		<InterIncentivesContainer ref={containerRef}>
			<PanelContainer>{allPanels}</PanelContainer>
			<CurrentLabels ref={labelsRef}>
				<MainLabel text={allLabels[currentPanel]?.header} />
				{allLabels[currentPanel]?.subheading && <Subheading text={allLabels[currentPanel].subheading} />}
			</CurrentLabels>
			<PipsContainer>
				{allPanels.map((_, i) => {
					return <Pip key={i} $active={i == currentPanel} />;
				})}
			</PipsContainer>
		</InterIncentivesContainer>
	);
}
