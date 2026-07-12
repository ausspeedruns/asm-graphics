import clsx from "clsx";
import { Fragment } from "react/jsx-runtime";
import styles from "./current-run.module.css";
import { FitText } from "../elements/fit-text";

import StopwatchIcon from "../media/icons/stopwatch.svg?react";
import RunnerIcon from "../media/icons/runner.svg?react";
import ConsoleIcon from "../media/icons/console.svg?react";
import { useIntermissionStore } from "../stores/intermission-store";
import { customDataSchema } from "../../shared/types/custom-data";

export function IntermissionCurrentRun() {
	const currentRun = useIntermissionStore((state) => state.activeRun);
	const customData = customDataSchema.safeParse(currentRun?.customData ?? {}).data;

	let playerNames: React.ReactNode[] = [];
	if (currentRun?.teams.length === 0) {
		playerNames = [];
	} else {
		if (currentRun) {
			playerNames = currentRun.teams.map((team, index) => {
				const players = team.players.map((player) => player.name).join(", ");
				return (
					<Fragment key={index}>
						<FitText text={players} />
						{currentRun && index !== currentRun.teams.length - 1 && (
							<span style={{ fontSize: "60%" }}> vs </span>
						)}
					</Fragment>
				);
			});
		} else {
			playerNames = [];
		}
	}

	const gameName = customData?.gameDisplay ?? currentRun?.game ?? "";

	const estimate =
		currentRun?.estimate?.startsWith("0") && !currentRun?.estimate?.startsWith("0:")
			? currentRun?.estimate?.substring(1)
			: currentRun?.estimate;

	return (
		<div className={styles.currentRun}>
			<div className={styles.nameContainer}>
				<FitText
					className={clsx(styles.name, gameName.includes("\\n") && styles.containsNewLine)}
					allowNewlines
					text={gameName}
				/>
				<FitText className={styles.category} text={currentRun?.category} />
			</div>
			<div className={styles.runInfo}>
				<div className={styles.runners}>
					<RunnerIcon />
					{playerNames}
				</div>
				<div className={styles.estimate}>
					<StopwatchIcon />
					<FitText text={estimate ?? "0"} />
				</div>
				<div className={styles.console}>
					<ConsoleIcon />
					<FitText text={currentRun?.system} />
				</div>
			</div>
		</div>
	);
}
