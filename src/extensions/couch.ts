import * as nodecgApiContext from './nodecg-api-context';
import type { CouchPerson } from '@asm-graphics/types/OverlayProps';
import type { RunDataActiveRun } from '@asm-graphics/types/RunData';
import type NodeCG from '@alvancamp/test-nodecg-types';

const nodecg = nodecgApiContext.get();

const couchNamesRep = nodecg.Replicant('couch-names') as unknown as NodeCG.ServerReplicantWithSchemaDefault<CouchPerson[]>;
const SPEEDCONTROL_runDataActiveRep = nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol') as unknown as NodeCG.ServerReplicantWithSchemaDefault<RunDataActiveRun>;

nodecg.listenFor('update-hostname', (data: CouchPerson) => {
	// hostNameRep.value = data;
	const hostNamesMutable = couchNamesRep.value;
	const hostNameIndex = hostNamesMutable.findIndex(couch => couch.host);
	if (hostNameIndex > -1) hostNamesMutable.splice(hostNameIndex, 1);
	hostNamesMutable.push({ ...data, host: true });
	couchNamesRep.value = hostNamesMutable;
});

nodecg.listenFor('update-hostnames', (names: CouchPerson[]) => {
	couchNamesRep.value = names;
});

nodecg.listenFor('rename-couch', (data: CouchPerson) => {
	const hostNamesMutable = [...couchNamesRep.value];
	const index = hostNamesMutable.findIndex(couch => couch.id === data.id);
	if (index === -1) {
		hostNamesMutable.push(data);
	} else {
		hostNamesMutable[index] = data;
	}
	couchNamesRep.value = hostNamesMutable;
});

nodecg.listenFor('remove-hostname', (id: string) => {
	const hostNamesMutable = [...couchNamesRep.value];

	const index = hostNamesMutable.findIndex(couch => couch.id === id);
	if (index === -1) {
		hostNamesMutable.splice(index, 1);
	} else {
		nodecg.log.error(`[Couch] Could not find ${id} to remove from list.`);
	}

	couchNamesRep.value = hostNamesMutable;
});

// Clear on new run
SPEEDCONTROL_runDataActiveRep.on('change', (newVal, oldVal) => {
	if (newVal?.id === oldVal?.id) return;

	// Clear all names except for the host
	couchNamesRep.value = couchNamesRep.value.filter(names => names.host);
})
