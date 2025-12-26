import { NodeCGMessages } from "./NodeCGMessages";
import { ReplicantType, type ReplicantName } from "../replicants.ts";
import { UseListenForOptions } from "@nodecg/react-hooks";

declare module "@nodecg/react-hooks" {
	function useListenFor<E extends keyof NodeCGMessages>(
		messageName: E,
		handler: (message: NodeCGMessages[E]) => void,
		options?: UseListenForOptions,
	): void;

	function useListenFor<T>(
		messageName: string,
		handler: (message: T) => void,
		{ bundle }?: UseListenForOptions,
	): void;

	function useReplicant<E extends ReplicantName>(
		replicantName: E,
	): readonly [
		ReplicantType<E> | undefined,
		(newValue: ReplicantType<E> | ((oldValue?: ReplicantType<E> | undefined) => void)) => void,
	];

	function useReplicant<V, T = V>(
		replicantName: string,
		{ bundle }: { bundle?: string },
	): readonly [T | undefined, (newValue: T | ((oldValue?: T | undefined) => void)) => void];
}

// const useListenFor: <T>(messageName: string, handler: (message: T) => void, { bundle }?: UseListenForOptions) => void;
// const useReplicant: <V, T = Jsonify<V>>(replicantName: string, { bundle, defaultValue, persistent }?: UseReplicantOptions<T>) => readonly [T | undefined, (newValue: T | ((oldValue?: T | undefined) => void)) => void];
