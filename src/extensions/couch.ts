import * as nodecgApiContext from "./nodecg-api-context";

import { commentatorsRep, hostRep } from "./replicants";

import type { RunDataActiveRun } from "@asm-graphics/types/RunData";
import type NodeCG from "@nodecg/types";

const nodecg = nodecgApiContext.get();

const SPEEDCONTROL_runDataActiveRep = nodecg.Replicant(
	"runDataActiveRun",
	"nodecg-speedcontrol",
) as unknown as NodeCG.ServerReplicantWithSchemaDefault<RunDataActiveRun>;

nodecg.listenFor("update-hostname", (data) => {
	// hostNameRep.value = data;
	hostRep.value = data;
});

nodecg.listenFor("update-hostnames", (names) => {
	commentatorsRep.value = names;
});

nodecg.listenFor("rename-couch", (data) => {
	const hostNamesMutable = [...commentatorsRep.value];
	const index = hostNamesMutable.findIndex((couch) => couch.id === data.id);
	if (index === -1) {
		hostNamesMutable.push(data);
	} else {
		hostNamesMutable[index] = data;
	}
	commentatorsRep.value = hostNamesMutable;
});

nodecg.listenFor("remove-hostname", (id) => {
	const hostNamesMutable = [...commentatorsRep.value];

	const index = hostNamesMutable.findIndex((couch) => couch.id === id);
	if (index === -1) {
		hostNamesMutable.splice(index, 1);
	} else {
		nodecg.log.error(`[Couch] Could not find ${id} to remove from list.`);
	}

	commentatorsRep.value = hostNamesMutable;
});

// Clear on new run
SPEEDCONTROL_runDataActiveRep.on("change", (newVal, oldVal) => {
	if (newVal?.id === oldVal?.id) return;

	commentatorsRep.value = [];
});
