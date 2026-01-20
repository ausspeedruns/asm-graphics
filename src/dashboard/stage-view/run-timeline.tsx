import { Slider } from "@mui/material";
import styles from "./run-timeline.module.css";
import { useReplicant } from "@nodecg/react-hooks";
import { formatDate, formatDistanceStrict } from "date-fns";

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

	const startTime = formatDate(runStartTimeRep?.[0] ?? 0, "h:mm a");
	const estimatedEndTimeDate =
		currentRun?.estimateS && runStartTimeRep?.[0] ? runStartTimeRep[0] + currentRun.estimateS * 1000 : 0;
	const estimatedEndTime = formatDate(estimatedEndTimeDate, "h:mm a");

	const progress = ((timerRep?.milliseconds ?? 0) / ((currentRun?.estimateS ?? 1) * 1000)) * 100;

	const infoTicks = [];
	const prepareTime = timeToProgress(30 * 60, currentRun?.estimateS ?? 1); // 30 minute warning
	const readyTime = timeToProgress(5 * 60, currentRun?.estimateS ?? 1); // 5 minute warning

	if (prepareTime > 0) {
		infoTicks.push({
			value: prepareTime,
			label: "Prepare for next run",
		});
	}

	if (prepareTime <= 0 && readyTime > 0) {
		infoTicks.push({
			value: readyTime,
			label: "Prepare and get ready!",
		});
	}

	if (readyTime > 0) {
		infoTicks.push({
			value: readyTime,
			label: "Get ready!",
		});
	}

	// Determine schedule status based on runStartTimeRep state
	// [null, null] = never started, just initialized
	// [startTime, null] = run is ongoing
	// [startTime, endTime] = previous run ended, setting up next run
	const renderScheduleStatus = () => {
		const runStartTime = runStartTimeRep?.[0];
		const runEndTime = runStartTimeRep?.[1];

		// Never started a run - just initialized
		if (runStartTime == null && runEndTime == null) {
			return <span>Waiting to start first run</span>;
		}

		// We have a start time - check against scheduled time
		if (runStartTime != null && currentRun?.scheduledS) {
			const scheduledMs = currentRun.scheduledS * 1000;
			const isAhead = runStartTime <= scheduledMs;
			const difference = formatDistanceStrict(runStartTime, scheduledMs, {
				roundingMethod: "ceil",
				unit: "minute",
			});

			if (runEndTime == null) {
				// Run is ongoing
				return (
					<span>
						This run started <b>{difference} {isAhead ? "AHEAD" : "BEHIND"}</b> of schedule
					</span>
				);
			} else {
				// Previous run ended, setting up next
				// Calculate how much over/under estimate the run went
				const actualDurationMs = runEndTime - runStartTime;
				const estimateMs = (currentRun.estimateS ?? 0) * 1000;
				const isUnderEstimate = actualDurationMs <= estimateMs;
				const estimateDifference = formatDistanceStrict(actualDurationMs, estimateMs, {
					roundingMethod: "ceil",
					unit: "minute",
				});

				return (
					<span>
						Last run ended <b>{difference} {isAhead ? "AHEAD" : "BEHIND"}</b> of schedule
						{" · "}
						<b>{estimateDifference} {isUnderEstimate ? "UNDER" : "OVER"}</b> estimate
					</span>
				);
			}
		}

		// Fallback - we have start time but no scheduled time
		if (runStartTime != null) {
			return <span>{runEndTime == null ? "Run in progress" : "Setting up next run"}</span>;
		}

		return <span>Setting up</span>;
	};

	return (
		<div className={styles.container}>
			<div className={styles.timeline}>
				<span>{startTime}</span>
				<Slider
					value={progress}
					min={0}
					max={100}
					color="secondary"
					className={styles.progressBar}
					disabled
					slots={{ thumb: RunnerSliderThumb }}
					marks={infoTicks}
				/>
				<span>{estimatedEndTime}</span>
			</div>

			<div className={styles.infoRow}>
				{renderScheduleStatus()}
			</div>
		</div>
	);
}
