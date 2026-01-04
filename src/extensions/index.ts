import type { ConfigSchema } from "@asm-graphics/types/ConfigSchema.js";
import * as nodecgApiContext from "./nodecg-api-context.js";
import type { ExtendedServerAPI } from "@asm-graphics/types/NodeCGExtension.js";

module.exports = async (nodecg: ExtendedServerAPI<ConfigSchema>) => {
	// Store a reference to this nodecg API context in a place where other libs can easily access it.
	// This must be done before any other files are `require`d.
	nodecgApiContext.set(nodecg);
	await init().catch((error) => {
		nodecg.log.error("Failed to initialize:", error);
	});

	nodecg.log.info("Initialization successful.");
};
	
async function init() {
	require("./replicants");

	// The order of these is literally just the chronological order of when they were made, a.k.a the best way to watch Star Wars
	require("./game-audio-indicators");
	require("./obs-local");
	require("./commentators");
	require("./tiltify-v5");
	require("./incentives");
	require("./donations");
	require("./schedule-import");
	require("./ausspeedruns-website");
	require("./x32-audio");
	require("./runner-tablet");
	require("./game-years");
	require("./on-screen-warnings");
	require("./prizes");
	require("./bingo");
	require("./host-reads");
	require("./intermission-videos");
	require("./full-screen-data");
	require("./speedcontrol-converter");
}
