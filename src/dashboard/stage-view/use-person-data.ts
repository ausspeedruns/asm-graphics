import type { RunDataPlayer, RunDataActiveRun } from "@asm-graphics/types/RunData";
import { useReplicant } from "@nodecg/react-hooks";

export function usePersonData(id: string): RunDataPlayer | undefined {
	const [commentators] = useReplicant("commentators");
	const [runDataActive] = useReplicant<RunDataActiveRun>("runDataActiveRun", { bundle: "nodecg-speedcontrol" });

	if (commentators) {
		const person = commentators.find((c: RunDataPlayer) => c.id === id);
		if (person) return person;
	}

	if (runDataActive) {
		for (const team of runDataActive.teams) {
			const player = team.players.find((p) => p.id === id);
			if (player) return player;
		}
	}

	return undefined;
}
