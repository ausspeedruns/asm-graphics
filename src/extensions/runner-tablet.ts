import * as nodecgApiContext from "./nodecg-api-context.js";

import { getReplicant } from "./replicants.js";

const runnerStatusRep = getReplicant("runner:ready");
const techStatusRep = getReplicant("tech:ready");

const nodecg = nodecgApiContext.get();

nodecg.listenFor("transition:toIntermission", () => {
	runnerStatusRep.value = false;
	techStatusRep.value = false;
});

nodecg.listenFor("runner:setReady", () => {
	runnerStatusRep.value = true;
});

nodecg.listenFor("runner:setNotReady", () => {
	runnerStatusRep.value = false;
});

// Shouldn't be here but WEEEEEEEEEEEEEEEEEEEEE
nodecg.listenFor("tech:setReady", () => {
	techStatusRep.value = true;
});

nodecg.listenFor("tech:setNotReady", () => {
	techStatusRep.value = false;
});
