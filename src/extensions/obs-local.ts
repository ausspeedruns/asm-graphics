import { EventSubscription, OBSWebSocket } from "obs-websocket-js";
import * as nodecgApiContext from "./nodecg-api-context.js";
import { getReplicant } from "./replicants.js";
import type { ConnectionStatus } from "@asm-graphics/shared/replicants.js";
import { GameplayLocations } from "@asm-graphics/shared/obs-gameplay-scene-data.js";

const nodecg = nodecgApiContext.get();
const log = new nodecg.Logger("OBS-Local");

const obsStatusRep = getReplicant("obs:status");
const obsCurrentSceneRep = getReplicant("obs:currentScene");
const obsPreviewSceneRep = getReplicant("obs:previewScene");
const obsStreamTimecodeRep = getReplicant("obs:streamTimecode");
const obsAutoReconnectRep = getReplicant("obs:autoReconnect");
const obsReconnectIntervalRep = getReplicant("obs:reconnectInterval");
const obsDoLocalRecordingsRep = getReplicant("obs:localRecordings");
const obsGameCaptureScenesRep = getReplicant("obs:gameplayCaptureScenes");
const automationsSettingsRep = getReplicant("automations");

const obs = new OBSWebSocket();

type SceneType = "Gameplay" | "Intermission" | "IRL" | "ASNN" | "Unknown";

let streamStatusGetter: string | number | NodeJS.Timeout | undefined;
let reconnectTimeout: string | number | NodeJS.Timeout | undefined;

obs.on("CurrentPreviewSceneChanged", ({ sceneName }) => {
	obsPreviewSceneRep.value = sceneName;
});

obs.on("CurrentProgramSceneChanged", ({ sceneName }) => {
	obsCurrentSceneRep.value = sceneName;
});

obs.on("SceneListChanged", async (data) => {
	obsGameCaptureScenesRep.value = data.scenes
		.map((scene) => scene["sceneName"] as string)
		.filter((name) => name.startsWith("Gameplay Capture")); // TODO: Unhardcode
});

obs.on("Identified", async () => {
	const isStudioMode = (await obs.call("GetStudioModeEnabled")).studioModeEnabled;

	if (!isStudioMode) {
		await obs.call("SetStudioModeEnabled", { studioModeEnabled: true });
	}

	const allScenes = await obs.call("GetSceneList");
	obsGameCaptureScenesRep.value = allScenes.scenes
		.map((scene) => scene["sceneName"] as string)
		.filter((name) => name.startsWith("Gameplay Capture")); // TODO: Unhardcode

	obsCurrentSceneRep.value = allScenes.currentProgramSceneName;
	obsPreviewSceneRep.value = allScenes.currentPreviewSceneName;

	streamStatusGetter = setTimeout(updateStreamStatus, 10);

	const a = await obs.call("GetSceneItemList", { sceneName: "GAMEPLAY Standard-2" });
	console.log(JSON.stringify(a, null, 2));
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

	if (!obsCurrentSceneRep.value) {
		log.warn("Program scene is not available during transition.");
		return;
	}

	// Get the scene we are going from and to
	const currentScene = obsCurrentSceneRep.value;
	const toScene = obsPreviewSceneRep.value ?? "";

	const currentSceneType = currentScene ? determineSceneType(currentScene) : "Unknown";

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

nodecg.listenFor("obs:getSourceScreenshot", async (data, cb) => {
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
		sourceName: data.sourceName,
		imageFormat: "png",
		imageWidth: 1920,
		imageHeight: 1080,
	});

	if (!cb?.handled) {
		cb?.(null, imageData);
	}
});

nodecg.listenFor("obs:getCurrentScenes", async (_data, cb) => {
	if (obsStatusRep.value.status !== "connected") {
		const errorMsg = "OBS is not connected.";
		log.warn(errorMsg);
		if (!cb?.handled) {
			cb?.(new Error(errorMsg));
		}
		return;
	}

	if (obsCurrentSceneRep.value === null) {
		const errorMsg = "Program scene is not available.";
		log.warn(errorMsg);
		if (!cb?.handled) {
			cb?.(new Error(errorMsg));
		}

		return;
	}

	if (!cb?.handled) {
		cb?.(null, { previewScene: obsPreviewSceneRep.value, programScene: obsCurrentSceneRep.value });
	}
});

nodecg.listenFor("obs:setCropSettings", async (data, cb) => {
	if (obsStatusRep.value.status !== "connected") {
		const errorMsg = "OBS is not connected.";
		log.warn(errorMsg);
		if (!cb?.handled) {
			cb?.(new Error(errorMsg));
		}
		return;
	}

	// Get the bounding box for the selected section
	const selectedScene = data.isPreview ? obsPreviewSceneRep.value : obsCurrentSceneRep.value;

	if (!selectedScene) {
		const errorMsg = "No scene is currently selected.";
		log.warn(errorMsg);
		if (!cb?.handled) {
			cb?.(new Error(errorMsg));
		}

		return;
	}

	let overlayName = "";
	if (selectedScene?.startsWith("GAMEPLAY")) {
		overlayName = selectedScene.slice("GAMEPLAY".length).trim();
	}

	if (!overlayName) {
		const errorMsg = "No valid gameplay overlay found in the current scene.";
		log.warn(errorMsg);
		if (!cb?.handled) {
			cb?.(new Error(errorMsg));
		}

		return;
	}

	const gameplayLocations = GameplayLocations[overlayName as keyof typeof GameplayLocations];
	if (!gameplayLocations) {
		const errorMsg = `No gameplay locations found for overlay: ${overlayName}`;
		log.warn(errorMsg);
		if (!cb?.handled) {
			cb?.(new Error(errorMsg));
		}

		return;
	}

	const sectionData = gameplayLocations[data.sectionIndex];
	if (!sectionData) {
		const errorMsg = `No section data found for index: ${data.sectionIndex}`;
		log.warn(errorMsg);
		if (!cb?.handled) {
			cb?.(new Error(errorMsg));
		}

		return;
	}

	// Calculate new position, scale and crop
	const crop = data.cropSettings;
	const newXPosition = sectionData.x;
	const newYPosition = sectionData.y;
	const newXScale = sectionData.width / (1920 - (crop.left + crop.right));
	const newYScale = sectionData.height / (1080 - (crop.top + crop.bottom));

	log.info(`Setting crop for source ${data.sourceName} in scene ${selectedScene}:`);
	log.info(` New Position: (${newXPosition}, ${newYPosition})`);
	log.info(` New Scale: (${newXScale}, ${newYScale})`);
	log.info(` Crop: Left ${crop.left}, Top ${crop.top}, Right ${crop.right}, Bottom ${crop.bottom}`);

	try {
		// Get the scene item ID for the game capture source
		const sceneId = await obs.call("GetSceneItemId", {
			sceneName: selectedScene,
			sourceName: data.sourceName,
		});

		// TESTING
		const preTransform = await obs.call("GetSceneItemTransform", {
			sceneName: selectedScene,
			sceneItemId: sceneId.sceneItemId,
		});
		log.info("Current Transform:", JSON.stringify(preTransform.sceneItemTransform, null, 2));

		// Set the new transform settings
		await obs.call("SetSceneItemTransform", {
			sceneName: selectedScene,
			sceneItemId: sceneId.sceneItemId,
			sceneItemTransform: {
				positionX: newXPosition,
				positionY: newYPosition,
				scaleX: newXScale,
				scaleY: newYScale,
				cropLeft: crop.left,
				cropTop: crop.top,
				cropRight: crop.right,
				cropBottom: crop.bottom,
			},
		});

		// TESTING
		const postTransform = await obs.call("GetSceneItemTransform", {
			sceneName: selectedScene,
			sceneItemId: sceneId.sceneItemId,
		});
		log.info("Updated Transform:", JSON.stringify(postTransform.sceneItemTransform, null, 2));

		if (!cb?.handled) {
			cb?.(null, {});
		}
	} catch (err) {
		log.error("Error setting crop settings:", err);
		if (!cb?.handled) {
			cb?.(err);
		}
	}
});
