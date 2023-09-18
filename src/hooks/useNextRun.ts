import { useReplicant } from "use-nodecg";
import { RunDataActiveRunSurrounding, RunDataArray } from "@asm-graphics/types/RunData";

function useNextRun() {
	const [runDataActiveRunSurroundingRep] = useReplicant<RunDataActiveRunSurrounding>(
		"runDataActiveSurrounding",
		{},
		{
			namespace: "nodecg-speedcontrol",
		},
	);
	const [runDataArrayRep] = useReplicant<RunDataArray>("runDataArray", [], {
		namespace: "nodecg-speedcontrol",
	});

	return runDataArrayRep.find((run) => run.id === runDataActiveRunSurroundingRep.next);
}

export default useNextRun;
