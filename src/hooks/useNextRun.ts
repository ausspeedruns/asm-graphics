import { useReplicant } from "@nodecg/react-hooks";
import { RunDataActiveRunSurrounding, RunDataArray } from "../types/RunData";

function useNextRun() {
	const [runDataActiveRunSurroundingRep] = useReplicant<RunDataActiveRunSurrounding>("runDataActiveSurrounding", {
		bundle: "nodecg-speedcontrol",
	});
	const [runDataArrayRep] = useReplicant<RunDataArray>("runDataArray", {
		bundle: "nodecg-speedcontrol",
	});

	return (runDataArrayRep ?? []).find((run) => run.id === runDataActiveRunSurroundingRep?.next);
}

export default useNextRun;
