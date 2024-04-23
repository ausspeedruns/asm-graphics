import React, { useImperativeHandle, useRef } from "react";
import styled from "styled-components";
import clone from "clone";

import { TickerItem } from "./item";
import { TickerTitle } from "./title";

import { TickerItemHandles } from "../ticker";
import { RunDataArray, RunDataActiveRun } from "@asm-graphics/types/RunData";

const TickerRunsContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	height: 64px;
	width: 100%;
	display: flex;
	align-items: center;
	transform: translate(0px, -64px);
	z-index: 0;

	& div > div > span:nth-child(1) {
		font-family: var(--main-font);
		font-weight: normal;
		margin-bottom: -8px;
	}
`;

interface Props {
	runArray: RunDataArray;
	currentRun: RunDataActiveRun;
}

const numOfUpcomingRuns = 3;

export const TickerRuns = React.forwardRef<TickerItemHandles, Props>((props: Props, ref) => {
	const containerRef = useRef(null);
	const currentRunIndex = props.runArray.findIndex((run) => run.id === props.currentRun?.id);
	const upcomingRuns = clone(props.runArray)
		.slice(currentRunIndex + 1)
		.slice(0, numOfUpcomingRuns);

	const RunsArray = upcomingRuns.map((run, i) => {
		let playerNames;
		if (run.teams.length === 0) {
			playerNames = "";
		} else {
			playerNames = run?.teams
				.map((team) => {
					return team.players.map((player) => player.name).join(", ");
				})
				.join(" vs ");
		}

		return <TickerItem title={run.game ?? ""} sub={playerNames ?? ""} key={run.id} index={i} />;
	});

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			// Start
			tl.to(containerRef.current, { y: 0, duration: 1 });

			// End
			tl.to(containerRef.current, { y: 64, duration: 1 }, "+=10");
			tl.set(containerRef.current, { y: -64, duration: 1 });

			return tl;
		},
	}));

	return (
		<TickerRunsContainer ref={containerRef}>
			<TickerTitle style={{ background: "var(--dh-red)" }}>Coming Up</TickerTitle>
			{RunsArray}
		</TickerRunsContainer>
	);
});

TickerRuns.displayName = "TickerRuns";
