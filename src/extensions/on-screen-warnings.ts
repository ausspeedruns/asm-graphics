import * as nodecgApiContext from "./nodecg-api-context.js";

import { showOnScreenWarning, onScreenWarningMessage } from "./replicants.js";

const nodecg = nodecgApiContext.get();

const log = new nodecg.Logger("On-Screen Warnings");

nodecg.listenFor("onScreenWarning:setMessage", (message) => {
	log.info("Setting on-screen warning message to:", message);
	onScreenWarningMessage.value = message;
});

nodecg.listenFor("onScreenWarning:setShow", (show) => {
	log.info("Setting on-screen warning show to:", show);
	showOnScreenWarning.value = show;
});
