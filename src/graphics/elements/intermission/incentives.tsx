import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { Goal, War } from "@asm-graphics/types/Incentives";

import { WarGame } from "./incent-wars";
import { GoalBar } from "./incent-goal";
// import { InterIncentASMM } from "./incent-asmm";
import { FitText } from "../fit-text";
import { Prize, Prizes } from "./incent-prizes";
import { Socials } from "./incent-socials";
import { Photos } from "./incent-photos";

gsap.registerPlugin(useGSAP);

const InterIncentivesContainer = styled.div`
	overflow: hidden;
	position: relative;
	width: 100%;
	height: 100%;
`;

const PanelContainer = styled.div`
	height: 406px;
	padding: 16px;
	box-sizing: border-box;
	position: relative;
`;

const CurrentPanel = styled.div`
	position: absolute;
	height: 126px;
	width: 554px;
	bottom: 0;
	right: 0;
	padding: 8px 16px 0px 8px;
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
`;

const MainLabel = styled(FitText)`
	font-size: 45px;
	height: 55px;
	max-width: 500px;
`;

const Subheading = styled(FitText)`
	font-size: 35px;
	height: 35px;
	max-width: 500px;
	font-family: var(--secondary-font);
`;

export interface TickerItemHandles {
	animation(timeline: gsap.core.Timeline): gsap.core.Timeline;
}

interface IncentivesProps {
	incentives?: (Goal | War)[];
	asmm?: number;
	prizes: Prize[];
}

const MAX_INCENTIVES: number = -1;
const TEST_RANGE: number[] = [];

export const InterIncentives = (props: IncentivesProps) => {
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

	// allPanels = incentives.map((incentive, i) => {
	// 	switch (incentive.type) {
	// 		case "Goal":
	// 			return (
	// 				<GoalBar
	// 					key={incentive.index}
	// 					goal={incentive}
	// 					ref={(el) => (el ? (incentivesRef.current[i] = el) : undefined)}
	// 				/>
	// 			);

	// 		case "War":
	// 			return (
	// 				<WarGame
	// 					key={incentive.index}
	// 					war={incentive}
	// 					ref={(el) => (el ? (incentivesRef.current[i] = el) : undefined)}
	// 				/>
	// 			);

	// 		default:
	// 			return <></>;
	// 	}
	// });

	// allLabels = incentives.map((incentive) => {
	// 	return { header: incentive.game, subheading: incentive.incentive };
	// });

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
	if (props.prizes.length > 0) {
		allPanels.push(
			<Prizes
				key="ASMPrizes"
				ref={(el) => (el ? (incentivesRef.current[allPanels.length] = el) : undefined)}
				prizes={props.prizes}
			/>,
		);

		allLabels.push({ header: "Prizes", subheading: "AUS Only" });
	}

	// Upcoming runs

	// Socials
	allPanels.push(
		<Socials
			key="ASMSocials"
			ref={(el) => (el ? (incentivesRef.current[allPanels.length] = el) : undefined)}
		/>,
	);

	allLabels.push({ header: "Our Socials", subheading: "Follow us to stay up to date!" });

	// Event Photos
	console.log(allPanels.length);
	allPanels.push(
		<Photos key="ASMPhotos" ref={(el) => (el ? (incentivesRef.current[allPanels.length] = el) : undefined)} />,
	);

	allLabels.push({ header: "ASDH 2024 Photos" });

	const showContent = (element: TickerItemHandles) => {
		const tl = gsap.timeline();
		element.animation(tl);
		return tl;
	};

	const runLoop = useCallback(() => {
		const localTl = gsap.timeline({ onComplete: runLoop });

		console.log(incentivesRef.current);
		incentivesRef.current.forEach((incentiveEl, i) => {
			localTl.add(showContent(incentiveEl));

			if (incentivesRef.current.filter((item) => item !== undefined).length > 1) {
				localTl.to(labelsRef.current, { xPercent: 100, duration: 1 }, "-=0.5");
				localTl.add(() => {
					setCurrentPanel((i + 1) % incentivesRef.current.length);
				});
				localTl.set(labelsRef.current, { xPercent: -100 });
				localTl.to(labelsRef.current, { xPercent: 0, duration: 1 });
			}
		});

		localTl.play();
	}, []);

	useEffect(() => {
		gsap.defaults({ ease: "power2.inOut" });
		const timer = setTimeout(runLoop, 1000);
		return () => clearTimeout(timer);
	}, [runLoop]);

	return (
		<InterIncentivesContainer>
			<PanelContainer>{allPanels}</PanelContainer>
			<CurrentPanel>
				<PipsContainer>
					{allPanels.map((_, i) => {
						return <Pip $active={i == currentPanel} />;
					})}
				</PipsContainer>
				<CurrentLabels ref={labelsRef}>
					<MainLabel text={allLabels[currentPanel].header} />
					{allLabels[currentPanel].subheading && <Subheading text={allLabels[currentPanel].subheading} />}
				</CurrentLabels>
			</CurrentPanel>
		</InterIncentivesContainer>
	);
};

export const InterIncentivesMemo = memo(InterIncentives);
