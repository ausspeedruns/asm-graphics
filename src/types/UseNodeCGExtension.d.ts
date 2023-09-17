import { NodeCGMessages } from "./NodeCGMessages";

declare module "use-nodecg" {
	function useListenFor<E extends keyof NodeCGMessages>(messageName: E, handler: (message: NodeCGMessages[E]) => void, options?: UseListenForOptions): void;
	function useListenFor<T>(messageName: string, handler: (message: T) => void, options?: UseListenForOptions): void;
}
