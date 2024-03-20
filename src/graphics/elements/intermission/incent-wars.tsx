import React, { useImperativeHandle, useRef, useState } from "react";
import styled from "styled-components";

import { War } from "@asm-graphics/types/Incentives";
import { TickerItemHandles } from "./incentives";
import { FitText } from "../fit-text";

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
	transform: translate(-2000px, 0);
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
			tl.addLabel("warStart");
			tl.set(containerRef.current, { x: -2000 });
			tl.to(containerRef.current, { x: 0, duration: 1 });

			for (let i = 0; i < props.wars.length; i++) {
				tl.add(warRefs.current[i].animation(tl));
			}

			// End
			tl.to(containerRef.current, { x: 2000, duration: 1 }, "-=1");
			tl.set(containerRef.current, { x: -2000, duration: 1 });

			return tl;
		},
		reset(tl) {
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
	flex-direction: column;
	justify-content: center;
	align-items: center;
	/* margin-top: -10px; */
	/* margin-bottom: 5px; */
	font-size: 30px;
	width: 100%;
	height: 100px;
`;

const WarChoiceContainer = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	transform: translate(-2000px, 0);
	/* padding: 0 50px; */
	box-sizing: border-box;
`;

const AllOptionContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	justify-content: center;
	gap: 10px;
	flex-grow: 1;
	margin-top: 150px;
`;

const Game = styled(FitText)`
	max-width: 615px;
`;

const IncentiveName = styled(FitText)`
	font-weight: bold;
	max-width: 615px;
	font-family: var(--secondary-font);
`;

interface GoalProps {
	war: War;
}

const MAX_OPTIONS = 4;

export const WarGame = React.forwardRef<TickerItemHandles, GoalProps>((props: GoalProps, ref) => {
	const containerRef = useRef(null);
	const optionRefs = useRef<TickerItemHandles[]>([]);
	const [animLabel] = useState(props.war.index.toString() + "a");

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			// Start
			tl.to(containerRef.current, { x: 0, duration: 1 }, "-=0.5");

			tl.addLabel("idkstagger");
			tl.addLabel(animLabel, `+=${props.war.options.length / 4}`);
			optionRefs.current.reverse().forEach((optionRef) => {
				tl.add(optionRef.animation(tl), "-=1");
			});

			// End
			tl.to(containerRef.current, { x: 2000, duration: 1 }, props.war.options.length == 0 ? "+=10" : undefined);
			tl.set(containerRef.current, { x: -2000 });

			optionRefs.current.forEach((optionRef) => {
				tl.add(optionRef.reset(tl));
			});

			return tl;
		},
		reset(tl) {
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
				index={i}
				numberOfItems={Math.min(MAX_OPTIONS, sortedOptions.length)}
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
				option={{ name: "", total: 0 }}
				highest={highest}
				key={"More Options"}
				moreOptions
				index={1}
				numberOfItems={Math.min(MAX_OPTIONS, sortedOptions.length)}
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
			<AllOptionContainer>{allOptions.length > 0 ? allOptions : <NoChoicesMade />}</AllOptionContainer>
			<IncentiveContainer>
				<Game text={props.war.game} />
				<IncentiveName text={props.war.incentive} />
			</IncentiveContainer>
		</WarChoiceContainer>
	);
});

const OptionName = styled(FitText)`
	max-width: 90%;
	font-weight: bold;
`;

const OptionContainer = styled.div`
	display: flex;
	justify-content: space-between;
	width: 100%;
	height: 50px;
	/* background: var(--main); */
	/* padding: 10px; */
	box-sizing: border-box;
	transform: translate(0, 40px);
	font-family: var(--secondary-font);
	/* border: 1px solid var(--tgx-green); */
	max-width: 1000px;
	opacity: 0;
`;

const TextDiv = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	top: 0;
	left: 0;
	color: var(--text-light);
	font-size: 25px;
	width: 100%;
`;

// Determines full size
const ProgressContainer = styled.div`
	/* flex-grow: 1; */
	width: 100%;
	height: 100%;
	position: absolute;
	overflow: hidden;
	box-sizing: border-box;
	background: transparent;
	/* background: var(--main); */
	display: flex;
	align-items: flex-end;
	/* border: 1px solid var(--tgx-green); */
`;

const ProgressBarContainer = styled.div`
	height: 100%;
	width: 0%;
	background: var(--tgx-green);
	display: flex;
	align-items: center;
	justify-content: flex-end;
`;

const CurrentAmount = styled.span``;

interface WarChoiceProps {
	option: War["options"][0];
	highest: number;
	animLabel: string;
	index: number;
	moreOptions?: boolean;
	numberOfItems: number;
}

const WarChoice = React.forwardRef<TickerItemHandles, WarChoiceProps>((props: WarChoiceProps, ref) => {
	const percentage = (props.option.total / props.highest) * 100;
	const progressBarRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			let top = 1000;
			if (containerRef.current)
			{
				top = containerRef.current.getBoundingClientRect().top;
			}

			const base = (top - 580) * 2;

			// Start
			tl.set(progressBarRef.current, { width: 0 }, "warStart");
			tl.set(containerRef.current, { y: 40, opacity: 0, maxWidth: base }, "warStart");

			tl.to(containerRef.current, { y: 0, opacity: 1 }, `idkstagger+=${props.index / 4}`);
			tl.to(progressBarRef.current, { width: `${percentage}%`, duration: 2 }, props.animLabel);

			tl.to(containerRef.current, { y: -40, opacity: 0 }, "idkstagger+=10");
			tl.set(containerRef.current, { y: 40 });
			return tl;
		},
		reset: (tl) => {
			tl.set(progressBarRef.current, { width: 0 });
			tl.set(containerRef.current, { y: 40, opacity: 0 });

			return tl;
		},
	}));

	if (props.moreOptions) {
		return (
			<OptionContainer ref={containerRef}>
				<TextDiv>
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							padding: "0 10px",
							width: "100%",
							fontSize: 25,
						}}>
						<OptionName text={"More online!"} />
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
						display: "flex",
						padding: "0 40px",
						width: "100%",
						justifyContent: "space-between",
						zIndex: 2,
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
	text-align: center;
	justify-content: center;
	align-items: center;
	font-weight: bold;
	text-transform: uppercase;
	font-style: italic;
	font-size: 40px;
`;

const NoChoicesMade: React.FC = () => {
	return <NoChoicesContainer>No names<br/>submitted</NoChoicesContainer>;
};

InterIncentWars.displayName = "InterIncentWars";
WarGame.displayName = "WarGame";
WarChoice.displayName = "WarChoice";
