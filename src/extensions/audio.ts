import * as nodecgApiContext from "./nodecg-api-context";

import { gameAudioActiveRep, x32StatusRep } from "./replicants";

const nodecg = nodecgApiContext.get();
const log = new nodecg.Logger("Audio");

nodecg.listenFor("changeGameAudio", data => {
	log.info(`Updating Game Audio ${data.manual ? "manually" : "automatically"} to index ${data.index}.`);

	if (data.manual) {
		log.trace(`Manually setting gameAudioActiveRep to ${data.index}`);
		gameAudioActiveRep.value = data.index;
		return;
	}

	if (x32StatusRep.value == "connected") {
		nodecg.sendMessage("x32:changeGameAudio", data.index);
	}
});
