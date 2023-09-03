import * as nodecgApiContext from "../nodecg-api-context";
import OBSWebSocket, { EventSubscription } from "obs-websocket-js";

import type { ConnectionStatus } from "@asm-graphics/types/Connections";

const nodecg = nodecgApiContext.get();
const ncgOBSConfig = nodecg.bundleConfig.obs;
const obsConnectionRep = nodecg.Replicant<ConnectionStatus>("obs:status");

const obs = new OBSWebSocket();

async function connect(): Promise<void> {
	try {
		const { obsWebSocketVersion, negotiatedRpcVersion } = await obs.connect(
			`ws://${ncgOBSConfig.ip}:${ncgOBSConfig.port}`,
			ncgOBSConfig.password,
			{
				eventSubscriptions: EventSubscription.All | EventSubscription.InputVolumeMeters,
				rpcVersion: 1,
			},
		);

		nodecg.log.info(
			`[OBS] Connection successful | Version ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`,
		);
		obsConnectionRep.value = "connected";
	} catch (err) {
		// nodecg.log.warn('[OBS] Connection error');
		nodecg.log.warn("[OBS] Connection error:", err);
		obsConnectionRep.value = "disconnected";
	}
}

if (ncgOBSConfig.enabled) {
	nodecg.log.info("[OBS] Setting up connection");
	connect();
	obs.on("ConnectionClosed", () => {
		nodecg.log.warn("[OBS] Connection lost, retrying in 5 seconds");
		obsConnectionRep.value = "disconnected";
		setTimeout(connect, 5000);
	});

	obs.on("ConnectionError", (err) => {
		// nodecg.log.warn('[OBS] Connection error');
		nodecg.log.warn("[OBS] Connection error:", err);
		obsConnectionRep.value = "disconnected";
	});
}

export default obs;
