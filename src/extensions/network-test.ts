import * as nodecgApiContext from "./nodecg-api-context.js";
import { createConnection } from "node:net";

import { getReplicant } from "./replicants.js";

const nodecg = nodecgApiContext.get();

const log = new nodecg.Logger("Network Test");

const networkTestRep = getReplicant("network-test");

export interface NetworkTestResult {
	twitch: boolean;
	youtube: boolean;
	timestamp: number;
}

nodecg.listenFor("network-test:start", () => {
	void startNetworkTest();
});

function checkTcpConnection(host: string, port: number): Promise<boolean> {
	return new Promise((resolve) => {
		const socket = createConnection({ host, port });
		socket.setTimeout(5000);
		socket.once("connect", () => {
			socket.destroy();
			resolve(true);
		});
		socket.once("error", () => resolve(false));
		socket.once("timeout", () => {
			socket.destroy();
			resolve(false);
		});
	});
}

async function startNetworkTest() {
	log.info("Starting Network Test");
	networkTestRep.value = { twitch: false, youtube: false, timestamp: Date.now() };

	const [twitch, youtube] = await Promise.all([
		checkTcpConnection("aps20.contribute.live-video.net", 1935),
		checkTcpConnection("a.rtmp.youtube.com", 443),
	]);

	networkTestRep.value = { twitch, youtube, timestamp: Date.now() };

	if (twitch) {
		log.info("Twitch Sydney is reachable via RTMP");
	} else {
		log.warn("No connectivity to Sydney Twitch servers via RTMP");
	}

	if (youtube) {
		log.info("YouTube is reachable via RTMPS");
	} else {
		log.warn("YouTube is not reachable via RTMPS");
	}
}

// Do a test immediately on load
startNetworkTest();
