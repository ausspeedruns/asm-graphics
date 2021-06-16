import * as nodecgApiContext from './nodecg-api-context';
import { CouchInformation } from '../types/OverlayProps';

const nodecg = nodecgApiContext.get();

const couchNamesRep = nodecg.Replicant<CouchInformation>('couch-names', { defaultValue: {current: [], preview: []} });

nodecg.listenFor('update-hostnames', (names: string[]) => {
	couchNamesRep.value.current = names;
});

// Unused due to ux anti pattern
nodecg.listenFor('rename-hostnames', (data: {name: string, index: number}) => {
	const hostNamesMutable = couchNamesRep.value;
	hostNamesMutable.current[data.index] = data.name;
	couchNamesRep.value = hostNamesMutable;
});

nodecg.listenFor('remove-hostname', (index: number) => {
	const hostNamesMutable = couchNamesRep.value;
	hostNamesMutable.current.splice(index, 1);
	couchNamesRep.value = hostNamesMutable;
});

// Preview host names
nodecg.listenFor('update-preview-hostnames', (names: string[]) => {
	couchNamesRep.value.preview = names;
});

nodecg.listenFor('remove-preview-hostname', (index: number) => {
	const hostNamesMutable = couchNamesRep.value;
	hostNamesMutable.preview.splice(index, 1);
	couchNamesRep.value = hostNamesMutable;
});

// obsProgramRep.on('change', (newVal, oldVal) => {
// 	if (oldVal) {
// 		// Don't change lists if only going to intermission
// 		if (newVal?.name === 'Intermission') return;

// 		// Clone arrays
// 		const oldProgram = hostNamesRep.value.slice(0);
// 		const oldPreview = previewHostNamesRep.value.slice(0);

// 		hostNamesRep.value = oldPreview;
// 		previewHostNamesRep.value = oldProgram;

// 	}
// });
