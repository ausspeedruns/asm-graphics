import type { RunDataPlayer, RunDataActiveRun } from "@asm-graphics/types/RunData";
import { createContext, useContext, useMemo } from "react";
import { useReplicant } from "@nodecg/react-hooks";

// Context to share person data across components without duplicate subscriptions
interface PersonDataContextValue {
	commentators: RunDataPlayer[];
	runners: RunDataPlayer[];
}

export const PersonDataContext = createContext<PersonDataContextValue | null>(null);

/**
 * Provider hook that subscribes to replicants once and provides data to children.
 * Use this at the top level of the component tree.
 */
export function usePersonDataProvider(): PersonDataContextValue {
	const [commentators] = useReplicant("commentators");
	const [runDataActive] = useReplicant<RunDataActiveRun>("runDataActiveRun", { bundle: "nodecg-speedcontrol" });

	return useMemo(() => ({
		commentators: commentators ?? [],
		runners: runDataActive?.teams.flatMap((team) => team.players) ?? [],
	}), [commentators, runDataActive]);
}

/**
 * Hook to get person data by ID without creating new subscriptions.
 * Must be used within a PersonDataContext.Provider.
 */
export function usePersonData(id: string): RunDataPlayer | undefined {
	const context = useContext(PersonDataContext);

	if (!context) {
		console.warn("usePersonData must be used within a PersonDataContext.Provider");
		return undefined;
	}

	const person = context.commentators.find((c) => c.id === id);
	if (person) return person;

	const runner = context.runners.find((p) => p.id === id);
	if (runner) return runner;

	return undefined;
}
