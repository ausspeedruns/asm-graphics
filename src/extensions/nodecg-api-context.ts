"use strict";

import type NodeCG from "@nodecg/types";
import type { ConfigSchema } from "@asm-graphics/types/ConfigSchema";

let context: NodeCG.ServerAPI<ConfigSchema>;

export function get(): NodeCG.ServerAPI<ConfigSchema> {
	return context;
}

export function set(ctx: NodeCG.ServerAPI<ConfigSchema>): void {
	context = ctx;
}
