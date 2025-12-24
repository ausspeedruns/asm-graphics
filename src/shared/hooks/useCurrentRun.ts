import { useReplicant } from "@nodecg/react-hooks";
import type { RunDataActiveRunSurrounding, RunDataArray } from "@asm-graphics/types/RunData.js";

function useCurrentRun() {
	const [runDataActiveRunSurroundingRep] = useReplicant<RunDataActiveRunSurrounding>("runDataActiveSurrounding", {
		bundle: "nodecg-speedcontrol",
	});
	const [runDataArrayRep] = useReplicant<RunDataArray>("runDataArray", {
		bundle: "nodecg-speedcontrol",
	});

	return (runDataArrayRep ?? []).find((run) => run.id === runDataActiveRunSurroundingRep?.current);
}

export default useCurrentRun;
