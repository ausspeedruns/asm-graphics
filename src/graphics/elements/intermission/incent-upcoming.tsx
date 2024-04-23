import React, { useImperativeHandle, useRef } from "react";
import styled from "styled-components";

import { TickerItemHandles } from "./incentives";

import { FitText } from "../fit-text";
import { RunData } from "@asm-graphics/types/RunData";

const UpcomingRunsContainer = styled.div`
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

interface UpcomingRunsProps {
	upcomingRuns: RunData[];
}

export const UpcomingRuns = React.forwardRef<TickerItemHandles, UpcomingRunsProps>((props: UpcomingRunsProps, ref) => {
	const containerRef = useRef(null);
	const progressBarRef = useRef(null);

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			return tl;
		},
	}));

	return (
		<UpcomingRunsContainer ref={containerRef}>
		</UpcomingRunsContainer>
	);
});

UpcomingRuns.displayName = "Upcoming";

const UpcomingRunContainer = styled.div``;

interface UpcomingRunProps {
	run: RunData;
}

const UpcomingRun = React.forwardRef<TickerItemHandles, UpcomingRunProps>((props: UpcomingRunProps, ref) => {
	const containerRef = useRef(null);
	const progressBarRef = useRef(null);

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			return tl;
		},
	}));

	return (
		<UpcomingRunContainer ref={containerRef}>
		</UpcomingRunContainer>
	);
});
