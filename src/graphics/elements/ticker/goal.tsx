import React, { useImperativeHandle, useRef } from 'react';
import styled from 'styled-components';

import { Goal } from '@asm-graphics/types/Incentives';
import { TickerItemHandles } from '../ticker';

import { TickerTitle } from './title';
import { FitText } from '../fit-text';

const TickerGoalsContainer = styled.div`
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
	font-size: 37px;
	transform: translate(0, -64px);
	overflow: hidden;
`;

const MultiGoalContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	position: relative;
`;

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
`;

const IncentiveName = styled(FitText)`
	font-size: 27px;
	font-weight: bold;
	max-width: 200px;
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
	border: 1px solid #FFFFFF;
	position: relative;
	overflow: hidden;
`;

const ProgressBarContainer = styled.div`
	height: 100%;
	background: #FFFFFF;
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
`;

interface Props {
	goals: Goal[];
}

export const TickerGoals = React.forwardRef<TickerItemHandles, Props>((props: Props, ref) => {
	const containerRef = useRef(null);
	const goalRefs = useRef<TickerItemHandles[]>([]);

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			if (props.goals.length === 0) {
				return tl;
			}

			// Start
			tl.addLabel('goalStart');
			tl.set(containerRef.current, { y: -64 });
			tl.to(containerRef.current, { y: 0, duration: 1 });

			for (let i = 0; i < props.goals.length; i++) {
				tl.add(goalRefs.current[i].animation(tl));
			}

			// End
			tl.to(containerRef.current, { y: 64, duration: 1 }, '-=1');

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
		<TickerGoalsContainer ref={containerRef}>
			<TickerTitle style={{background: 'var(--tgx-yellow)', color: 'var(--text-light)'}}>
				Challenge
				<br />
				Goals
			</TickerTitle>
			<MultiGoalContainer>{allGoals}</MultiGoalContainer>
		</TickerGoalsContainer>
	);
});

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
	index: number;
}

const GoalBar = React.forwardRef<TickerItemHandles, GoalProps>((props: GoalProps, ref) => {
	const containerRef = useRef(null);
	const progressBarRef = useRef(null);

	const percentage = (props.goal.total / props.goal.goal) * 100;

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			// Start
			tl.set(progressBarRef.current, { width: 0 }, 'goalStart');
			tl.set(containerRef.current, { y: -64 }, '-=0.5');
			tl.to(containerRef.current, { y: 0, duration: 1 }, '-=0.5');

			tl.to(progressBarRef.current, { width: `${percentage}%`, duration: Math.max(1, percentage / 45 + 0.5) }, '+=0.1');

			// End
			tl.to(containerRef.current, { y: 64, duration: 1 }, '+=10');
			tl.set(containerRef.current, { y: -64, duration: 1 });

			return tl;
		},
	}));

	let textOnRightSide: React.CSSProperties = {};
	if (percentage < 50) {
		textOnRightSide = {
			marginRight: -110,
			color: 'var(--text-light)',
			textAlign: 'left',
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
});

TickerGoals.displayName = 'TickerGoals';
GoalBar.displayName = 'GoalBar';
