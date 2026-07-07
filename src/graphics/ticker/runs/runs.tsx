import { useImperativeHandle, useRef } from "react";
import styled from "@emotion/styled";
import { clone } from "underscore";

import { TickerTitle } from "../title";

import type { TickerItemHandles } from "../../ticker";
import type { RunDataArray, RunDataActiveRun, RunData } from "@asm-graphics/types/RunData";
import { Run } from "./run";

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
`;

interface Props {
	runArray: RunDataArray;
	currentRun: RunDataActiveRun;
	ref: React.Ref<TickerItemHandles>;
}

const numOfUpcomingRuns = 2;

// TODO: Show as many runs as fit in the space instead of a fixed number
export function TickerRuns(props: Props) {
	const containerRef = useRef(null);
	const currentRunIndex = props.runArray.findIndex((run) => run.id === props.currentRun?.id);
	const upcomingRuns = clone(props.runArray)
		.slice(currentRunIndex + 1)
		.slice(0, numOfUpcomingRuns);

	const RunsArray = upcomingRuns.map((run, i) => {
		return (
			<>
				<Run run={run} key={run.id} />
				{i < upcomingRuns.length - 1 && <BorderItem key={run.id + "-border"} />}
			</>
		);
	});

	useImperativeHandle(props.ref, () => ({
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
			<TickerTitle>Coming Up</TickerTitle>
			{RunsArray}
		</TickerRunsContainer>
	);
}

const BorderItem = styled.div`
	height: 55px;
	width: 2px;
	background: var(--accent);
`;
