import React, { useImperativeHandle, useRef, useState } from 'react';
import styled from 'styled-components';

import { War } from '@asm-graphics/types/Incentives';
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
			tl.set(containerRef.current, { x: -1000 });
			tl.to(containerRef.current, { x: 0, duration: 1 });

			for (let i = 0; i < props.wars.length; i++) {
				tl.add(warRefs.current[i].animation(tl));
			}

			// End
			tl.to(containerRef.current, { x: 1000, duration: 1 }, '-=1');
			tl.set(containerRef.current, { x: -1000, duration: 1 });

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

const WarChoiceContainer = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	transform: translate(-1000px, 0);
`;

const AllOptionContainer = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
	justify-content: center;
	gap: 15px;
`;

const Game = styled(FitText)`
	max-width: 470px;
`;

const IncentiveName = styled(FitText)`
	font-weight: bold;
	max-width: 470px;
	font-family: var(--secondary-font);
`;

interface GoalProps {
	war: War;
}

const MAX_OPTIONS = 4;
export const WarGame = React.forwardRef<TickerItemHandles, GoalProps>((props: GoalProps, ref) => {
	const containerRef = useRef(null);
	const optionRefs = useRef<TickerItemHandles[]>([]);
	const [animLabel] = useState(props.war.index.toString() + 'a');

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			// Start
			tl.to(containerRef.current, { x: 0, duration: 1 }, '-=0.5');

			tl.addLabel('idkstagger');
			tl.addLabel(animLabel, `+=${props.war.options.length / 4}`);
			optionRefs.current.reverse().forEach((optionRef) => {
				tl.add(optionRef.animation(tl), '-=1');
			});

			// End
			tl.to(containerRef.current, { x: 1000, duration: 1 }, '+=10');
			tl.set(containerRef.current, { x: -1000 });

			return tl;
		},
	}));

	let highest = 1; // Setting this to 0 could lead to a divide by zero lol :P
	props.war.options.forEach((option) => {
		if (option.total > highest) highest = option.total;
	});

	const sortedOptions = props.war.options.map((a) => ({ ...a }));
	sortedOptions.sort((a, b) => b.total - a.total);
	// const allOptions = sortedOptions.map((option, i) => {
	// 	return (
	// 		<WarChoice
	// 			animLabel={animLabel}
	// 			option={option}
	// 			highest={highest}
	// 			key={option.name}
	// 			index={sortedOptions.length - 1 - i}
	// 			ref={(el) => {
	// 				if (el) {
	// 					optionRefs.current[i] = el;
	// 				}
	// 			}}
	// 		/>
	// 	);
	// });
	const allOptions = [];
	for (let i = 0; i < Math.min(MAX_OPTIONS, sortedOptions.length); i++) {
		const option = sortedOptions[i];
		allOptions.push(
			<WarChoice
				animLabel={animLabel}
				option={option}
				highest={highest}
				key={option.name}
				index={sortedOptions.length - 1 - i}
				ref={(el) => {
					if (el) {
						optionRefs.current[i] = el;
					}
				}}
			/>,
		);
	}

	if (sortedOptions.length > MAX_OPTIONS) {
		allOptions.push(
			<WarChoice
				animLabel={animLabel}
				option={{ name: '', total: 0 }}
				highest={highest}
				key={'More Options'}
				moreOptions
				index={0}
				ref={(el) => {
					if (el) {
						optionRefs.current[MAX_OPTIONS] = el;
					}
				}}
			/>,
		);
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
	max-width: 100%;
	font-weight: bold;
`;

const OptionContainer = styled.div`
	display: flex;
	justify-content: space-between;
	/* width: 200px; */
	min-height: 100px;
	background: var(--main);
	padding: 10px;
	box-sizing: border-box;
	transform: translate(-1000px, 0);
	font-family: var(--secondary-font);
	border: 1px solid var(--sec);
`;

const TextDiv = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	top: 0;
	left: 0;
	color: var(--text-light);
	font-size: 25px;
`;

// Determines full size
const ProgressContainer = styled.div`
	/* flex-grow: 1; */
	width: 30px;
	height: 80px;
	position: relative;
	overflow: hidden;
	box-sizing: border-box;
	background: var(--main);
	display: flex;
	align-items: flex-end;
	border: 1px solid var(--sec);
`;

const ProgressBarContainer = styled.div`
	height: 0%;
	width: 100%;
	background: var(--sec);
	display: flex;
	align-items: center;
	justify-content: flex-end;
`;

const CurrentAmount = styled.span``;

interface WarChoiceProps {
	option: War['options'][0];
	highest: number;
	animLabel: string;
	index: number;
	moreOptions?: boolean;
}

const WarChoice = React.forwardRef<TickerItemHandles, WarChoiceProps>((props: WarChoiceProps, ref) => {
	const percentage = (props.option.total / props.highest) * 100;
	const progressBarRef = useRef(null);
	const containerRef = useRef(null);

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			// Start
			tl.set(progressBarRef.current, { height: 0 }, 'warStart');
			tl.set(containerRef.current, { x: -1000 }, 'warStart');

			tl.to(containerRef.current, { x: 0 }, `idkstagger+=${props.index / 4}`);
			tl.to(progressBarRef.current, { height: `${percentage}%`, duration: 2 }, props.animLabel);
			return tl;
		},
	}));

	if (props.moreOptions) {
		return (
			<OptionContainer ref={containerRef}>
				<TextDiv>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							padding: '0 10px',
							maxWidth: '80%',
						}}>
						<OptionName text={'More online!'} />
					</div>
				</TextDiv>
			</OptionContainer>
		);
	}

	return (
		<OptionContainer ref={containerRef}>
			<TextDiv>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						padding: '0 10px',
						maxWidth: '80%',
					}}>
					<OptionName text={props.option.name} />
					<CurrentAmount>${Math.floor(props.option.total).toLocaleString()}</CurrentAmount>
				</div>
			</TextDiv>
			<ProgressContainer>
				<ProgressBarContainer ref={progressBarRef} />
			</ProgressContainer>
		</OptionContainer>
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
	font-size: 40px;
`;

const NoChoicesMade: React.FC = () => {
	return <NoChoicesContainer>No names submitted</NoChoicesContainer>;
};

InterIncentWars.displayName = 'InterIncentWars';
WarGame.displayName = 'WarGame';
WarChoice.displayName = 'WarChoice';
