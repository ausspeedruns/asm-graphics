import React, { useImperativeHandle, useRef, useState } from "react";
import styled from "styled-components";

import { War } from "@asm-graphics/types/Incentives";
import { TickerItemHandles } from "./incentives";
import { FitText } from "../fit-text";

const WarChoiceContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	/* transform: translate(-100%, 0); */
	/* padding: 0 50px; */
	box-sizing: border-box;
	padding: 16px;
`;

const AllOptionContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	width: 100%;
	justify-content: center;
	gap: 16px;
	flex-grow: 1;
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
			// tl.fromTo(containerRef.current, { xPercent: -100 }, { xPercent: 0, duration: 1 }, "-=0.5");

			tl.addLabel("stagger");
			optionRefs.current.reverse().forEach((optionRef) => {
				tl.add(optionRef.animation(tl), "-=1");
			});

			// End
			// tl.to(containerRef.current, { xPercent: 100, duration: 1 }, props.war.options.length == 0 ? "+=1" : undefined);

			return tl;
		},
	}));

	let highest = 1; // Setting this to 0 could lead to a divide by zero lol :P
	props.war.options.forEach((option) => {
		if (option.total > highest) highest = option.total;
	});

	const sortedOptions = props.war.options.map((a) => ({ ...a }));
	sortedOptions.sort((a, b) => b.total - a.total);
	const allOptions = [];
	for (let i = 0; i < Math.min(MAX_OPTIONS, sortedOptions.length); i++) {
		const option = sortedOptions[i];
		allOptions.push(
			<WarChoice
				animLabel={animLabel}
				option={option}
				highest={highest}
				key={option.name}
				index={sortedOptions.length - i}
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

	if (sortedOptions.length == 0) {
		allOptions.push(
			<NoChoicesMade
				ref={(el) => {
					if (el) {
						optionRefs.current[0] = el;
					}
				}}
			/>,
		);
	}

	return (
		<WarChoiceContainer ref={containerRef}>
			<AllOptionContainer>{allOptions}</AllOptionContainer>
			{/* <IncentiveContainer>
				<Game text={props.war.game} />
				<IncentiveName text={props.war.incentive} />
			</IncentiveContainer> */}
		</WarChoiceContainer>
	);
});

const OptionName = styled(FitText)`
	max-width: 90%;
	font-weight: bold;
`;

const OptionContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 100%;
	height: 100%;
	/* background: var(--main); */
	/* padding: 10px; */
	box-sizing: border-box;
	/* transform: translate(0, 40px); */
	font-family: var(--secondary-font);
	/* border: 1px solid var(--tgx-green); */
	max-width: 1000px;
	/* opacity: 0; */
	gap: 8px;
`;

const TextDiv = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	top: 0;
	left: 0;
	color: var(--text-light);
	font-size: 28px;
	width: 100%;
`;

// Determines full size
const ProgressContainer = styled.div`
	/* flex-grow: 1; */
	width: 100%;
	height: 100%;
	overflow: hidden;
	box-sizing: border-box;
	background: transparent;
	/* background: var(--main); */
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-end;
	/* border: 1px solid var(--tgx-green); */
	border-radius: 16px;
	gap: 8px;
`;

const ProgressBarContainer = styled.div`
	height: 0%;
	width: 100%;
	background: linear-gradient(0deg, var(--dh-orange) 0%, var(--dh-red) 100%);
	display: flex;
	align-items: center;
	justify-content: flex-end;
	border-radius: 16px;
`;

const CurrentAmount = styled.span`
	font-size: 26px;
`;

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
			// Start
			tl.fromTo(containerRef.current, { x: -950 }, { x: 0, duration: 1, ease: "power2.out" }, `stagger+=${props.index / 8}`);
			tl.fromTo(progressBarRef.current, { height: 0 }, { height: `${percentage}%`, duration: 2, ease: "power4.out" }, `stagger+=${(props.index / 2) + 0.75}`);

			tl.to(containerRef.current, { x: 950, duration: 1, ease: "power2.in" }, `stagger+=${(props.index / 8) + 10}`);
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
			<ProgressContainer>
				<CurrentAmount>${Math.floor(props.option.total).toLocaleString()}</CurrentAmount>
				<ProgressBarContainer ref={progressBarRef} />
			</ProgressContainer>
			<TextDiv>
				<OptionName text={props.option.name} />
			</TextDiv>
		</OptionContainer>
	);
});

const NoChoicesContainer = styled.div`
	flex-grow: 1;
	display: flex;
	text-align: center;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	/* font-weight: bold; */
`;

const NoChoiceHeading = styled.span`
	text-transform: uppercase;
	font-style: italic;
	font-size: 60px;
`;

const NoChoiceSubheading = styled.span`
	font-family: var(--secondary-font);
	font-size: 35px;
`;

const NoChoicesMade = React.forwardRef<TickerItemHandles>((_, ref) => {
	const containerRef = useRef<HTMLDivElement>(null);

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			// Start
			tl.fromTo(containerRef.current, { x: -950 }, { x: 0, duration: 1, ease: "power2.out" });

			tl.to(containerRef.current, { x: 950, duration: 1, ease: "power2.in" }, "+=10");
			return tl;
		},
	}));

	return (
		<NoChoicesContainer ref={containerRef}>
			<NoChoiceHeading>No names submitted</NoChoiceHeading>
			<NoChoiceSubheading>Donate and write a name!</NoChoiceSubheading>
		</NoChoicesContainer>
	);
});

WarGame.displayName = "WarGame";
WarChoice.displayName = "WarChoice";
