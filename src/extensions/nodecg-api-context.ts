"use strict";

import type { ConfigSchema } from "@asm-graphics/types/ConfigSchema";
import type { ExtendedServerAPI } from "@asm-graphics/types/NodeCGExtension";

let context: ExtendedServerAPI<ConfigSchema>;

export function get(): ExtendedServerAPI<ConfigSchema> {
	return context;
}

export function set(ctx: ExtendedServerAPI<ConfigSchema>): void {
	context = ctx;
}
