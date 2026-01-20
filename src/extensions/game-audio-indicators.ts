import type { RunData, RunDataActiveRun } from "@asm-graphics/types/RunData.js";
import * as nodecgApiContext from "./nodecg-api-context.js";

import { getReplicant } from "./replicants.js";

const nodecg = nodecgApiContext.get();
const log = new nodecg.Logger("Audio");

const gameAudioActiveRep = getReplicant("game-audio-indicator");

const runDataActiveRunRep = nodecg.Replicant<RunDataActiveRun>("runDataActiveRun", "nodecg-speedcontrol");

nodecg.listenFor("changeGameAudio", (data) => {
	log.info(`Updating Game Audio ${data.manual ? "manually" : "automatically"} to runner id ${data.id}.`);

	if (data.manual) {
		log.trace(`Manually setting gameAudioActiveRep to ${data.id}`);
		gameAudioActiveRep.value = data.id;
		return;
	}

	// nodecg.sendMessage("x32:changeGameAudio", data.id); TODO: Implement X32 automatic switching
});

runDataActiveRunRep.on("change", (newVal, oldVal) => {
	if (newVal?.id === oldVal?.id) {
		return;
	}

	// Get the first runner's id to set as game audio
	const firstRunner = newVal?.teams.flatMap((team) => team.players)[0];

	gameAudioActiveRep.value = firstRunner?.id ?? "";
});
