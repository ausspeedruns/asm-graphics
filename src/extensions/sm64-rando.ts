// This is a basic implementation, ideally this would be abstracted out to any sort of randomiser

import * as nodecgApiContext from "./nodecg-api-context";

import { sm64RandoRep } from "./replicants";

const nodecg = nodecgApiContext.get();
const log = new nodecg.Logger("Randomiser");

export type SM64MovementAbilities = {
	jump: boolean;
	tripleJump: boolean;
	sideFlip: boolean;
	longJump: boolean;
	kick: boolean;
	backFlip: boolean;
	groundPound: boolean;
	wallKick: boolean;
	climb: boolean;
	dive: boolean;
	grab: boolean;
	ledgeGrab: boolean;
	keyUpstairs: boolean;
	keyDownstairs: boolean;
	capMetal: boolean;
	capWing: boolean;
	capInvisibility: boolean;
};

nodecg.listenFor("rando:unlock", (msg) => {
	if (msg.game != "SM64-Movement") {
		log.warn(`Unknown game: ${msg.game}. Will still try though ofc.`);
	}

	if (msg.item in sm64RandoRep.value) {
		log.info(`Unlocking ${msg.item}!`);
		sm64RandoRep.value[msg.item as keyof SM64MovementAbilities] = true;
	} else {
		log.error(`Unknown item unlock: ${msg.item}`);
	}
});

nodecg.listenFor("rando:lock", (msg) => {
	if (msg.game != "SM64-Movement") {
		log.warn(`Unknown game: ${msg.game}. Will still try though ofc.`);
	}

	if (msg.item in sm64RandoRep.value) {
		log.info(`Locking ${msg.item}. Whoops!`);
		sm64RandoRep.value[msg.item as keyof SM64MovementAbilities] = false;
	} else {
		log.error(`Unknown item unlock: ${msg.item}`);
	}
});
