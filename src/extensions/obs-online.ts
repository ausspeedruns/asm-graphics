import * as nodecgApiContext from "./nodecg-api-context";
import obs from "./util/obs";

import type { CurrentOverlay } from "@asm-graphics/types/CurrentOverlay";
import type { Stream } from "@asm-graphics/types/Streams";
import type NodeCG from "@nodecg/types";

const nodecg = nodecgApiContext.get();

import { currentOverlayRep, obsCurrentSceneRep, twitchStreamsRep } from "./replicants";

// const couchNamesRep = nodecg.Replicant<CouchInformation>('couch-names');
// const noCamRep = nodecg.Replicant<NoCam>('no-cam');

// Manual obs connections
nodecg.listenFor("connectOBS", () => {
	obs.connect().then(
		() => {},
		(err) => {
			nodecg.log.error(`[Overlay] Failed to connect to OBS: ${JSON.stringify(err)}`);
		},
	);
});

nodecg.listenFor("disconnectOBS", () => {
	try {
		obs.disconnect();
	} catch (error) {
		nodecg.log.error(`[Overlay] Failed to disconnect to OBS: ${error}`);
	}
});

nodecg.listenFor("changeOverlayPreview", (newVal) => {
	currentOverlayRep.value.preview = newVal;
});

// This should only be used for developer testing purposes
nodecg.listenFor("changeOverlayLive", (newVal) => {
	currentOverlayRep.value.live = newVal;
});

// Twitch stream commands, could probably combine these to one since I am logging even hidden ones
nodecg.listenFor("newTwitchStream", (newVal: Stream) => {
	const index = twitchStreamsRep.value.findIndex((stream) => stream.channel === newVal.channel);
	if (index === -1) {
		// Add new stream
		twitchStreamsRep.value.push(newVal);
	} else {
		// Update size
		twitchStreamsRep.value[index].size = newVal.size;

		if (twitchStreamsRep.value[index].state === "live") {
			twitchStreamsRep.value[index].state = "both";
		} else {
			twitchStreamsRep.value[index].state = "preview";
		}
	}

	const clonedArray = twitchStreamsRep.value.slice();

	clonedArray.sort((a, b) => {
		if (a.channel < b.channel) return -1;
		if (a.channel > b.channel) return 1;
		return 0;
	});

	twitchStreamsRep.value = clonedArray;
});

nodecg.listenFor("removeTwitchStream", (newVal) => {
	const index = twitchStreamsRep.value.findIndex((stream) => stream.channel === newVal);
	if (index === -1) {
		nodecg.log.warn(`[OBS] Tried removing Stream ${newVal} but it couldn't be found`);
	} else if (twitchStreamsRep.value[index].state === "preview") {
		twitchStreamsRep.value[index].state = "hidden";
	} else if (twitchStreamsRep.value[index].state === "both") {
		twitchStreamsRep.value[index].state = "live";
	}
});

// nodecg.listenFor('transitionGameplay', () => {
// 	// Check if intermission is live
// 	obs.call('GetCurrentProgramScene').then(val => {
// 		nodecg.sendMessage('runTransitionGraphic');

// 		if (val.currentProgramSceneName === 'Intermission') {
// 			transitionGameplay();
// 			obs.transition('Game Overlay');
// 		} else {
// 			// Wait for 1.5 seconds to switch gameplay router
// 			setTimeout(transitionGameplay, 1600);
// 		}
// 	});
// });

// function transitionGameplay() {
// 	// Change graphic
// 	currentOverlayRep.value = {
// 		live: currentOverlayRep.value.preview,
// 		preview: currentOverlayRep.value.live
// 	};

// 	// Change couch names
// 	couchNamesRep.value = {
// 		current: couchNamesRep.value.preview,
// 		preview: couchNamesRep.value.current
// 	}

// 	// Change no cam
// 	noCamRep.value = {
// 		current: noCamRep.value.preview,
// 		preview: noCamRep.value.current
// 	}

// 	// Change livestreams
// 	const liveStreams = twitchStreamsRep.value.map(stream => {
// 		const modifiedStream = stream;
// 		if (stream.state === 'preview') {
// 			modifiedStream.state = 'live';
// 		} else if (stream.state === 'live') {
// 			modifiedStream.state = 'preview';
// 		} else if (stream.state === 'both') {
// 			// Do Nothing
// 		} else {
// 			modifiedStream.state = 'hidden';
// 		}

// 		return modifiedStream;
// 	});

// 	twitchStreamsRep.value = liveStreams;

// 	// Change livestream sources
// 	liveStreams.forEach(stream => {
// 		// We're only changing the ASM Stations
// 		const obsSourceName = `ASM Station ${stream.channel.slice(-1)}`;
// 		const obsSourceID = 0;
// 		if (stream.state === 'live' || stream.state === 'both') {
// 			obs.enableSource(obsSourceName, true, 'Game Overlay');

// 			switch (stream.size) {
// 				case 'left':
// 					obs.setSceneItemProperties('Game Overlay', obsSourceID, { position: { x: 0 }, crop: { right: 960, left: 0 }, bounds: {}, scale: {} });
// 					break;

// 				case 'right':
// 					obs.setSceneItemProperties('Game Overlay', obsSourceID, { position: { x: 960 }, crop: { right: 0, left: 960 }, bounds: {}, scale: {} });
// 					break;

// 				case 'whole':
// 				default:
// 					obs.setSceneItemProperties('Game Overlay', obsSourceID, { position: { x: 0 }, crop: { right: 0, left: 0 }, bounds: {}, scale: {} });
// 					break;
// 			}

// 		} else {
// 			// Reset source
// 			obs.enableSource(obsSourceName, false, 'Game Overlay');
// 			obs.setSceneItemProperties('Game Overlay', obsSourceID, { position: { x: 0, y: 0 }, scale: { x: 1, y: 1 }, crop: { right: 0, left: 0 }, bounds: {} });
// 		}
// 	});

// 	nodecg.sendMessage('updateAudioMutes');
// }

// Intermission
// nodecg.listenFor('goToIntermission', () => {
// 	nodecg.sendMessage('runTransitionGraphic');
// 	obs.transition('Intermission');
// });

// If a transition is done from OBS
obs.on("SceneTransitionStarted", () => {
	nodecg.sendMessage("runTransitionGraphic");
});

// CURRENT SCENE
// Change current scene replicant on scene change
obs.on("CurrentPreviewSceneChanged", () => {
	getCurrentScene();
});

// Set replicant value on connection
obs.on("ConnectionOpened", () => {
	// getCurrentScene();
});

function getCurrentScene() {
	try {
		obs.call("GetCurrentProgramScene").then((val) => {
			obsCurrentSceneRep.value = val.currentProgramSceneName;
		});
	} catch (error) {
		nodecg.log.error("Could not get the current scene from OBS:", error);
	}
}

// nodecg.listenFor('widescreen3p-mask', (enable: boolean) => {
// 	obs.setSourceFilterVisibility('ASM Station 1', 'Widescreen 3p Bottom Left', enable);
// 	obs.setSourceFilterVisibility('ASM Station 2', 'Widescreen 3p Top Left', enable);
// 	obs.setSourceFilterVisibility('ASM Station 3', 'Widescreen 3p Top Right', enable);
// });
