import * as nodecgApiContext from './nodecg-api-context';

const nodecg = nodecgApiContext.get();

const hostNamesRep = nodecg.Replicant<string[]>('host-names', { defaultValue: [] });
const previewHostNamesRep = nodecg.Replicant<string[]>('preview-host-names', { defaultValue: [] });

nodecg.listenFor('update-hostnames', (names: string[]) => {
	hostNamesRep.value = names;
});

// Unused due to ux anti pattern
nodecg.listenFor('rename-hostnames', (data: {name: string, index: number}) => {
	const hostNamesMutable = hostNamesRep.value;
	hostNamesMutable[data.index] = data.name;
	hostNamesRep.value = hostNamesMutable;
});

nodecg.listenFor('remove-hostname', (index: number) => {
	const hostNamesMutable = hostNamesRep.value;
	hostNamesMutable.splice(index, 1);
	hostNamesRep.value = hostNamesMutable;
});

// Preview host names
nodecg.listenFor('update-preview-hostnames', (names: string[]) => {
	previewHostNamesRep.value = names;
});

nodecg.listenFor('remove-preview-hostname', (index: number) => {
	const hostNamesMutable = previewHostNamesRep.value;
	hostNamesMutable.splice(index, 1);
	previewHostNamesRep.value = hostNamesMutable;
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
