import { memo, useCallback, useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import type { Goal, War } from "@asm-graphics/types/Incentives";
import type NodeCG from "@nodecg/types";

import { WarGame } from "./incent-wars";
import { GoalBar } from "./incent-goal";
// import { InterIncentASMM } from "./incent-asmm";
import { FitText } from "../fit-text";
import { Prize, Prizes } from "./incent-prizes";
import { Socials } from "./incent-socials";
import { Photos } from "./incent-photos";
import { UpcomingRuns } from "./incent-upcoming-runs";
import { RunData } from "@asm-graphics/types/RunData";

gsap.registerPlugin(useGSAP);

const InterIncentivesContainer = styled.div`
	overflow: hidden;
	position: relative;
	width: 100%;
	height: 100%;

	display: flex;
	flex-direction: column;
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
	padding-top: 0;
	box-sizing: border-box;
`;

const PipsContainer = styled.div`
	display: flex;
	justify-content: space-between;
	gap: 16px;
`;

const Pip = styled.div<{ $active?: boolean }>`
	height: 10px;
	min-width: 10px;
	flex-grow: 1;
	background: #ffffff4c;
	border-radius: 5px;
	transition: 2s;

	${(props) =>
		props.$active &&
		css`
			background: #fff;
		`}
`;

const CurrentLabels = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 90px;
	margin-bottom: 16px;
`;

const MainLabel = styled(FitText)`
	font-size: 45px;
	height: 55px;
	max-width: 100%;
	margin-bottom: -10px;
	font-family: var(--secondary-font);
`;

const Subheading = styled(FitText)`
	font-size: 35px;
	height: 35px;
	max-width: 100%;
`;

export interface TickerItemHandles {
	animation(timeline: gsap.core.Timeline): gsap.core.Timeline;
}

interface IncentivesProps {
	incentives?: (Goal | War)[];
	asmm?: number;
	prizes?: Prize[];
	photos?: NodeCG.AssetFile[];
	upcomingRuns?: RunData[];
}

const MAX_INCENTIVES: number = 10;
const TEST_RANGE: number[] = [];

export const InterIncentives = (props: IncentivesProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const labelsRef = useRef<HTMLDivElement>(null);
	const incentivesRef = useRef<TickerItemHandles[]>([]);
	const [currentPanel, setCurrentPanel] = useState(0);

	let allPanels: JSX.Element[] = [];
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

	allPanels = incentives.map((incentive, i) => {
		switch (incentive.type) {
			case "Goal":
				return (
					<GoalBar
						key={incentive.index}
						goal={incentive}
						ref={(el) => (el ? (incentivesRef.current[i] = el) : undefined)}
					/>
				);

			case "War":
				return (
					<WarGame
						key={incentive.index}
						war={incentive}
						ref={(el) => (el ? (incentivesRef.current[i] = el) : undefined)}
					/>
				);

			default:
				return <></>;
		}
	});

	allLabels = incentives.map((incentive) => {
		return { header: incentive.game, subheading: incentive.incentive };
	});

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
				ref={(el) => (el ? (incentivesRef.current[10] = el) : undefined)}
				prizes={props.prizes}
			/>,
		);

		allLabels.push({ header: "Prizes", subheading: "AUS Only" });
	}

	// Socials
	allPanels.push(<Socials key="ASMSocials" ref={(el) => (el ? (incentivesRef.current[15] = el) : undefined)} />);
	allLabels.push({ header: "Our Socials", subheading: "Follow us to stay up to date!" });

	// Event Photos
	if (props.photos && props.photos.length > 5) {
		allPanels.push(<Photos key="ASMPhotos" ref={(el) => (el ? (incentivesRef.current[20] = el) : undefined)} />);
		allLabels.push({ header: "ASM 2024 Photos" });
	}

	// Upcoming Runs
	if (props.upcomingRuns && props.upcomingRuns.length > 0) {
		allPanels.push(
			<UpcomingRuns
				upcomingRuns={props.upcomingRuns}
				key="ASMRuns"
				ref={(el) => (el ? (incentivesRef.current[25] = el) : undefined)}
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
					<MainLabel text={allLabels[currentPanel]?.header} />
					{allLabels[currentPanel]?.subheading && <Subheading text={allLabels[currentPanel].subheading} />}
				</CurrentLabels>
				<PipsContainer>
					{allPanels.map((_, i) => {
						return <Pip $active={i == currentPanel} />;
					})}
				</PipsContainer>
			</CurrentPanel>
		</InterIncentivesContainer>
	);
};

export const InterIncentivesMemo = memo(InterIncentives);
