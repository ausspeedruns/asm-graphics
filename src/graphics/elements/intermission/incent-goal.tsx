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
	color: #F2DAB2;
	font-size: 37px;
	transform: translate(-630px, 0);
	overflow: hidden;
`;

const MultiGoalContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	position: relative;
`;

const GoalDiv = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin-top: -10px;
	width: 100%;
`;

const Game = styled(FitText)`
	font-size: 25px;
	margin-bottom: -10px;
	max-width: 90%;
`;

const IncentiveName = styled(FitText)`
	font-size: 28px;
	font-weight: bold;
	max-width: 90%;
`;

const IncentiveContainer = styled(GoalDiv)`
	// position: absolute;
	display: flex;
	align-items: center;
	margin: 0 4px 0 8px;
`;

// Determines full size
const ProgressContainer = styled.div`
	flex-grow: 1;
	height: 100%;
	width: 100%;
	border: 1px solid #F2DAB2;
	position: relative;
	overflow: hidden;
	box-sizing: border-box;
	display: flex;
	justify-content: center;
`;

const ProgressBarContainer = styled.div`
	width: 100%;
	background: linear-gradient(180deg, #F2DAB2 0%, #E8E8E8 100%);
	/* background: linear-gradient(180deg, #F2DAB2 0%, #E8E8E8 100%); */
	border-top: 5px solid var(--pax-gold);
	display: flex;
	align-items: flex-start;
	justify-content: center;
	position: absolute;
	bottom: 0;
`;

const CurrentAmount = styled.span`
	color: #251803;
	font-size: 30px;
	font-weight: bold;
`;

const RemainingAmount = styled.span`
	color: #F2DAB2;
	font-weight: lighter;
	font-size: 25px;
	font-style: italic;
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
			tl.set(containerRef.current, { x: -630 });
			tl.to(containerRef.current, { x: 0, duration: 1 });

			for (let i = 0; i < props.goals.length; i++) {
				tl.add(goalRefs.current[i].animation(tl));
			}

			// End
			tl.to(containerRef.current, { x: 630, duration: 1 }, '-=1');

			return tl;
		},
	}));

	if (props.goals.length === 0) {
		return <></>;
	}

	const allGoals = props.goals.map((goal, i) => {
		return (
			<GoalBar
				index={goal.index}
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
	justify-content: space-between;
	transform: translate(-630px, 0);
`;

interface GoalProps {
	goal: Goal;
	index: number;
}

const GoalBar = React.forwardRef<TickerItemHandles, GoalProps>((props: GoalProps, ref) => {
	const containerRef = useRef(null);
	const progressBarRef = useRef(null);

	const percentage = (props.goal.total / props.goal.goal) * 100;

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			// Start
			tl.set(progressBarRef.current, { height: 0 }, 'goalStart');
			tl.set(containerRef.current, { x: -630 }, '-=0.5');
			tl.to(containerRef.current, { x: 0, duration: 1 }, '-=0.5');

			tl.to(
				progressBarRef.current,
				{ height: `${percentage}%`, duration: Math.max(1, percentage / 45 + 0.5) },
				'+=0.1',
			);

			// End
			tl.to(containerRef.current, { x: 630, duration: 1 }, '+=10');
			tl.set(containerRef.current, { x: -630, duration: 1 });

			return tl;
		},
	}));

	let textOnRightSide: React.CSSProperties = {};
	if (percentage < 50) {
		textOnRightSide = {
			marginTop: -46,
			color: '#F2DAB2',
		};
	}

	return (
		<GoalBarContainer ref={containerRef}>
			<IncentiveContainer>
				<Game text={props.goal.game} />
				<IncentiveName text={props.goal.incentive} />
			</IncentiveContainer>
			<GoalDiv>
				<IncentiveName style={{ fontWeight: 'normal' }} text={`$${props.goal.goal}`}></IncentiveName>
			</GoalDiv>
			<ProgressContainer>
				<ProgressBarContainer ref={progressBarRef}>
					<CurrentAmount style={textOnRightSide}>
						${Math.floor(props.goal.total).toLocaleString()}
					</CurrentAmount>
				</ProgressBarContainer>
				<RemainingAmount style={{ display: percentage > 94 ? 'none' : '' }}>
					${Math.ceil(props.goal.goal - props.goal.total).toLocaleString()} to go!
				</RemainingAmount>
			</ProgressContainer>
		</GoalBarContainer>
	);
});

InterIncentGoal.displayName = 'IncentGoal';
GoalBar.displayName = 'GoalBar';
