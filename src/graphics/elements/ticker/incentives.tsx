import { useImperativeHandle, useRef } from "react";
import styled from "styled-components";

import { TickerTitle } from "./title";

import type { Incentive } from "@asm-graphics/types/Incentives";
import type { TickerItemHandles } from "../ticker";
import { GoalBar } from "./goal";
import { WarGame } from "./war";

const TickerIncentivesContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	height: 64px;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	text-transform: uppercase;
	color: var(--text-light);
	font-size: 30px;
	transform: translate(0, -64px);
	overflow: hidden;
	z-index: 2;
	font-family: var(--secondary-font);
`;

const MultiIncentiveContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	position: relative;
`;

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
				tl.add(incentiveRefs.current[i].animation(tl));
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
		<TickerIncentivesContainer ref={containerRef}>
			<TickerTitle>Incentives</TickerTitle>
			<MultiIncentiveContainer>{incentiveElements}</MultiIncentiveContainer>
		</TickerIncentivesContainer>
	);
}
