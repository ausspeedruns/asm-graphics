import React, { useImperativeHandle, useRef, useState } from 'react';
import styled from 'styled-components';

import { War } from '../../../types/Incentives';
import { TickerItemHandles } from './incentives';
import { FitText } from '../fit-text';

const InterIncentWarsContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	text-transform: uppercase;
	color: #ffffff;
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

const Goal = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const Game = styled(FitText)`
	font-size: 25px;
	margin-bottom: -10px;
	max-width: 90%;
`;

const IncentiveName = styled(FitText)`
	font-size: 28px;
	font-weight: bold;
	max-width: 600px;
`;

const IncentiveContainer = styled(Goal)`
	// position: absolute;
	display: flex;
	align-items: center;
	margin: 0 4px 0 8px;
	width: 100%;
`;

// Determines full size
const ProgressContainer = styled.div`
	/* flex-grow: 1; */
	width: 100%;
	min-height: 40px;
	height: 40px;
	border: 1px solid white;
	position: relative;
	overflow: hidden;
	box-sizing: border-box;
	transform: translate(-630px, 0);
	margin: 8px 0;
`;

const ProgressBarContainer = styled.div`
	height: 100%;
	width: 0px;
	background: #FFFFFF;
	border-right: 2px solid var(--main-col);
	display: flex;
	align-items: center;
	justify-content: flex-end;
`;

const CurrentAmount = styled.span`
	font-weight: bold;
	text-align: right;
	margin-left: 5px;
`;

interface Props {
	wars: War[];
}

export const InterIncentWars = React.forwardRef<TickerItemHandles, Props>((props: Props, ref) => {
	const containerRef = useRef(null);
	const warRefs = useRef<TickerItemHandles[]>([]);

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			if (props.wars.length === 0) {
				return tl;
			}

			// Start
			tl.addLabel('warStart');
			tl.set(containerRef.current, { x: -630 });
			tl.to(containerRef.current, { x: 0, duration: 1 });

			for (let i = 0; i < props.wars.length; i++) {
				tl.add(warRefs.current[i].animation(tl));
			}

			// End
			tl.to(containerRef.current, { x: 630, duration: 1 }, '-=1');
			tl.set(containerRef.current, { x: -630, duration: 1 });

			return tl;
		},
	}));

	if (props.wars.length === 0) {
		return <></>;
	}

	const allGoals = props.wars.map((war, i) => {
		return (
			<WarGame
				war={war}
				key={war.index}
				ref={(el) => {
					if (el) {
						warRefs.current[i] = el;
					}
				}}
			/>
		);
	});

	return (
		<InterIncentWarsContainer ref={containerRef}>
			<MultiGoalContainer>{allGoals}</MultiGoalContainer>
		</InterIncentWarsContainer>
	);
});

const WarChoiceContainer = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	transform: translate(-630px, 0);
`;

const AllOptionContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	flex-grow: 1;
	width: 100%;
	justify-content: flex-start;
`;

interface GoalProps {
	war: War;
}

const WarGame = React.forwardRef<TickerItemHandles, GoalProps>((props: GoalProps, ref) => {
	const containerRef = useRef(null);
	const optionRefs = useRef<TickerItemHandles[]>([]);
	const [animLabel] = useState(props.war.index.toString() + 'a');

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			// Start
			tl.to(containerRef.current, { x: 0, duration: 1 }, '-=0.5');
			
			tl.addLabel('idkstagger');
			tl.addLabel(animLabel, `+=${props.war.options.length / 4}`);
			optionRefs.current.reverse().forEach(optionRef => {
				tl.add(optionRef.animation(tl), '-=1');
			});

			// End
			tl.to(containerRef.current, { x: 630, duration: 1 }, '+=10');
			tl.set(containerRef.current, { x: -630 });

			return tl;
		},
	}));

	let highest = 1; // Setting this to 0 could lead to a divide by zero lol :P
	props.war.options.forEach((option) => {
		if (option.total > highest) highest = option.total;
	});

	const allOptions = props.war.options.map((option, i) => {
		return (
			<WarChoice
				animLabel={animLabel}
				option={option}
				highest={highest}
				key={option.name}
				index={props.war.options.length - 1 -i}
				ref={(el) => {
					if (el) {
						optionRefs.current[i] = el;
					}
				}}
			/>
		);
	}).reverse();

	return (
		<WarChoiceContainer ref={containerRef}>
			<IncentiveContainer>
				<Game text={props.war.game} />
				<IncentiveName text={props.war.incentive} />
			</IncentiveContainer>
			<AllOptionContainer>{allOptions.length > 0 ? allOptions : <NoChoicesMade />}</AllOptionContainer>
		</WarChoiceContainer>
	);
});

const OptionName = styled(FitText)`
	max-width: 100%;
`;

const TextDiv = styled.div`
	width: 100%;
	height: 100%;
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	top: 0;
	left: 0;
	padding-right: 8px;
	color: black;
	font-size: 25px;
`;

interface WarChoiceProps {
	option: War['options'][0];
	highest: number;
	animLabel: string;
	index: number;
}

const WarChoice = React.forwardRef<TickerItemHandles, WarChoiceProps>((props: WarChoiceProps, ref) => {
	const percentage = (props.option.total / props.highest) * 100;
	const progressBarRef = useRef(null);
	const containerRef = useRef(null);

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			// Start
			tl.set(progressBarRef.current, { width: 0 }, 'warStart');
			tl.set(containerRef.current, { x: -630 }, 'warStart');

			tl.to(containerRef.current, { x: 0 }, `idkstagger+=${props.index/4}`);
			tl.to(progressBarRef.current, { width: `${percentage}%`, duration: 2 }, props.animLabel);
			return tl;
		},
	}));

	return (
		<ProgressContainer ref={containerRef}>
			<ProgressBarContainer ref={progressBarRef} />
			<TextDiv>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						background: 'white',
						padding: '0 10px',
						maxWidth: '80%',
					}}>
					<OptionName text={props.option.name} />
					<CurrentAmount>${Math.floor(props.option.total).toLocaleString()}</CurrentAmount>
				</div>
			</TextDiv>
		</ProgressContainer>
	);
});

const NoChoicesContainer = styled.div`
	flex-grow: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	font-weight: bold;
	text-transform: uppercase;
	font-style: italic;
`;

const NoChoicesMade: React.FC = () => {
	return <NoChoicesContainer>No names submitted</NoChoicesContainer>;
};

InterIncentWars.displayName = 'InterIncentWars';
WarGame.displayName = 'WarGame';
WarChoice.displayName = 'WarChoice';
