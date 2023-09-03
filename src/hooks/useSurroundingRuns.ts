import { useReplicant } from "use-nodecg";
import { RunData, RunDataActiveRunSurrounding, RunDataArray } from "@asm-graphics/types/RunData";

function useSurroundingRuns(): readonly [RunData | undefined, RunData | undefined, RunData | undefined] {
	const [runDataActiveRunSurroundingRep] = useReplicant<RunDataActiveRunSurrounding>(
		"runDataActiveRunSurrounding",
		{},
		{
			namespace: "nodecg-speedcontrol",
		},
	);
	const [runDataArrayRep] = useReplicant<RunDataArray>("runDataArray", [], {
		namespace: "nodecg-speedcontrol",
	});

	return [
		runDataArrayRep.find((run) => run.id === runDataActiveRunSurroundingRep.previous),
		runDataArrayRep.find((run) => run.id === runDataActiveRunSurroundingRep.current),
		runDataArrayRep.find((run) => run.id === runDataActiveRunSurroundingRep.next),
	];
}

export default useSurroundingRuns;
