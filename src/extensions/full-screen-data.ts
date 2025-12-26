import * as nodecgApiContext from "./nodecg-api-context.js";
import { getReplicant } from "./replicants.js";

const nodecg = nodecgApiContext.get();

const lowerthirdPersonRep = getReplicant("lowerThirdPerson");

nodecg.listenFor("lowerthird:save-person", (person) => {
	lowerthirdPersonRep.value = person;
});
