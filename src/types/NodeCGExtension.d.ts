import type NodeCG from "@nodecg/types";
import type { NodeCGMessages } from "./NodeCGMessages";
import type { ConfigSchema } from "./ConfigSchema";
import { NodeCGAPIClient } from "@nodecg/types/client/api/api.client";

type NeverKeys<T> = { [K in keyof T]: T[K] extends never ? K : never }[keyof T];
type SendMessageCb<T> = (error?: unknown, response?: T) => void;

export interface ExtendedServerAPI<T> extends NodeCG.ServerAPI<T> {
	listenFor<E extends keyof NodeCGMessages>(messageName: E, handlerFunc: (data: NodeCGMessages[E], ack?: Acknowledgement) => void): void;

	sendMessage<E extends NeverKeys<NodeCGMessages>>(messageName: E): void;
	sendMessage<E extends keyof NodeCGMessages>(messageName: E, data: NodeCGMessages[E]): void;
}

export interface ExtendedClientAPI<T> extends NodeCGAPIClient<T> {
	sendMessage<E extends NeverKeys<NodeCGMessages>>(messageName: E, cb: SendMessageCb<unknown>): void;
	sendMessage<E extends keyof NodeCGMessages>(messageName: E, data: NodeCGMessages[E], cb: SendMessageCb<unknown>): void;

	sendMessage<E extends NeverKeys<NodeCGMessages>>(messageName: E): Promise<never>;
	sendMessage<E extends keyof NodeCGMessages, T>(messageName: E, data: NodeCGMessages[E]): Promise<unknown>;
}

declare global {
	let NodeCG: typeof ExtendedClientAPI<ConfigSchema>;
	let nodecg: ExtendedClientAPI<ConfigSchema>;
}
