// 99% from: https://github.com/esamarathon/esa-layouts/blob/master/src/extension/util/obs.ts
import * as nodecgApiContext from '../nodecg-api-context';
import obsWebsocketJs from 'obs-websocket-js';

import { Config } from '../../types/ConfigSchema';
import { OBSSceneItemProperties } from '../../types/NodeCGOBS';

const nodecg = nodecgApiContext.get();
const ncgOBSConfig = (nodecg.bundleConfig as Config).obs;
const obsConnectionRep = nodecg.Replicant<boolean>('obsConnection');

// Extending the OBS library with some of our own functions.
class OBSUtility extends obsWebsocketJs {
	/**
	 * Change to this OBS scene.
	 * @param name Name of the scene.
	 * @param ignore Ignore scene if it has this name.
	 */
	async changeScene(name: string, ignore?: string): Promise<void> {
		if (!ncgOBSConfig.enabled) {
			// OBS not enabled, don't even try to set.
			// throw new Error('No OBS connection available');
			nodecg.log.warn(`[OBS] No OBS connection`);
		}

		try {
			const sceneList = await this.send('GetSceneList');
			const scene = sceneList.scenes.find((s) => (
				s.name.startsWith(name) && (!ignore || !s.name.startsWith(ignore))));
			if (scene) {
				await this.send('SetCurrentScene', { 'scene-name': scene.name });
			} else {
				throw new Error('Scene could not be found');
			}
		} catch (err) {
			if (err instanceof Error) {
				nodecg.log.warn(`[OBS] Cannot change scene [${name}]: ${err.message || err}`);
			}
		}
	}

	/**
	 * Hide this item in the specified OBS scene.
	 * @param item Name of the item.
	 * @param scene Name of the scene.
	 */
	async hideItemInScene(item: string, scene: string): Promise<void> {
		if (!ncgOBSConfig.enabled) {
			// OBS not enabled, don't even try to set.
			// throw new Error('No OBS connection available');
			nodecg.log.warn(`[OBS] No OBS connection`);
		}

		try {
			// @ts-ignore: Typings say we need to specify more than we actually do.
			await this.send('SetSceneItemProperties', {
				item: { name: item },
				visible: false,
				'scene-name': scene,
			});
		} catch (err) {
			if (err instanceof Error) {
				nodecg.log.warn(`[OBS] Cannot hide item [${scene}: ${item}]: ${err.message}`);
			}
		}
	}

	/**
	 * Set audio of a specific source
	 * @param source Name of the source.
	 * @param volume Volume of the source between 0.0 and 1.0.
	 */
	async setSourceVolume(source: string, volume: number, useDecibel?: boolean): Promise<void> {
		if (!ncgOBSConfig.enabled) {
			// OBS not enabled, don't even try to set.
			// throw new Error('No OBS connection available');
			nodecg.log.warn(`[OBS] No OBS connection`);
		}

		try {
			// @ts-ignore: Typings do not have the decibel boolean
			await this.send('SetVolume', { source, volume, useDecibel });
		} catch (err) {
			if (err instanceof Error) {
				nodecg.log.warn(`[OBS] Cannot set volume [${source}: ${volume}]: ${err.message}`);
			}
		}
	}

	/**
	 * Set audio of a specific source
	 * @param source Name of the source.
	 * @param mute Desired mute status.
	 */
	async setSourceMute(source: string, mute: boolean): Promise<void> {
		if (!ncgOBSConfig.enabled) {
			// OBS not enabled, don't even try to set.
			// throw new Error('No OBS connection available');
			nodecg.log.warn(`[OBS] No OBS connection`);
		}

		try {
			await this.send('SetMute', { source, mute });
		} catch (err) {
			if (err instanceof Error) {
				nodecg.log.warn(`[OBS] Cannot mute source [${source}: ${mute}]: ${err.message}`);
			}
		}
	}

	/**
	 * Transition with Blank Stinger
	 * @param scene Name of the scene to transition to.
	 */
	async transition(scene?: string): Promise<void> {
		if (!ncgOBSConfig.enabled) {
			// OBS not enabled, don't even try to set.
			// throw new Error('No OBS connection available');
			nodecg.log.warn(`[OBS] No OBS connection`);
		}

		if (scene) {
			try {
				await this.send('SetPreviewScene', { 'scene-name': scene });
			} catch (error) {
				nodecg.log.error('Error setting preview scene for transition:', error);
				return;
			}
		}

		try {
			await this.send('TransitionToProgram', { 'with-transition': { name: 'ASM Transition' } });
		} catch (error) {
			nodecg.log.error('Error transitioning:', error);
		}
	}

	/**
	 * Enable sources
	 * @param source Scene Item name.
	 * @param render true = shown ; false = hidden
	 * @param scene Name of the scene the scene item belongs to. Defaults to the currently active scene.
	 */
	async enableSource(source: string, render: boolean, scene?: string): Promise<void> {
		if (!ncgOBSConfig.enabled) {
			// OBS not enabled, don't even try to set.
			// throw new Error('No OBS connection available');
			nodecg.log.warn(`[OBS] No OBS connection`);
		}

		try {
			// await this.send('SetPreviewScene', { 'scene-name': scene });
			await this.send('SetSceneItemRender', { render: render, source: source, 'scene-name': scene });
		} catch (error) {
			nodecg.log.error(`Error enabling/disabling source ${source} in ${scene || 'current'} to ${render}:`, error);
		}
	}

	/**
	 * Set a scenes item properites
	 * @param source Scene Item name.
	 * @param scene Name of the scene the scene item belongs to. Defaults to the currently active scene.
	 * @param itemProperties Object of item properties to change
	 */
	async setSceneItemProperties(scene: string, source: string, itemProperties: OBSSceneItemProperties): Promise<void> {
		if (!ncgOBSConfig.enabled) {
			// OBS not enabled, don't even try to set.
			// throw new Error('No OBS connection available');
			nodecg.log.warn(`[OBS] No OBS connection`);
		}

		try {
			// await this.send('SetPreviewScene', { 'scene-name': scene });

			await this.send('SetSceneItemProperties', { 'scene-name': scene, item: { name: source }, ...itemProperties });
			// await this.send('SetSceneItemProperties', { 'scene-name': scene, item: source });
		} catch (error) {
			nodecg.log.error('Error setting scene item property:', error);
		}
	}

	/**
	 * Set a filter on a sources visibility
	 * @param sourceName Source name.
	 * @param filterName Name of the filter on the source.
	 * @param filterEnabled If the filter should be enabled or not.
	 */
	async setSourceFilterVisibility(sourceName: string, filterName: string, filterEnabled: boolean): Promise<void> {
		if (!ncgOBSConfig.enabled) {
			// OBS not enabled, don't even try to set.
			// throw new Error('No OBS connection available');
			nodecg.log.warn(`[OBS] No OBS connection`);
		}

		try {
			await this.send('SetSourceFilterVisibility', { sourceName, filterName, filterEnabled });
		} catch (error) {
			nodecg.log.error('Error setting scene item property:', error);
		}
	}

	// Currently unused
	/**
	 * Set up game/camera capture in specified OBS scene; turns on, repositions and resizes.
	 * @param item Name of the item.
	 * @param scene Name of the scene.
	 * @param position Position details (x/y/width/height/cropping).
	 */
	// async setUpCaptureInScene(item: string, scene: string, position: ItemPosition): Promise<void> {
	// 	if (!ncgOBSConfig.enabled) {
	// 		// OBS not enabled, don't even try to set.
	// 		throw new Error('No OBS connection available');
	// 	}

	// 	try {
	// 		await this.send('SetSceneItemProperties', {
	// 			item,
	// 			visible: true,
	// 			'scene-name': scene,
	// 			position: {
	// 				x: position.x,
	// 				y: position.y,
	// 			},
	// 			bounds: {
	// 				x: position.width,
	// 				y: position.height,
	// 			},
	// 			crop: {
	// 				top: position.croptop,
	// 				right: position.cropright,
	// 				bottom: position.cropbottom,
	// 				left: position.cropleft,
	// 			},
	// 			scale: {},
	// 		});
	// 	} catch (err) {
	// 		nodecg.log.warn(`[OBS] Cannot setup item [${scene}: ${item}]: ${err.error}`);
	// 		throw err;
	// 	}
	// }
}

const obs = new OBSUtility();
const settings = {
	address: `${ncgOBSConfig.ip}:${ncgOBSConfig.port}`,
	password: ncgOBSConfig.password,
};

async function connect(): Promise<void> {
	try {
		await obs.connect(settings);
		nodecg.log.info('[OBS] Connection successful');
		obsConnectionRep.value = true;
	} catch (err) {
		// nodecg.log.warn('[OBS] Connection error');
		nodecg.log.warn('[OBS] Connection error:', err);
		obsConnectionRep.value = false;
	}
}

if (ncgOBSConfig.enabled) {
	nodecg.log.info('[OBS] Setting up connection');
	connect();
	obs.on('ConnectionClosed', () => {
		nodecg.log.warn('[OBS] Connection lost, retrying in 5 seconds');
		obsConnectionRep.value = false;
		setTimeout(connect, 5000);
	});

	// @ts-ignore: Pretty sure this emits an error.
	obs.on('error', (err) => {
		// nodecg.log.warn('[OBS] Connection error');
		nodecg.log.warn('[OBS] Connection error:', err);
		obsConnectionRep.value = false;
	});
}

export default obs;