import { useImperativeHandle, useRef } from "react";
import styled from "styled-components";

import { Goal } from "@asm-graphics/types/Incentives";
import { TickerItemHandles } from "../ticker";

import { FitText } from "../fit-text";

const GoalElement = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	margin-right: 16px;
`;

const Game = styled(FitText)`
	font-size: 20px;
	margin-bottom: -10px;
	max-width: 200px;
	font-family: var(--main-font);
`;

const IncentiveName = styled(FitText)`
	font-size: 27px;
	font-weight: bold;
	max-width: 200px;
	/* font-family: var(--secondary-font); */
`;

const IncentiveContainer = styled(GoalElement)`
	// position: absolute;
	height: 100%;
	display: flex;
	align-items: center;
	margin: 0 4px 0 8px;
`;

// Determines full size
const ProgressContainer = styled.div`
	flex-grow: 1;
	height: 54px;
	margin: 0 16px 0 5px;
	border: 1px solid #ffffff;
	position: relative;
	overflow: hidden;
`;

const ProgressBarContainer = styled.div`
	height: 100%;
	background: #ffffff;
	border-right: 5px solid var(--sec);
	display: flex;
	align-items: center;
	justify-content: flex-end;
`;

const CurrentAmount = styled.span`
	color: var(--text-dark);
	margin-right: 5px;
	font-weight: normal;
	width: 100px;
	text-align: right;
	font-size: 25px;
	font-family: var(--secondary-font);
`;

const GoalBarContainer = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	transform: translate(0, -64px);
`;

interface GoalProps {
	goal: Goal;
	index?: number;
	ref: React.Ref<TickerItemHandles>;
}

export const GoalBar = (props: GoalProps) => {
	const containerRef = useRef(null);
	const progressBarRef = useRef(null);

	const percentage = (props.goal.total / props.goal.goal) * 100;

	useImperativeHandle(props.ref, () => ({
		animation: (tl) => {
			// Start
			tl.set(progressBarRef.current, { width: 0 }, "goalStart");
			tl.set(containerRef.current, { y: -64 }, "-=0.5");
			tl.to(containerRef.current, { y: 0, duration: 1 }, "-=0.5");

			tl.to(
				progressBarRef.current,
				{ width: `${percentage}%`, duration: Math.max(1, percentage / 45 + 0.5) },
				"+=0.1",
			);

			// End
			tl.to(containerRef.current, { y: 64, duration: 1 }, "+=10");
			tl.set(containerRef.current, { y: -64, duration: 1 });

			return tl;
		},
	}));

	let textOnRightSide: React.CSSProperties = {};
	if (percentage < 50) {
		textOnRightSide = {
			marginRight: -110,
			color: "var(--text-light)",
			textAlign: "left",
		};
	}

	return (
		<GoalBarContainer ref={containerRef}>
			<IncentiveContainer>
				<Game text={props.goal.game} />
				<IncentiveName text={props.goal.incentive} />
			</IncentiveContainer>
			<ProgressContainer>
				<ProgressBarContainer ref={progressBarRef}>
					<CurrentAmount style={textOnRightSide}>
						${Math.floor(props.goal.total).toLocaleString()}
					</CurrentAmount>
				</ProgressBarContainer>
			</ProgressContainer>
			<GoalElement>
				<IncentiveName text={`$${props.goal.goal}`}></IncentiveName>
			</GoalElement>
		</GoalBarContainer>
	);
};
