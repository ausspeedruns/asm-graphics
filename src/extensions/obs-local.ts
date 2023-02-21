import * as nodecgApiContext from './nodecg-api-context';
import obs from './util/obs';

const nodecg = nodecgApiContext.get();

let previewScene: string;
let programScene: string;

obs.on('CurrentPreviewSceneChanged', ({ sceneName }) => {
	previewScene = sceneName;
});

obs.on('CurrentProgramSceneChanged', ({ sceneName }) => {
	programScene = sceneName;
});

obs.on('Identified', async () => {
	previewScene = (await obs.call('GetCurrentPreviewScene')).currentPreviewSceneName;
	programScene = (await obs.call('GetCurrentProgramScene')).currentProgramSceneName;
});

obs.on('SceneTransitionStarted', async () => {
	// Get the scene we are going from and to
	const fromScene = programScene;
	const toScene = previewScene;

	let logString = `[OBS Local] Program Scene changed from ${fromScene} to ${toScene}`;

	if (toScene.startsWith("GAMEPLAY")) {
		// Only call when going from something else to game, game to game might mean we chose the wrong layouts
		if (!fromScene.startsWith("GAMEPLAY")) {
			nodecg.sendMessage('transition:toGame', { to: toScene, from: fromScene });
			logString += " | Calling transition:toGame message";
		}
	} else if (toScene.startsWith("INTERMISSION")) {
		nodecg.sendMessage('transition:toIntermission', { to: toScene, from: fromScene });
		logString += " | Calling transition:toIntermission message";
	} else if (toScene.startsWith('IRL')) {
		nodecg.sendMessage('transition:toIRL', { to: toScene, from: fromScene });
		logString += " | Calling transition:toIRL message";
	} else {
		nodecg.sendMessage('transition:UNKNOWN', { to: toScene, from: fromScene });
	}

	nodecg.log.info(logString);
});

// AUTOMATICALLY ADVANCE RUN WHEN TRANSITIONING FROM GAME TO INTERMISSION
nodecg.listenFor('transition:toIntermission', (data: { to: string; from: string }) => {
	if (!data.from.startsWith("GAMEPLAY")) return;
	
	nodecg.sendMessageToBundle('changeToNextRun', 'nodecg-speedcontrol');
});
