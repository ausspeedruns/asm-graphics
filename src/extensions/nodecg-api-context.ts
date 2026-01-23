import type { ExtendedServerAPI } from "@asm-graphics/types/NodeCGExtension.js";

export interface ConfigSchema {
	obs?: {
		autoConnect?: boolean;
		port?: number;
		ip?: string;
		password?: string;
		customTransitionsFolder?: string;
	};
	tiltify?: {
		autoConnect?: boolean;
		key?: string;
		campaign?: string;
		id?: string;
	};
	graphql?: {
		url?: string;
		event?: string;
		apiKey?: string;
	};
	x32?: {
		autoConnect?: boolean;
		ip?: string;
	};
}

let context: ExtendedServerAPI<ConfigSchema>;

export function get(): ExtendedServerAPI<ConfigSchema> {
	return context;
}

export function set(ctx: ExtendedServerAPI<ConfigSchema>): void {
	context = ctx;
}
