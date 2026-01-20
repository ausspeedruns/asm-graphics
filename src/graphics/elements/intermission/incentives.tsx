import { memo, type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import type NodeCG from "nodecg/types";
import type { Incentive } from "@asm-graphics/types/Incentives";
import type { Prize } from "@asm-graphics/types/Prizes";

import { WarGame } from "./incent-wars";
import { GoalBar } from "./incent-goal";
import { FitText } from "../fit-text";
import { Prizes } from "./incent-prizes";
import { Socials } from "./incent-socials";
import { Photos } from "./incent-photos";
import { UpcomingRuns } from "./incent-upcoming-runs";
import type { RunData } from "@asm-graphics/types/RunData";

gsap.registerPlugin(useGSAP);

const InterIncentivesContainer = styled.div`
	overflow: hidden;
	position: relative;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
`;

const PanelContainer = styled.div`
	/* height: 236px; */
	box-sizing: border-box;
	position: relative;
	flex-grow: 1;
`;

const CurrentPanel = styled.div`
	/* height: 126px; */
	width: 100%;
	box-sizing: border-box;
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
	background: #dcb995;

	${(props) =>
		props.$active &&
		css`
			background: #f58d3a;
		`}
`;

const CurrentLabels = styled.div`
	display: flex;
	// flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 70px;
	gap: 4px;
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

interface IncentivesProps {
	incentives?: Incentive[];
	asmm?: number;
	prizes?: Prize[];
	photos?: NodeCG.AssetFile[];
	upcomingRuns?: RunData[];
}

const MAX_INCENTIVES: number = -1;
const TEST_RANGE: number[] = [];

export const InterIncentives = (props: IncentivesProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const labelsRef = useRef<HTMLDivElement>(null);
	const incentivesRef = useRef<TickerItemHandles[]>([]);
	const [currentPanel, setCurrentPanel] = useState(0);

	let allPanels: ReactNode[] = [];
	let allLabels: { header: string; subheading?: string }[] = [];

	let incentives: typeof props.incentives = [];
	if (props.incentives) {
		incentives = props.incentives
			.filter((incentive) => incentive.active)
			.filter((_, i) => {
				if (TEST_RANGE.length === 0) {
					return MAX_INCENTIVES === -1 || i < MAX_INCENTIVES;
				} else {
					return TEST_RANGE.includes(i);
				}
			});
	}

	allPanels.push(
		...incentives.map((incentive, i) => {
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

	// if (typeof props.asmm !== "undefined" || props.asmm == 0) {
	// 	allPanels.push(
	// 		<InterIncentASMM
	// 			key={"InterIncentASMM"}
	// 			ref={(el) => (el ? (incentivesRef.current[allPanels.length] = el) : undefined)}
	// 			totalKM={props.asmm}
	// 		/>,
	// 	);
	// }

	// Prizes
	if (props.prizes && props.prizes.length > 0) {
		allPanels.push(
			<Prizes
				key="ASMPrizes"
				ref={(el) => {
					if (el) {
						incentivesRef.current[10] = el;
					}
				}}
				prizes={props.prizes}
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
	// if (props.photos && props.photos.length > 5) {
	// 	allPanels.push(
	// 		<Photos
	// 			key="ASMPhotos"
	// 			ref={(el) => {
	// 				el ? (incentivesRef.current[20] = el) : undefined;
	// 			}}
	// 		/>,
	// 	);
	// 	allLabels.push({ header: "ASM 2025 Photos" });
	// }

	// Upcoming Runs
	if (props.upcomingRuns && props.upcomingRuns.length > 0) {
		allPanels.push(
			<UpcomingRuns
				upcomingRuns={props.upcomingRuns}
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
			<CurrentPanel>
				<CurrentLabels ref={labelsRef}>
					<MainLabel text={allLabels[currentPanel]?.header} />–
					{allLabels[currentPanel]?.subheading && <Subheading text={allLabels[currentPanel].subheading} />}
				</CurrentLabels>
				<PipsContainer>
					{allPanels.map((_, i) => {
						return <Pip key={i} $active={i == currentPanel} />;
					})}
				</PipsContainer>
			</CurrentPanel>
		</InterIncentivesContainer>
	);
};

export const InterIncentivesMemo = memo(InterIncentives);
