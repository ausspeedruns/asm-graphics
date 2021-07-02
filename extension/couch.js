"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodecgApiContext = tslib_1.__importStar(require("./nodecg-api-context"));
const nodecg = nodecgApiContext.get();
const couchNamesRep = nodecg.Replicant('couch-names');
nodecg.listenFor('update-hostnames', (names) => {
    couchNamesRep.value.current = names;
});
// Unused due to ux anti pattern
nodecg.listenFor('rename-hostnames', (data) => {
    const hostNamesMutable = couchNamesRep.value;
    hostNamesMutable.current[data.index] = data.person;
    couchNamesRep.value = hostNamesMutable;
});
nodecg.listenFor('remove-hostname', (index) => {
    const hostNamesMutable = couchNamesRep.value;
    hostNamesMutable.current.splice(index, 1);
    couchNamesRep.value = hostNamesMutable;
});
// Preview host names
nodecg.listenFor('update-preview-hostnames', (names) => {
    couchNamesRep.value.preview = names;
});
nodecg.listenFor('remove-preview-hostname', (index) => {
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
