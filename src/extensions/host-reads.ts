import { getReplicant } from "./replicants.js";
import * as nodecgApiContext from "./nodecg-api-context.js";
import type { HostRead } from "@asm-graphics/shared/HostRead.js";

const nodecg = nodecgApiContext.get();

const hostReadsRep = getReplicant("host-reads");

nodecg.listenFor("host-reads:add", (data: HostRead) => {
	const newData = [...hostReadsRep.value, data];
	hostReadsRep.value = newData;
});

nodecg.listenFor("host-reads:remove", (id: string) => {
	const newData = hostReadsRep.value.filter((read) => read.id !== id);
	hostReadsRep.value = newData;
});

nodecg.listenFor("host-reads:update", (data: HostRead) => {
	const newData = hostReadsRep.value.map((read) => {
		if (read.id === data.id) {
			return data;
		}

		return read;
	});

	hostReadsRep.value = newData;
});
