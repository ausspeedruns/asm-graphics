import * as nodecgApiContext from "./nodecg-api-context";

import { staffMessagesRep } from "./replicants";

const nodecg = nodecgApiContext.get();

nodecg.listenFor("staff-sendMessage", (msg) => {
	staffMessagesRep.value.push(msg);
});
