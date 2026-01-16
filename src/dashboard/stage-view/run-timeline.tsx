import { Slider } from "@mui/material";
import styles from "./run-timeline.module.css";
import { useReplicant } from "@nodecg/react-hooks";
import { formatDate } from "date-fns";

import RunnerIcon from "../../graphics/media/icons/runner.svg?react";

import type { Timer } from "@asm-graphics/types/Timer";
import type { HTMLAttributes } from "react";
import useCurrentRun from "@asm-graphics/shared/hooks/useCurrentRun";

function RunnerSliderThumb(props: HTMLAttributes<unknown>) {
	const { children, ...other } = props;

	return (
		<span {...other} className={styles.runnerThumb}>
			{children}
			<RunnerIcon />
		</span>
	);
}

function timeToProgress(timeS: number, estimateS: number) {
	return Math.max(0, 100 - ((timeS * 1000) / (estimateS * 1000)) * 100);
}

interface RunTimelineProps {}

export function RunTimeline() {
	const [runStartTimeRep] = useReplicant("runStartTime");
	const [timerRep] = useReplicant<Timer>("timer", { bundle: "nodecg-speedcontrol" });
	const currentRun = useCurrentRun();

	const startTime = formatDate(runStartTimeRep ?? 0, "h:mm a");
	const estimatedEndTimeDate =
		currentRun?.estimateS && runStartTimeRep ? runStartTimeRep + currentRun.estimateS * 1000 : 0;
	const estimatedEndTime = formatDate(estimatedEndTimeDate, "h:mm a");

	const progress = ((timerRep?.milliseconds ?? 0) / ((currentRun?.estimateS ?? 1) * 1000)) * 100;

	return (
		<div className={styles.container}>
			<span>{startTime}</span>
			<Slider
				value={progress}
				min={0}
				max={100}
				color="secondary"
				className={styles.progressBar}
				disabled
				slots={{ thumb: RunnerSliderThumb }}
				marks={[
					{
						value: timeToProgress(30 * 60, currentRun?.estimateS ?? 1), // 30 minute warning
						label: "Prepare for next run",
					},
					{
						value: timeToProgress(5 * 60, currentRun?.estimateS ?? 1), // 5 minute warning
						label: "Get ready!",
					},
				]}
			/>
			<span>{estimatedEndTime}</span>
		</div>
	);
}
