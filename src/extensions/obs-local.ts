import { EventSubscription, OBSWebSocket } from "obs-websocket-js";
import * as nodecgApiContext from "./nodecg-api-context.js";
import { getReplicant } from "./replicants.js";
import type { ConnectionStatus } from "@asm-graphics/shared/replicants.js";

const nodecg = nodecgApiContext.get();
const log = new nodecg.Logger("OBS-Local");

const obsStatusRep = getReplicant("obs:status");
const obsCurrentSceneRep = getReplicant("obs:currentScene");
const obsStreamTimecodeRep = getReplicant("obs:streamTimecode");
const obsAutoReconnectRep = getReplicant("obs:autoReconnect");
const obsReconnectIntervalRep = getReplicant("obs:reconnectInterval");
const obsDoLocalRecordingsRep = getReplicant("obs:localRecordings");
const automationsSettingsRep = getReplicant("automations");

const obs = new OBSWebSocket();

type SceneType = "Gameplay" | "Intermission" | "IRL" | "ASNN" | "Unknown";

let previewScene: string;
let programScene: string;

let streamStatusGetter: string | number | NodeJS.Timeout | undefined;
let reconnectTimeout: string | number | NodeJS.Timeout | undefined;

obs.on("CurrentPreviewSceneChanged", ({ sceneName }) => {
	previewScene = sceneName;
});

obs.on("CurrentProgramSceneChanged", ({ sceneName }) => {
	programScene = sceneName;
	obsCurrentSceneRep.value = programScene;
});

obs.on("Identified", async () => {
	const isStudioMode = (await obs.call("GetStudioModeEnabled")).studioModeEnabled;

	if (!isStudioMode) {
		await obs.call("SetStudioModeEnabled", { studioModeEnabled: true });
	}

	previewScene = (await obs.call("GetCurrentPreviewScene")).currentPreviewSceneName;
	programScene = (await obs.call("GetCurrentProgramScene")).currentProgramSceneName;
	obsCurrentSceneRep.value = programScene;

	streamStatusGetter = setTimeout(updateStreamStatus, 10);
});

obs.on("ConnectionClosed", async () => {
	log.warn("Connection closed");

	clearTimeout(streamStatusGetter);
	obsStreamTimecodeRep.value = null;
	updateOBSStatus("disconnected", "Connection closed");

	if (obsAutoReconnectRep.value) {
		reconnectTimeout = setTimeout(() => {
			void connectOBS();
		}, obsReconnectIntervalRep.value);
	}
});

obsAutoReconnectRep.on("change", (newVal) => {
	if (!newVal) {
		clearTimeout(reconnectTimeout);
	}
});

obsReconnectIntervalRep.on("change", () => {
	if (obsStatusRep.value.status === "connected" || obsStatusRep.value.status === "connecting") {
		return;
	}

	if (obsAutoReconnectRep.value) {
		clearTimeout(reconnectTimeout);
		reconnectTimeout = setTimeout(() => {
			void connectOBS();
		}, obsReconnectIntervalRep.value);
	}
});

obs.on("ConnectionError", (err) => {
	log.warn("Connection error:", err);
	updateOBSStatus("error", "Connection error. Check console for details.");
});

obs.on("SceneTransitionStarted", async (transitionName) => {
	// Cut means we have fucked up and we don't want to do any automations
	if (transitionName.transitionName === "Cut") {
		return;
	}

	// Get the scene we are going from and to
	const currentScene = programScene;
	const toScene = previewScene;

	const currentSceneType = determineSceneType(currentScene);

	switch (currentSceneType) {
		case "Gameplay":
			transitionFromGameplay(toScene, currentScene);
			break;
		case "Intermission":
			transitionFromIntermission(toScene, currentScene);
			break;
		case "IRL":
			transitionFromIntermission(toScene, currentScene);
			break;
		case "ASNN":
		// Future ;)
		case "Unknown":
		default:
			log.info("Unknown transition");
			transitionFromIntermission(toScene, currentScene);
			nodecg.sendMessage("transition:UNKNOWN", { to: toScene, from: currentScene });
			break;
	}

	log.info(`[OBS Local] Program Scene changed from ${currentScene} to ${toScene}`);
});

// AUTOMATICALLY ADVANCE RUN WHEN TRANSITIONING FROM GAME TO INTERMISSION
nodecg.listenFor("transition:toIntermission", (data) => {
	if (!data.from.startsWith("GAMEPLAY")) return;

	setTimeout(() => {
		if (!automationsSettingsRep.value?.runAdvance) {
			return;
		}

		nodecg.sendMessageToBundle("changeToNextRun", "nodecg-speedcontrol");
	}, 3000);
});

nodecg.listenFor("transition:toGame", (data) => {
	if (!data.to.startsWith("GAMEPLAY")) return;

	void cycleRecording();
});

function determineSceneType(scene: string): SceneType {
	if (scene.startsWith("GAMEPLAY")) {
		return "Gameplay";
	} else if (scene.startsWith("INTERMISSION")) {
		return "Intermission";
	} else if (scene.startsWith("IRL")) {
		return "IRL";
	} else if (scene.startsWith("ASNN")) {
		return "ASNN";
	} else {
		return "Unknown";
	}
}

function transitionFromGameplay(toScene: string, fromScene: string) {
	const toSceneType = determineSceneType(toScene);

	switch (toSceneType) {
		case "Gameplay":
			// Do nothing!
			break;
		case "IRL":
			nodecg.sendMessage("transition:toIRL", { to: toScene, from: fromScene });
			break;
		case "Intermission":
			nodecg.sendMessage("transition:toIntermission", { to: toScene, from: fromScene });
			break;
		case "ASNN":
		case "Unknown":
		default:
			nodecg.sendMessage("transition:UNKNOWN", { to: toScene, from: fromScene });
			break;
	}
}

function transitionFromIntermission(toScene: string, fromScene: string) {
	const toSceneType = determineSceneType(toScene);

	switch (toSceneType) {
		case "Intermission":
			// Do nothing!
			break;
		case "Gameplay":
			nodecg.sendMessage("transition:toGame", { to: toScene, from: fromScene });
			break;
		case "IRL":
			nodecg.sendMessage("transition:toIRL", { to: toScene, from: fromScene });
			break;
		case "ASNN":
		// Probably a special intro
		case "Unknown":
		default:
			nodecg.sendMessage("transition:UNKNOWN", { to: toScene, from: fromScene });
			break;
	}
}

async function updateStreamStatus() {
	const status = await obs.call("GetStreamStatus");

	if (status.outputActive) {
		obsStreamTimecodeRep.value = status.outputTimecode;
		console.log(status.outputTimecode);
	} else {
		obsStreamTimecodeRep.value = null;
	}
}

async function cycleRecording() {
	if (!obsDoLocalRecordingsRep.value) return;

	// Stop the current recording
	await obs.call("StopRecord");

	// Start a new recording
	await obs.call("StartRecord");
}
async function connectOBS() {
	const ncgOBSConfig = nodecg.bundleConfig.obs;

	updateOBSStatus("connecting", "Connecting to OBS...");

	try {
		const { obsWebSocketVersion, negotiatedRpcVersion } = await obs.connect(
			`ws://${ncgOBSConfig.ip}:${ncgOBSConfig.port}`,
			ncgOBSConfig.password,
			{
				eventSubscriptions: EventSubscription.All | EventSubscription.InputVolumeMeters,
				rpcVersion: 1,
			},
		);

		log.info(`Connection successful | Version ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`);
		updateOBSStatus("connected", "Connection successful");
	} catch (err) {
		log.warn("Connection error:", err);
		updateOBSStatus("error", "Connection error. Check console for details.");
	}
}

function disconnectOBS() {
	obs.disconnect();
}

nodecg.listenFor("obs:setConnected", (connected) => {
	if (connected) {
		void connectOBS();
	} else {
		disconnectOBS();
	}
});

if (nodecg.bundleConfig.obs?.enabled) {
	log.info("[OBS-Local] OBS Local extension is enabled.");
	void connectOBS();
} else {
	log.info("[OBS-Local] OBS Local extension is disabled; not connecting.");
}

function updateOBSStatus(status: ConnectionStatus["status"], message: string) {
	obsStatusRep.value = {
		status,
		timestamp: Date.now(),
		message,
	};
}

nodecg.listenFor("obs:getVideoFeed", async (data, cb) => {
	if (obsStatusRep.value.status !== "connected") {
		const errorMsg = "OBS is not connected.";
		log.warn(errorMsg);
		if (!cb?.handled) {
			cb?.(new Error(errorMsg));
		}
		return;
	}

	// Here you would add the logic to handle the video feed retrieval.
	// For example, you might interact with OBS WebSocket API to get the feed.

	const imageData = await obs.call("GetSourceScreenshot", {
		sourceName: data.feedName,
		imageFormat: "png",
		imageWidth: 1920,
		imageHeight: 1080,
	});

	if (!cb?.handled) {
		cb?.(null, imageData);
	}
});
