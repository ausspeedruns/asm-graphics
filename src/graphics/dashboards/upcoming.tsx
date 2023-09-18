import React from "react";
import styled from "styled-components";
import { useReplicant } from "use-nodecg";
import clone from "clone";

import { RunDataArray, RunData } from "@asm-graphics/types/RunData";

import { Box } from "@mui/material";

const UpcomingContainer = styled.div`
	display: flex;
	flex-direction: column;
	padding: 8px;
	padding-right: 24px;
`;

const Divider = styled.hr`
	margin: 8px 0;
	// height: 1px;
	width: calc(100% + 16px);
	background: #999;
`;

interface Props {
	style?: React.CSSProperties;
}

export const Upcoming: React.FC<Props> = (props: Props) => {
	const [runDataArrayRep] = useReplicant<RunDataArray>("runDataArray", [], {
		namespace: "nodecg-speedcontrol",
	});
	const [runDataActiveRep] = useReplicant<RunData | undefined>("runDataActiveRun", undefined, {
		namespace: "nodecg-speedcontrol",
	});

	const currentRunIndex = runDataArrayRep.findIndex((run) => run.id === runDataActiveRep?.id);
	const futureRuns = clone(runDataArrayRep).slice(currentRunIndex);

	// Get the current run + remove it from the list
	const currentRun = futureRuns.shift();

	const allRuns = futureRuns.map((run) => {
		return <SingleRun run={run} key={run.id} />;
	});

	return (
		<UpcomingContainer style={props.style}>
			<SingleRun run={currentRun} active style={{ width: "calc(100% + 16px)" }} />
			<Divider />
			{allRuns}
		</UpcomingContainer>
	);
};

const SingleRunContainer = styled(Box)<ActiveProps>`
	margin: 6px 0;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	font-size: 13px;
	padding: 8px;
	border-radius: 7px;
	width: 100%;
	background: #eee;
	${({ active }) => (active === "true" ? "border-left: 8px solid #59a569; box-sizing: border-box;" : "")}
`;

const RunDataContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	font-size: 1.1rem;
`;

const Game = styled.span`
	font-size: 1.2rem;
	font-weight: bold;
`;
const Category = styled.span`
	font-weight: bold;
`;
const Names = styled.span`
	font-weight: bold;
`;
const RunInfo = styled.span``;

interface RunProps {
	run: RunData | undefined;
	active?: boolean;
	style?: React.CSSProperties;
}

interface ActiveProps {
	active?: string;
}

const SingleRun: React.FC<RunProps> = (props: RunProps) => {
	if (!props.run) {
		return <></>;
	}

	let playerNames;
	if (props.run.teams.length === 0) {
		playerNames = "";
	} else {
		playerNames = props.run?.teams
			.map((team) => {
				return team.players.map((player) => player.name).join(", ");
			})
			.join(" vs ");
	}

	return (
		<SingleRunContainer boxShadow={2} active={props.active ? "true" : "false"} style={props.style}>
			<RunDataContainer>
				<Game>{props.run.game?.replaceAll("\\n", " ")}</Game>
				<Category>{props.run.category?.replaceAll("\\n", " ")}</Category>
			</RunDataContainer>
			<RunDataContainer>
				<Names>{playerNames}</Names>
				<RunInfo>
					{props.run.system} - {props.run.estimate}
				</RunInfo>
			</RunDataContainer>
		</SingleRunContainer>
	);
};
