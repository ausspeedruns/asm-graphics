import * as nodecgApiContext from "./nodecg-api-context.js";
import { getReplicant } from "./replicants.js"

const nodecg = nodecgApiContext.get();
const log = new nodecg.Logger("Ticker");

const tickerOrder = getReplicant("ticker:order");

nodecg.listenFor("ticker:set-order", (order) => {
	log.info("Setting ticker order:", order);
	tickerOrder.value = order;
});
