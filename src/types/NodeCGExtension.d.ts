import type NodeCG from "nodecg/types";
import type { NodeCGMessages } from "./NodeCGMessages";
import type { ConfigSchema } from "./ConfigSchema";
import type { NodeCGAPIClient } from "nodecg/out/client/api/api.client";

type NeverKeys<T> = { [K in keyof T]: T[K] extends never ? K : never }[keyof T];
type SendMessageCb<T> = (error?: unknown, response?: T) => void;

export interface ExtendedServerAPI<T extends Record<string, any>> extends NodeCG.ServerAPI<T> {
	listenFor<E extends keyof NodeCGMessages>(
		messageName: E | string, // Allow string for non-typed messages since we could be talking to an external bundle
		bundleName: string,
		handlerFunc: (data: unknown, ack?: NodeCG.Acknowledgement) => void,
	): void;
	listenFor<E extends keyof NodeCGMessages>(
		messageName: E,
		handlerFunc: (data: NodeCGMessages[E], ack?: NodeCG.Acknowledgement) => void,
	): void;

	sendMessage<E extends NeverKeys<NodeCGMessages>>(messageName: E): void;
	sendMessage<E extends keyof NodeCGMessages>(messageName: E, data: NodeCGMessages[E]): void;
}

export interface ExtendedClientAPI<T extends Record<string, any>> extends NodeCGAPIClient<T> {
	sendMessage<E extends NeverKeys<NodeCGMessages>>(messageName: E, cb: SendMessageCb<unknown>): void;
	sendMessage<E extends keyof NodeCGMessages>(
		messageName: E,
		data: NodeCGMessages[E],
		cb: SendMessageCb<unknown>,
	): void;

	sendMessage<E extends NeverKeys<NodeCGMessages>>(messageName: E): Promise<never>;
	sendMessage<E extends keyof NodeCGMessages, T>(messageName: E, data: NodeCGMessages[E]): Promise<unknown>;
}

declare global {
	let NodeCG: ExtendedClientAPI<ConfigSchema>;
	let nodecg: ExtendedClientAPI<ConfigSchema>;
}
