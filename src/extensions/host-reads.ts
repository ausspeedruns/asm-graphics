import { hostReadsRep } from "./replicants";
import * as nodecgApiContext from "./nodecg-api-context";

export interface HostRead {
	id: string;
	title: string;
	content: string;
}

const nodecg = nodecgApiContext.get();

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
