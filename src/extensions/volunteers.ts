import * as nodecgApiContext from "./nodecg-api-context.js";

import { getReplicant } from "./replicants.js";

const nodecg = nodecgApiContext.get();
export interface VolunteerShift {
	day: string;
	start: string;
	end: string;
	color: string | null;
}

export interface VolunteerEntry {
	name: string;
	shifts: VolunteerShift[];
}
const log = new nodecg.Logger("Volunteers");

const volunteersRep = getReplicant("volunteers");

nodecg.listenFor("volunteers:update", (volunteers) => {
	log.info("Updating volunteers list");
	volunteersRep.value = volunteers;
});
