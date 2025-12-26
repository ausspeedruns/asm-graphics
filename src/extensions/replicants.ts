import type NodeCG from "nodecg/types";
import * as nodecgApiContext from "./nodecg-api-context.js";

import { replicants, type ReplicantName, type ReplicantType } from "@asm-graphics/shared/replicants.js";

const nodecg = nodecgApiContext.get();

nodecg.log.info("Setting up replicants");

// Auto make replicants
for (const [replicantName, defaultValue] of Object.entries(replicants)) {
	if (typeof defaultValue === "object") {
		nodecg.Replicant(replicantName, { ...defaultValue });
	} else {
		nodecg.Replicant(replicantName, { defaultValue });
	}
}

type StrictReplicant<T> = Omit<NodeCG.default.ServerReplicant<T>, 'value'> & { value: T };

export function getReplicant<E extends ReplicantName>(name: E) {
	return nodecg.Replicant<ReplicantType<E>>(name) as StrictReplicant<ReplicantType<E>>;
}
