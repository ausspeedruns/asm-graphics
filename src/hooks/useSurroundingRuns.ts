import { useReplicant } from "@nodecg/react-hooks";
import type { RunData, RunDataActiveRunSurrounding, RunDataArray } from "../types/RunData";

function useSurroundingRuns(): readonly [RunData | undefined, RunData | undefined, RunData | undefined] {
	const [runDataActiveRunSurroundingRep] = useReplicant<RunDataActiveRunSurrounding>("runDataActiveRunSurrounding", {
		bundle: "nodecg-speedcontrol",
	});
	const [runDataArrayRep] = useReplicant<RunDataArray>("runDataArray", {
		bundle: "nodecg-speedcontrol",
	});

	const runArray = runDataArrayRep ?? [];

	return [
		runArray.find((run) => run.id === runDataActiveRunSurroundingRep?.previous),
		runArray.find((run) => run.id === runDataActiveRunSurroundingRep?.current),
		runArray.find((run) => run.id === runDataActiveRunSurroundingRep?.next),
	];
}

export default useSurroundingRuns;
