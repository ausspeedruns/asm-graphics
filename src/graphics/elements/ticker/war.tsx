import React, { useImperativeHandle, useRef, useState } from 'react';
import styled from 'styled-components';

import { War } from '@asm-graphics/types/Incentives';
import { TickerItemHandles } from '../ticker';

import { TickerTitle } from './title';
import { FitText } from '../fit-text';
import { tgxColour } from './item';

const TickerWarContainer = styled.div`
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
`;

const MultiGoalContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	position: relative;
`;

const Goal = styled.div`
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

const IncentiveContainer = styled(Goal)`
	// position: absolute;
	height: 100%;
	display: flex;
	align-items: center;
	margin: 0 4px 0 8px;
`;

// Determines full size
const ProgressContainer = styled.div`
	flex-grow: 1;
	min-width: 165px;
	max-width: 50%;
	height: 54px;
	margin: 0 16px 0 5px;
	border: 1px solid #ffffff;
	position: relative;
	overflow: hidden;
`;

const ProgressBarContainer = styled.div`
	height: 100%;
	width: 0px;
	background: #ffffff;
	border-right: 5px solid var(--accent);
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

export const TickerWar = React.forwardRef<TickerItemHandles, Props>((props: Props, ref) => {
	const containerRef = useRef(null);
	const warRefs = useRef<TickerItemHandles[]>([]);

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			if (props.wars.length === 0) {
				return tl;
			}

			// Start
			tl.addLabel('warStart');
			tl.set(containerRef.current, { y: -64 });
			tl.to(containerRef.current, { y: 0, duration: 1 });

			for (let i = 0; i < props.wars.length; i++) {
				tl.add(warRefs.current[i].animation(tl));
			}

			// End
			tl.to(containerRef.current, { y: 64, duration: 1 }, '-=1');
			tl.set(containerRef.current, { y: -64, duration: 1 });

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
		<TickerWarContainer ref={containerRef}>
			<TickerTitle style={{ background: 'var(--tgx-blue)', color: 'var(--text-light)' }}>
				Challenge
				<br />
				Wars
			</TickerTitle>
			<MultiGoalContainer>{allGoals}</MultiGoalContainer>
		</TickerWarContainer>
	);
});

const WarChoiceContainer = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	transform: translate(0, -64px);
`;

const AllOptionContainer = styled.div`
	display: flex;
	align-items: center;
	flex-grow: 1;
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
			tl.to(containerRef.current, { y: 0, duration: 1 }, '-=0.5');

			for (let i = 0; i < Math.min(props.war.options.length, 5); i++) {
				tl.add(optionRefs.current[props.war.options.length - 1 - i].animation(tl), animLabel);
			}

			// End
			tl.to(containerRef.current, { y: 64, duration: 1 }, '+=10');
			tl.set(containerRef.current, { y: -64 });

			return tl;
		},
	}));

	let highest = 1; // Setting this to 0 could lead to a divide by zero lol :P
	props.war.options.forEach((option) => {
		if (option.total > highest) highest = option.total;
	});

	let allOptions = [];
	const sortedOptions = props.war.options.map((option) => ({ ...option }));
	sortedOptions.sort((a, b) => a.total - b.total);
	for (let i = 0; i < Math.min(props.war.options.length, 5); i++) {
		const option = sortedOptions[props.war.options.length - 1 - i];
		allOptions.push(
			<WarChoice
				animLabel={animLabel}
				option={option}
				highest={highest}
				index={i}
				key={option.name}
				ref={(el) => {
					if (el) {
						optionRefs.current[props.war.options.length - 1 - i] = el;
					}
				}}
			/>,
		);
	}

	if (props.war.options.length > 6) {
		const remaining = props.war.options.length - 6;
		allOptions = allOptions.slice(0, 5);
		allOptions.push(<MoreChoices key={'more'} more={remaining} />);
	}

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
	max-width: 60%;
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
	color: var(--text-dark);
	font-size: 20px;
`;

interface WarChoiceProps {
	option: War['options'][0];
	highest: number;
	animLabel: string;
	index?: number;
}

const WarChoice = React.forwardRef<TickerItemHandles, WarChoiceProps>((props: WarChoiceProps, ref) => {
	const percentage = (props.option.total / props.highest) * 100;
	const progressBarRef = useRef(null);

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			// Start
			tl.set(progressBarRef.current, { width: 0 }, 'warStart');
			tl.to(progressBarRef.current, { width: `${percentage}%`, duration: 2 }, props.animLabel);
			return tl;
		},
	}));

	return (
		<ProgressContainer>
			<ProgressBarContainer ref={progressBarRef} style={{ borderColor: tgxColour(props.index) }} />
			<TextDiv>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						background: '#FFFFFF',
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

const MoreChoicesContainer = styled.div`
	text-transform: uppercase;
	font-weight: bold;
	width: 173px;
	font-size: 27px;
	margin: 0 16px 0 5px;
	line-height: 24px;
	text-align: center;
`;

interface MoreChoicesProps {
	more: number;
}

const MoreChoices: React.FC<MoreChoicesProps> = (props: MoreChoicesProps) => {
	return <MoreChoicesContainer>{props.more} more options</MoreChoicesContainer>;
};

TickerWar.displayName = 'TickerWar';
WarGame.displayName = 'WarGame';
WarChoice.displayName = 'WarChoice';
