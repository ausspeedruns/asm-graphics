import * as nodecgApiContext from "./nodecg-api-context";
import { lowerThirdPersonRep } from "./replicants";

export interface LowerThirdPerson {
	name: string;
	title: string;
}

const nodecg = nodecgApiContext.get();

nodecg.listenFor("lowerthird:save-person", (person) => {
	lowerThirdPersonRep.value = person;
});
