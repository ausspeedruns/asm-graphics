import { useEffect } from "react";
import usePrevious from "./usePrevious.js";

function useEffectDebugger(
	effectHook: React.EffectCallback,
	dependencies: React.DependencyList,
	dependencyNames: string[] = [],
) {
	const previousDeps = usePrevious<React.DependencyList>(dependencies ?? []);

	const changedDeps = dependencies.reduce((accumulator: Record<string, any>, dependency, index) => {
		if (dependency !== previousDeps?.[index]) {
			const keyName = dependencyNames[index] || index;
			return {
				...accumulator,
				[keyName]: {
					before: previousDeps?.[index],
					after: dependency,
				},
			};
		}

		return accumulator;
	}, {});

	if (Object.keys(changedDeps).length) {
		console.log("[use-effect-debugger] ", changedDeps);
	}

	useEffect(effectHook, [dependencies, effectHook]);
}

export default useEffectDebugger;
