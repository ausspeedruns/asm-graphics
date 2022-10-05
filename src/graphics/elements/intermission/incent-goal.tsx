import React, { useImperativeHandle, useRef } from 'react';
import styled from 'styled-components';

import { Goal } from '../../../types/Incentives';
import { TickerItemHandles } from './incentives';

import { FitText } from '../fit-text';

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
			tl.addLabel('goalStart');
			tl.set(containerRef.current, { x: -1000 });
			tl.to(containerRef.current, { x: 0, duration: 1 });

			for (let i = 0; i < props.goals.length; i++) {
				tl.add(goalRefs.current[i].animation(tl));
			}

			// End
			tl.to(containerRef.current, { x: 1000, duration: 1 }, '-=1');

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
`;

const GoalDiv = styled.div`
	display: flex;
	justify-content: center;
	margin: 0 10px;
	font-weight: bold;
	font-size: 37px;
`;

const IncentiveContainer = styled.div`
	// position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: -10px;
	margin-bottom: 10px;
	flex-direction: row;
	gap: 20px;
	font-size: 30px;
`;

const Game = styled(FitText)`
	/* display: inline-block; */
	max-width: 400px;
`;

const IncentiveName = styled(FitText)`
	/* display: inline-block; */
	font-weight: bold;
	max-width: 400px;
	font-family: Orbitron;
`;

const BottomBar = styled.div`
	display: flex;
	/* justify-content: space-between; */
	align-items: center;
	height: 50%;
	width: 100%;
	box-sizing: border-box;
	padding: 0 5%;
`;

// Determines full size
const ProgressContainer = styled.div`
	flex-grow: 1;
	height: 100%;
	width: 100%;
	border: 1px solid var(--sec);
	position: relative;
	overflow: hidden;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: flex-end;
`;

const ProgressBarContainer = styled.div`
	height: 100%;
	background: var(--sec);
	/* background: linear-gradient(180deg, #F2DAB2 0%, #E8E8E8 100%); */
	/* border-right: 5px solid var(--sec); */
	display: flex;
	justify-content: flex-end;
	align-items: center;
	position: absolute;
	left: 0;
`;

const CurrentAmount = styled.span`
	color: var(--text-dark);
	font-size: 30px;
	font-weight: bold;
	margin-right: 16px;
`;

const RemainingAmount = styled.span`
	color: var(--text-light);
	font-weight: lighter;
	font-size: 25px;
	font-style: italic;
	margin-right: 8px;
	text-align: center;
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
			tl.set(progressBarRef.current, { width: 0 }, 'goalStart');
			tl.set(containerRef.current, { x: -1000 }, '-=0.5');
			tl.to(containerRef.current, { x: 0, duration: 1 }, '-=0.5');

			tl.to(
				progressBarRef.current,
				{ width: `${percentage}%`, duration: Math.max(1, percentage / 45 + 0.5) },
				'+=0.1',
			);

			// End
			tl.to(containerRef.current, { x: 1000, duration: 1 }, '+=10');
			tl.set(containerRef.current, { x: -1000, duration: 1 });

			return tl;
		},
	}));

	let textOnRightSide: React.CSSProperties = {};
	if (percentage < 50) {
		textOnRightSide = {
			marginTop: -46,
			color: 'var(--text-light)',
		};
	}

	return (
		<GoalBarContainer ref={containerRef}>
			<IncentiveContainer>
				<Game text={props.goal.game} />
				<IncentiveName text={props.goal.incentive} />
			</IncentiveContainer>
			<BottomBar>
				<ProgressContainer>
					<ProgressBarContainer ref={progressBarRef}>
						<CurrentAmount style={textOnRightSide}>
							${Math.floor(props.goal.total).toLocaleString()}
						</CurrentAmount>
					</ProgressBarContainer>
					<RemainingAmount style={{ display: percentage > 88 ? 'none' : undefined }}>
						${Math.ceil(props.goal.goal - props.goal.total).toLocaleString()}
						<br />
						to go!
					</RemainingAmount>
				</ProgressContainer>
				<GoalDiv>
					<IncentiveName text={`$${props.goal.goal}`}></IncentiveName>
				</GoalDiv>
			</BottomBar>
		</GoalBarContainer>
	);
});

InterIncentGoal.displayName = 'IncentGoal';
GoalBar.displayName = 'GoalBar';
