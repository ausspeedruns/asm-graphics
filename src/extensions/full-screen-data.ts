import * as nodecgApiContext from "./nodecg-api-context.js";
import { lowerThirdPersonRep } from "./replicants.js";

export interface LowerThirdPerson {
	name: string;
	title: string;
}

const nodecg = nodecgApiContext.get();

nodecg.listenFor("lowerthird:save-person", (person) => {
	lowerThirdPersonRep.value = person;
});
