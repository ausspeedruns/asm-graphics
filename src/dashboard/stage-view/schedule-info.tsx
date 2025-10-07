import { format, formatDistanceStrict } from "date-fns";
import { useReplicant } from "@nodecg/react-hooks";

import type { RunDataActiveRun } from "../../../bundles/nodecg-speedcontrol/src/types";
import useSurroundingRuns from "../../hooks/useSurroundingRuns";

interface ScheduleInfoProps {
	style?: React.CSSProperties;
}

export function ScheduleInfo(props: ScheduleInfoProps) {
	const [runStartTimeRep] = useReplicant<number | null>("runStartTime");
	const [runDataActiveRep] = useReplicant<RunDataActiveRun>("runDataActiveRun", { bundle: "nodecg-speedcontrol" });
	const [_, _1, nextRun] = useSurroundingRuns();
	
	let estimatedEndTime = "Error";
	if (runDataActiveRep?.estimateS) {
		if (runStartTimeRep) {
			estimatedEndTime = `Est End: ${format(runStartTimeRep + runDataActiveRep.estimateS * 1000, "h:mm b")}`;
		} else if (runDataActiveRep.scheduledS) {
			const isoTimeString = new Date(
				runDataActiveRep.scheduledS + runDataActiveRep.estimateS * 1000,
			).toISOString();
			console.log(runDataActiveRep.scheduledS, runDataActiveRep.estimateS, isoTimeString);
			estimatedEndTime = `Run should end at: ${format(runDataActiveRep.scheduledS + runDataActiveRep.estimateS * 1000, "h:mm b")}`;
		}
	} else {
		estimatedEndTime = "No estimate on run";
	}

	const differenceTime =
		runDataActiveRep?.scheduledS && runStartTimeRep
			? formatDistanceStrict(runStartTimeRep, runDataActiveRep?.scheduledS * 1000, {
					roundingMethod: "ceil",
					unit: "minute",
				})
			: "Run not started";

	return (
		<div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", ...props.style }}>
			<span>
				{runStartTimeRep ? (
					<>
						Run started at <b>{format(runStartTimeRep, "h:mm b")}</b>
					</>
				) : (
					"Run not started"
				)}
			</span>
			<span>{estimatedEndTime}</span>
			<span>
				We are {differenceTime}{" "}
				{runDataActiveRep?.scheduledS &&
				runStartTimeRep &&
				runStartTimeRep <= runDataActiveRep?.scheduledS * 1000
					? "AHEAD"
					: "BEHIND"}
			</span>
			<span>
				{nextRun?.scheduledS
					? `Next run starts at ${format(nextRun.scheduledS * 1000, "h:mm b")}`
					: "No next run"}
			</span>
		</div>
	);
}
