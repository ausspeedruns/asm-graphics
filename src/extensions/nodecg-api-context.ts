'use strict';

import NodeCG from '@alvancamp/test-nodecg-types';

let context: NodeCG.ServerAPI;

export function get(): NodeCG.ServerAPI {
	return context;
}

export function set(ctx: NodeCG.ServerAPI): void {
	context = ctx;
}
