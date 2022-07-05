import * as nodecgApiContext from './nodecg-api-context';
import { CouchInformation, CouchPerson, NoCam } from '../types/OverlayProps';

const nodecg = nodecgApiContext.get();

const couchNamesRep = nodecg.Replicant<CouchInformation>('couch-names');
const noCamRep = nodecg.Replicant<NoCam>('no-cam');

nodecg.listenFor('update-hostname', (data: CouchPerson) => {
	// hostNameRep.value = data;
	const hostNamesMutable = couchNamesRep.value;
	const hostNameIndex = hostNamesMutable.current.findIndex(couch => couch.host);
	if (hostNameIndex > -1)	hostNamesMutable.current.splice(hostNameIndex, 1);
	hostNamesMutable.current.push(data);
	couchNamesRep.value = hostNamesMutable;
});

nodecg.listenFor('update-hostnames', (names: CouchPerson[]) => {
	couchNamesRep.value.current = names;
});

// Unused due to ux anti pattern
nodecg.listenFor('rename-hostnames', (data: {person: CouchPerson, index: number}) => {
	const hostNamesMutable = couchNamesRep.value;
	hostNamesMutable.current[data.index] = data.person;
	couchNamesRep.value = hostNamesMutable;
});

nodecg.listenFor('remove-hostname', (index: number) => {
	const hostNamesMutable = couchNamesRep.value;
	hostNamesMutable.current.splice(index, 1);
	couchNamesRep.value = hostNamesMutable;
});

// Preview host names
nodecg.listenFor('update-preview-hostnames', (names: CouchPerson[]) => {
	couchNamesRep.value.preview = names;
});

nodecg.listenFor('remove-preview-hostname', (index: number) => {
	const hostNamesMutable = couchNamesRep.value;
	hostNamesMutable.preview.splice(index, 1);
	couchNamesRep.value = hostNamesMutable;
});

nodecg.listenFor('no-cam-preview', (value: boolean) => {
	noCamRep.value.preview = value;
});

nodecg.listenFor('no-cam-current', (value: boolean) => {
	noCamRep.value.current = value;
});

nodecg.listenFor('set-discord-user-preview', (person: CouchPerson) => {
	const index = couchNamesRep.value.preview.findIndex(couch => couch.name === person.name);
	if (index === -1) return;
	couchNamesRep.value.preview[index] = person;
});

nodecg.listenFor('set-discord-user-live', (person: CouchPerson) => {
	const index = couchNamesRep.value.current.findIndex(couch => couch.name === person.name);
	if (index === -1) return;
	couchNamesRep.value.current[index] = person;
});
