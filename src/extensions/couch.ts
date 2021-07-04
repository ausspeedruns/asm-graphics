import * as nodecgApiContext from './nodecg-api-context';
import { CouchInformation, CouchPerson, NoCam } from '../types/OverlayProps';

const nodecg = nodecgApiContext.get();

const couchNamesRep = nodecg.Replicant<CouchInformation>('couch-names');
const noCamRep = nodecg.Replicant<NoCam>('no-cam');

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

nodecg.listenFor('no-cam-preview', (value) => {
	noCamRep.value.preview = value;
});

nodecg.listenFor('no-cam-current', (value) => {
	noCamRep.value.current = value;
});
