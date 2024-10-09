import type { ConfigSchema } from "@asm-graphics/types/ConfigSchema";
import * as nodecgApiContext from "./nodecg-api-context";
import { ExtendedServerAPI } from "@asm-graphics/types/NodeCGExtension";

let ncgConfig: ExtendedServerAPI<ConfigSchema>["bundleConfig"];

module.exports = (nodecg: ExtendedServerAPI<ConfigSchema>) => {
	// Store a reference to this nodecg API context in a place where other libs can easily access it.
	// This must be done before any other files are `require`d.
	nodecgApiContext.set(nodecg);
	ncgConfig = nodecg.bundleConfig;
	init()
		.then(() => {
			nodecg.log.info("Initialization successful.");
		})
		.catch((error) => {
			nodecg.log.error("Failed to initialize:", error);
		});
};

async function init() {
	const nodecg = nodecgApiContext.get();

	require("./replicants");

	// The order of these is literally just the chronological order of when they were made, a.k.a the best way to watch Star Wars

	require("./audio");

	if (ncgConfig.obs.enabled) {
		// require('./util/obs');
		require("./obs-local");
	}

	require("./commentators");

	if (ncgConfig?.tiltify?.enabled) {
		// require('./donations/tiltify');
		require("./donations/tiltify-v5");
	}

	require("./incentives");
	require("./staff-messages");
	require("./donations");
	require("./schedule-import");
	require("./ausspeedruns-website");

	if (ncgConfig.x32?.enabled) {
		require("./x32-audio");
	}

	require("./runner-tablet");
	require("./game-years");
	require("./on-screen-warnings");
}
