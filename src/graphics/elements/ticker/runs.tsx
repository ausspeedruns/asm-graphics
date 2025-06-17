import React, { useImperativeHandle, useRef } from "react";
import styled from "styled-components";
import clone from "clone";

import { TickerItem } from "./item";
import { TickerTitle } from "./title";

import { TickerItemHandles } from "../ticker";
import type { RunDataArray, RunDataActiveRun, RunData } from "../../../types/RunData";

const TickerRunsContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	height: 64px;
	width: 100%;
	display: flex;
	align-items: center;
	transform: translate(0px, 0px);
	z-index: 0;
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

		return (
			<>
				<Run run={run} playerNames={playerNames ?? ""} key={run.id} />
				{i < upcomingRuns.length - 1 && <BorderItem />}
			</>
		);
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
			<TickerTitle>Coming Up</TickerTitle>
			{RunsArray}
		</TickerRunsContainer>
	);
});

TickerRuns.displayName = "TickerRuns";

const TickerItemContainer = styled.div`
	height: 64px;
	width: fit-content;
	font-family: var(--main-font);
	color: var(--text-light);
	display: flex;
	align-items: center;
	justify-content: center;
	flex-grow: 1;
`;

const VerticalStack = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	margin: 0 12px;
	height: 100%;
	margin-top: -4px;
`;

const Title = styled.span`
	font-size: 28px;
	white-space: nowrap;
	margin-top: 8px;
	font-weight: 1000;
	font-family: var(--secondary-font);
	margin-bottom: -8px;
`;

const Subtitle = styled.span`
	font-size: 17px;
	white-space: nowrap;
	/* margin-top: -8px; */
	/* font-family: var(--secondary-font); */
`;

const BorderItem = styled.div`
	height: 55px;
	width: 2px;
	background: var(--accent);
`;

function approximateTimeFormatter(time: number): string {
	const days = Math.floor(time / 86400);
	const hours = Math.floor((time % 86400) / 3600);
	const minutes = Math.floor((time % 3600) / 60);

	if (days == 1) {
		return "Tomorrow";
	}

	if (days > 1) {
		return `In ${days} Days`;
	}

	if (hours > 0) {
		if (minutes > 30) {
			return `In ${hours + 1} Hours`;
		}

		return `In ${hours} ${hours > 1 ? "Hours" : "Hour"}`;
	}

	// The minutes are not exact because we round up a little bit (e.g. if something is 18 minutes away, you will probably say "In 20 Minutes" rather than "In 15 Minutes")
	if (minutes > 0) {
		if (minutes >= 50) {
			return `In 1 Hour`;
		}

		if (minutes >= 40) {
			return `In 45 Minutes`;
		}

		if (minutes >= 25) {
			return `In 30 Minutes`;
		}

		if (minutes >= 18) {
			return `In 20 Minutes`;
		}

		if (minutes >= 13) {
			return `In 15 Minutes`;
		}

		if (minutes >= 8) {
			return `In 10 Minutes`;
		}

		if (minutes >= 5) {
			return `In 5 Minutes`;
		}

		return "Very Soon";
	}

	return "Soon";
}

interface RunProps {
	run: RunData;
	playerNames?: string;
}

function Run(props: RunProps) {
	let timeUntilRun = 0;

	if (props.run.scheduledS) {
		timeUntilRun = props.run.scheduledS - Math.floor(Date.now() / 1000);
	}

	return (
		<TickerItemContainer>
			<VerticalStack>
				<Title>{props.run.game ?? ""}</Title>
				<Subtitle>
					<b>{approximateTimeFormatter(timeUntilRun)}</b> – {props.playerNames ?? ""}
				</Subtitle>
			</VerticalStack>
		</TickerItemContainer>
	);
}
