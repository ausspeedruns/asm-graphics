import React, { useImperativeHandle, useRef } from "react";
import styled from "styled-components";

import { Goal } from "@asm-graphics/types/Incentives";
import { TickerItemHandles } from "./incentives";

import { FitText } from "../fit-text";

interface Props {
	goals: Goal[];
}

const IncentGoalContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	text-transform: uppercase;
	color: var(--text-light);
	font-size: 37px;
	transform: translate(-1000px, 0);
	overflow: hidden;
`;

const MultiGoalContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	position: relative;
`;

interface Props {
	goals: Goal[];
}

export const InterIncentGoal = React.forwardRef<TickerItemHandles, Props>((props: Props, ref) => {
	const containerRef = useRef(null);
	const goalRefs = useRef<TickerItemHandles[]>([]);

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			if (props.goals.length === 0) {
				return tl;
			}

			// Start
			tl.addLabel("goalStart");
			tl.set(containerRef.current, { x: -1000 });
			tl.to(containerRef.current, { x: 0, duration: 1 });

			for (let i = 0; i < props.goals.length; i++) {
				tl.add(goalRefs.current[i].animation(tl));
			}

			// End
			tl.to(containerRef.current, { x: 1000, duration: 1 }, "-=1");
			for (let i = 0; i < props.goals.length; i++) {
				tl.add(goalRefs.current[i].reset(tl));
			}

			return tl;
		},
		reset(tl) {
			return tl;
		},
	}));

	if (props.goals.length === 0) {
		return <></>;
	}

	const allGoals = props.goals.map((goal, i) => {
		return (
			<GoalBar
				goal={goal}
				key={goal.index}
				ref={(el) => {
					if (el) {
						goalRefs.current[i] = el;
					}
				}}
			/>
		);
	});

	return (
		<IncentGoalContainer ref={containerRef}>
			<MultiGoalContainer>{allGoals}</MultiGoalContainer>
		</IncentGoalContainer>
	);
});

const GoalBarContainer = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	transform: translate(-1000px, 0);
	/* padding: 0 50px; */
	box-sizing: border-box;
`;

const GoalDiv = styled.div`
	display: flex;
	justify-content: center;
	align-items: flex-end;
	/* margin-left: 10px; */
	font-weight: bold;
	font-size: 37px;
	min-height: 130px;
`;

const IncentiveContainer = styled.div`
	// position: absolute;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	/* margin-top: -10px; */
	margin-bottom: 5px;
	font-size: 30px;
	width: 100%;
	height: 100px;
`;

const Game = styled(FitText)`
	/* display: inline-block; */
	max-width: 100%;
	margin-bottom: -5px;
`;

const IncentiveName = styled(FitText)`
	/* display: inline-block; */
	font-weight: bold;
	max-width: 100%;
	font-family: var(--secondary-font);
`;

const BottomBar = styled.div`
	display: flex;
	/* justify-content: space-between; */
	flex-direction: column;
	align-items: center;
	/* height: 50%; */
	width: 100%;
	box-sizing: border-box;
	flex-grow: 1;
	/* padding: 0 5%; */
`;

// Determines full size
const ProgressContainer = styled.div`
	flex-grow: 1;
	height: 100%;
	width: 100%;
	border: 1px solid var(--tgx-green);
	/* background: var(--main); */
	background: transparent;
	position: relative;
	overflow: hidden;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	/* align-items: flex-end; */
	justify-content: flex-end;
`;

const ProgressBarContainer = styled.div`
	width: 100%;
	background: var(--tgx-green);
	/* border-right: 5px solid var(--sec); */
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	position: absolute;
	left: 0;
`;

const CurrentAmount = styled.span`
	color: var(--text-light);
	font-size: 30px;
	font-weight: bold;
	margin-right: 16px;
`;

interface GoalProps {
	goal: Goal;
}

export const GoalBar = React.forwardRef<TickerItemHandles, GoalProps>((props: GoalProps, ref) => {
	const containerRef = useRef(null);
	const progressBarRef = useRef(null);

	const percentage = (props.goal.total / props.goal.goal) * 100;

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			// Start
			tl.set(progressBarRef.current, { height: 0 }, "goalStart");
			tl.set(containerRef.current, { x: -2000 }, "-=0.5");
			tl.to(containerRef.current, { x: 0, duration: 1 }, "-=0.5");

			tl.to(
				progressBarRef.current,
				{ height: `${percentage}%`, duration: Math.max(1, percentage / 45 + 0.5) },
				"+=0.1",
			);

			// End
			tl.to(containerRef.current, { x: 2000, duration: 1 }, "+=10");
			tl.set(containerRef.current, { x: -2000, duration: 1 });

			return tl;
		},
		reset: (tl) => {
			tl.set(progressBarRef.current, { height: 0 });
			tl.set(containerRef.current, { x: -2000 });

			return tl;
		},
	}));

	let textOnRightSide: React.CSSProperties = {};
	if (percentage < 50) {
		textOnRightSide = {
			marginTop: -46,
			color: "var(--text-light)",
		};
	}

	return (
		<GoalBarContainer ref={containerRef}>
			<BottomBar>
				<GoalDiv>
					<IncentiveName text={`$${props.goal.goal}`}></IncentiveName>
				</GoalDiv>
				<ProgressContainer>
					<ProgressBarContainer ref={progressBarRef}>
						<CurrentAmount style={textOnRightSide}>
							${Math.floor(props.goal.total).toLocaleString()}
						</CurrentAmount>
					</ProgressBarContainer>
				</ProgressContainer>
			</BottomBar>
			<IncentiveContainer>
				<Game text={props.goal.game} />
				<IncentiveName text={props.goal.incentive} />
			</IncentiveContainer>
		</GoalBarContainer>
	);
});

InterIncentGoal.displayName = "IncentGoal";
GoalBar.displayName = "GoalBar";
