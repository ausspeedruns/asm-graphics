import * as nodecgApiContext from "./nodecg-api-context";
import { obsCurrentSceneRep, obsStreamTimecode } from "./replicants";
import obs from "./util/obs";

import type { RunDataActiveRun } from "@asm-graphics/types/RunData";

const nodecg = nodecgApiContext.get();
const ncgLog = new nodecg.Logger("OBS-Local");

type SceneType = "Gameplay" | "Intermission" | "IRL" | "ASNN" | "Unknown";

let previewScene: string;
let programScene: string;

let streamStatusGetter: string | number | NodeJS.Timeout | undefined;

obs.on("CurrentPreviewSceneChanged", ({ sceneName }) => {
	previewScene = sceneName;
});

obs.on("CurrentProgramSceneChanged", ({ sceneName }) => {
	programScene = sceneName;
	obsCurrentSceneRep.value = programScene;
});

obs.on("Identified", async () => {
	previewScene = (await obs.call("GetCurrentPreviewScene")).currentPreviewSceneName;
	programScene = (await obs.call("GetCurrentProgramScene")).currentProgramSceneName;
	obsCurrentSceneRep.value = programScene;

	streamStatusGetter = setTimeout(updateStreamStatus, 10);
});

obs.on("ConnectionClosed", async () => {
	clearTimeout(streamStatusGetter);
	obsStreamTimecode.value = undefined;
});

obs.on("SceneTransitionStarted", async () => {
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
			ncgLog.info("Unknown transition");
			transitionFromIntermission(toScene, currentScene);
			nodecg.sendMessage("transition:UNKNOWN", { to: toScene, from: currentScene });
			break;
	}

	ncgLog.info(`[OBS Local] Program Scene changed from ${currentScene} to ${toScene}`);
});

// AUTOMATICALLY ADVANCE RUN WHEN TRANSITIONING FROM GAME TO INTERMISSION
nodecg.listenFor("transition:toIntermission", (data) => {
	if (!data.from.startsWith("GAMEPLAY")) return;

	setTimeout(() => {
		nodecg.sendMessageToBundle("changeToNextRun", "nodecg-speedcontrol");

		// CUSTOM TRANSITIONS
		// Change the transitions for when we leave a game to be the next entry transition
		if (runDataActiveRunRep.value?.customData.exitTransition) {
			setTransitionQueue = runDataActiveRunRep.value.customData.entryTransition;
		}
	}, 3000);
});

const runDataActiveRunRep = nodecg.Replicant<RunDataActiveRun>("runDataActiveRun", "nodecg-speedcontrol");

nodecg.listenFor("transition:toGame", (data) => {
	if (!data.to.startsWith("GAMEPLAY")) return;

	setTimeout(() => {
		// CUSTOM TRANSITIONS
		// Change the transitions for when we leave a game to be the next enter transition
		if (runDataActiveRunRep.value?.customData.exitTransition) {
			setTransitionQueue = runDataActiveRunRep.value.customData.exitTransition;
		}
	}, 1500);
});

let setTransitionQueue: string | null = null;

obs.on("SceneTransitionVideoEnded", (_transitionName) => {
	if (setTransitionQueue) {
		SetCurrentSceneTransition(setTransitionQueue);
	}
});

async function SetCurrentSceneTransition(transitionName: string) {
	// Check if it's already that transition
	const currentTransition = (await obs.call("GetCurrentSceneTransition")).transitionName;

	if (currentTransition != transitionName) {
		ncgLog.info(`Setting Current Scene Transition to: ${setTransitionQueue}`);
		obs.call("SetCurrentSceneTransition", {
			transitionName: transitionName,
		});

		setTransitionQueue = null;
	}
}

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
	const status = await obs.call("GetStreamStatus")

	if (status.outputActive) {
		obsStreamTimecode.value = status.outputTimecode;
		console.log(status.outputTimecode);
	} else {
		obsStreamTimecode.value = undefined;
	}
}
