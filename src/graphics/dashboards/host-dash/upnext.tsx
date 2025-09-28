import styled from "styled-components";
import { useReplicant } from "@nodecg/react-hooks";

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

export const UpNext: React.FC<Props> = (props: Props) => {
	const [runDataArrayRep] = useReplicant<RunDataArray>("runDataArray", {
		bundle: "nodecg-speedcontrol",
	});
	const [runDataActiveRep] = useReplicant<RunData | undefined>("runDataActiveRun", {
		bundle: "nodecg-speedcontrol",
	});

	const currentRunIndex = (runDataArrayRep ?? []).findIndex((run) => run.id === runDataActiveRep?.id);

	const currentRun = (runDataArrayRep ?? [])[currentRunIndex];
	const upNext = (runDataArrayRep ?? []).slice(currentRunIndex + 1);

	return (
		<UpcomingContainer style={props.style}>
			{currentRun && (
				<>
					<SingleRun run={currentRun} active style={{ width: "calc(100% + 16px)" }} />
					{upNext.length > 0 && <Divider />}
					<div
						style={{
							maxHeight: "100%",
						}}>
						{upNext.map((run) => (
							<SingleRun key={run.id} run={run} />
						))}
					</div>
				</>
			)}
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
	background: var(--inset-background);
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
				<Game>{props.run.game}</Game>
				<Category>{props.run.category}</Category>
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
