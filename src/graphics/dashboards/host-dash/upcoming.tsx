import clsx from "clsx";
import { useReplicant } from "@nodecg/react-hooks";
import { clone } from "underscore";

import type { RunDataArray, RunData } from "@asm-graphics/types/RunData.js";

import { Box, Paper } from "@mui/material";
import styles from "./upcoming.module.css";

interface Props {
	style?: React.CSSProperties;
}

export function Upcoming(props: Props) {
	const [runDataArrayRep] = useReplicant<RunDataArray>("runDataArray", {
		bundle: "nodecg-speedcontrol",
	});
	const [runDataActiveRep] = useReplicant<RunData | undefined>("runDataActiveRun", {
		bundle: "nodecg-speedcontrol",
	});

	const currentRunIndex = (runDataArrayRep ?? []).findIndex((run) => run.id === runDataActiveRep?.id);
	const futureRuns = clone(runDataArrayRep ?? []).slice(currentRunIndex);

	// Get the current run + remove it from the list
	const currentRun = futureRuns.shift();

	const allRuns = futureRuns.map((run) => {
		return <SingleRun run={run} key={run.id} />;
	});

	return (
		<div className={styles.upcomingContainer} style={props.style}>
			<SingleRun run={currentRun} active style={{ width: "calc(100% + 16px)" }} />
			<hr className={styles.divider} />
			{allRuns}
		</div>
	);
}

interface RunProps {
	run: RunData | undefined;
	active?: boolean;
	style?: React.CSSProperties;
}

interface ActiveProps {
	active?: string;
}

function SingleRun(props: RunProps) {
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
		<Paper className={clsx(styles.singleRunContainer, props.active && styles.active)} elevation={2} style={props.style}>
			<div className={styles.runDataContainer}>
				<span className={styles.game}>{props.run.game?.replaceAll("\\n", " ")}</span>
				<span className={styles.category}>{props.run.category?.replaceAll("\\n", " ")}</span>
			</div>
			<div className={styles.runDataContainer}>
				<span className={styles.names}>{playerNames}</span>
				<span className={styles.runInfo}>
					{props.run.system} - {props.run.estimate}
				</span>
			</div>
		</Paper>
	);
}
