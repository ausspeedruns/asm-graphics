import * as nodecgApiContext from "./nodecg-api-context.js";
import { getReplicant } from "./replicants.js";

const nodecg = nodecgApiContext.get();

const log = new nodecg.Logger("Prizes");

const prizesRep = getReplicant("prizes");

export interface Prize {
	id: string;
	requirement: string;
	requirementSubheading?: string;
	quantity?: number;
	item: string;
	subItem?: string;
}

nodecg.listenFor("prizes:ReorderPrizes", (prizes) => {
	log.info("Reordering Prizes:", prizes);
	prizesRep.value = prizes;
});

nodecg.listenFor("prizes:NewPrize", (prize) => {
	log.info("Adding new prize:", prize);
	prizesRep.value = [...prizesRep.value, prize];
});

nodecg.listenFor("prizes:RemovePrize", (prizeId) => {
	log.info("Removing prize:", prizeId);
	prizesRep.value = prizesRep.value.filter((prize) => prize.id !== prizeId);
});

nodecg.listenFor("prizes:UpdatePrize", (updatedPrize) => {
	log.info("Updating prize:", updatedPrize);
	prizesRep.value = prizesRep.value.map((prize) => (prize.id === updatedPrize.id ? updatedPrize : prize));
});
