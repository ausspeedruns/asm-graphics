import { NodeCGMessages } from "./NodeCGMessages";
import { UseListenForOptions } from "@nodecg/react-hooks";

declare module "@nodecg/react-hooks" {
    function useListenFor<E extends keyof NodeCGMessages>(messageName: E, handler: (message: NodeCGMessages[E]) => void, options?: UseListenForOptions): void;
    function useListenFor<T>(messageName: string, handler: (message: T) => void, { bundle }?: UseListenForOptions): void;
}

// const useListenFor: <T>(messageName: string, handler: (message: T) => void, { bundle }?: UseListenForOptions) => void;
