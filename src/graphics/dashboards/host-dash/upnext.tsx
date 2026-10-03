import clsx from "clsx";
import { useReplicant } from "@nodecg/react-hooks";

import type { RunDataArray, RunData } from "@asm-graphics/types/RunData.js";

import { Paper } from "@mui/material";
import styles from "./upnext.module.css";

interface Props {
	style?: React.CSSProperties;
}

export function UpNext(props: Props) {
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
		<div className={styles.upcomingContainer} style={props.style}>
			{currentRun && (
				<>
					<SingleRun run={currentRun} active style={{ width: "calc(100% + 16px)" }} />
					{upNext.length > 0 && <hr className={styles.divider} />}
					<div
						style={{
							maxHeight: "100%",
						}}
					>
						{upNext.map((run) => (
							<SingleRun key={run.id} run={run} />
						))}
					</div>
				</>
			)}
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
				<span className={styles.game}>{props.run.game}</span>
				<span className={styles.category}>{props.run.category}</span>
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
