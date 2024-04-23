import React, { useImperativeHandle, useRef } from "react";
import styled from "styled-components";

import { Goal } from "@asm-graphics/types/Incentives";
import { TickerItemHandles } from "./incentives";

import { FitText } from "../fit-text";

const GoalBarContainer = styled.div`
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
	padding: 16px;
	box-sizing: border-box;
`;

const GoalDiv = styled.div`
	display: flex;
	justify-content: center;
	align-items: flex-end;
	/* margin-left: 10px; */
	font-weight: bold;
	font-size: 37px;
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
	border: 2px solid var(--dh-red);
	/* background: var(--main); */
	background: transparent;
	position: relative;
	overflow: hidden;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	/* align-items: flex-end; */
	justify-content: flex-end;
	border-radius: 16px;
`;

const ProgressBarContainer = styled.div`
	width: 100%;
	background: linear-gradient(0deg, var(--dh-orange) 0%, var(--dh-red) 200%);
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
	font-family: var(--secondary-font);
	font-size: 30px;
	font-weight: bold;
`;

interface GoalProps {
	goal: Goal;
}

export const GoalBar = React.forwardRef<TickerItemHandles, GoalProps>((props: GoalProps, ref) => {
	const containerRef = useRef(null);
	const progressBarRef = useRef(null);

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			// Start
			tl.fromTo(containerRef.current, { xPercent: -100 }, { xPercent: 0, duration: 1 }, "-=0.5");
			tl.addLabel("startBarFilling", "+=0.1");

			const percentage = (props.goal.total / props.goal.goal) * 100;
			tl.fromTo(
				progressBarRef.current,
				{ height: 0, background: `linear-gradient(0deg, var(--dh-orange) 0%, var(--dh-red) 10000%);` },
				{
					height: `${percentage}%`,
					background: `linear-gradient(0deg, var(--dh-orange) 0%, var(--dh-red) ${percentage == 0 ? (1 / percentage) * 10000 : 10000}%);`,
					duration: Math.max(1, percentage / 45 + 0.5),
				},
				"startBarFilling",
			);

			// End
			tl.to(containerRef.current, { xPercent: 110, duration: 1 }, "+=10");
			return tl;
		},
	}));

	let textOutside: React.CSSProperties = {};
	if (props.goal.total / props.goal.goal < 0.5) {
		textOutside = {
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
						<CurrentAmount style={textOutside}>
							${Math.floor(props.goal.total).toLocaleString()}
						</CurrentAmount>
					</ProgressBarContainer>
				</ProgressContainer>
			</BottomBar>
			{/* <IncentiveContainer>
				<Game text={props.goal.game} />
				<IncentiveName text={props.goal.incentive} />
			</IncentiveContainer> */}
		</GoalBarContainer>
	);
});

GoalBar.displayName = "GoalBar";
