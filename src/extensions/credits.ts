import * as nodecgApiContext from "./nodecg-api-context.js";

import { getReplicant } from "./replicants.js";

const nodecg = nodecgApiContext.get();

const log = new nodecg.Logger("Credits");

const creditsRep = getReplicant("credits");

nodecg.listenFor("credits:update", (data) => {
	creditsRep.value = data;
});
