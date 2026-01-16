import { useReplicant } from "@nodecg/react-hooks";
import { type RunDataActiveRun } from "@asm-graphics/types/RunData.js";

function useCurrentRun() {
	const [runDataActiveRep] = useReplicant<RunDataActiveRun>("runDataActiveRun", { bundle: "nodecg-speedcontrol" });
	return runDataActiveRep;
}

export default useCurrentRun;
