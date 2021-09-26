"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// 99% from: https://github.com/esamarathon/esa-layouts/blob/master/src/extension/util/obs.ts
const nodecgApiContext = tslib_1.__importStar(require("../nodecg-api-context"));
const obs_websocket_js_1 = tslib_1.__importDefault(require("obs-websocket-js"));
const nodecg = nodecgApiContext.get();
const ncgOBSConfig = nodecg.bundleConfig.obs;
const obsConnectionRep = nodecg.Replicant('obsConnection');
// Extending the OBS library with some of our own functions.
class OBSUtility extends obs_websocket_js_1.default {
    /**
     * Change to this OBS scene.
     * @param name Name of the scene.
     * @param ignore Ignore scene if it has this name.
     */
    async changeScene(name, ignore) {
        if (!ncgOBSConfig.enabled) {
            // OBS not enabled, don't even try to set.
            // throw new Error('No OBS connection available');
            nodecg.log.warn(`[OBS] No OBS connection`);
        }
        try {
            const sceneList = await this.send('GetSceneList');
            const scene = sceneList.scenes.find((s) => (s.name.startsWith(name) && (!ignore || !s.name.startsWith(ignore))));
            if (scene) {
                await this.send('SetCurrentScene', { 'scene-name': scene.name });
            }
            else {
                throw new Error('Scene could not be found');
            }
        }
        catch (err) {
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
    async hideItemInScene(item, scene) {
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
        }
        catch (err) {
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
    async setSourceVolume(source, volume, useDecibel) {
        if (!ncgOBSConfig.enabled) {
            // OBS not enabled, don't even try to set.
            // throw new Error('No OBS connection available');
            nodecg.log.warn(`[OBS] No OBS connection`);
        }
        try {
            // @ts-ignore: Typings do not have the decibel boolean
            await this.send('SetVolume', { source, volume, useDecibel });
        }
        catch (err) {
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
    async setSourceMute(source, mute) {
        if (!ncgOBSConfig.enabled) {
            // OBS not enabled, don't even try to set.
            // throw new Error('No OBS connection available');
            nodecg.log.warn(`[OBS] No OBS connection`);
        }
        try {
            await this.send('SetMute', { source, mute });
        }
        catch (err) {
            if (err instanceof Error) {
                nodecg.log.warn(`[OBS] Cannot mute source [${source}: ${mute}]: ${err.message}`);
            }
        }
    }
    /**
     * Transition with Blank Stinger
     * @param scene Name of the scene to transition to.
     */
    async transition(scene) {
        if (!ncgOBSConfig.enabled) {
            // OBS not enabled, don't even try to set.
            // throw new Error('No OBS connection available');
            nodecg.log.warn(`[OBS] No OBS connection`);
        }
        if (scene) {
            try {
                await this.send('SetPreviewScene', { 'scene-name': scene });
            }
            catch (error) {
                nodecg.log.error('Error setting preview scene for transition:', error);
                return;
            }
        }
        try {
            await this.send('TransitionToProgram', { 'with-transition': { name: 'ASM Transition' } });
        }
        catch (error) {
            nodecg.log.error('Error transitioning:', error);
        }
    }
    /**
     * Enable sources
     * @param source Scene Item name.
     * @param render true = shown ; false = hidden
     * @param scene Name of the scene the scene item belongs to. Defaults to the currently active scene.
     */
    async enableSource(source, render, scene) {
        if (!ncgOBSConfig.enabled) {
            // OBS not enabled, don't even try to set.
            // throw new Error('No OBS connection available');
            nodecg.log.warn(`[OBS] No OBS connection`);
        }
        try {
            // await this.send('SetPreviewScene', { 'scene-name': scene });
            await this.send('SetSceneItemRender', { render: render, source: source, 'scene-name': scene });
        }
        catch (error) {
            nodecg.log.error(`Error enabling/disabling source ${source} in ${scene || 'current'} to ${render}:`, error);
        }
    }
    /**
     * Set a scenes item properites
     * @param source Scene Item name.
     * @param scene Name of the scene the scene item belongs to. Defaults to the currently active scene.
     * @param itemProperties Object of item properties to change
     */
    async setSceneItemProperties(scene, source, itemProperties) {
        if (!ncgOBSConfig.enabled) {
            // OBS not enabled, don't even try to set.
            // throw new Error('No OBS connection available');
            nodecg.log.warn(`[OBS] No OBS connection`);
        }
        try {
            // await this.send('SetPreviewScene', { 'scene-name': scene });
            await this.send('SetSceneItemProperties', Object.assign({ 'scene-name': scene, item: { name: source } }, itemProperties));
            // await this.send('SetSceneItemProperties', { 'scene-name': scene, item: source });
        }
        catch (error) {
            nodecg.log.error('Error setting scene item property:', error);
        }
    }
    async setSourceFilterVisibility(sourceName, filterName, filterEnabled) {
        if (!ncgOBSConfig.enabled) {
            // OBS not enabled, don't even try to set.
            // throw new Error('No OBS connection available');
            nodecg.log.warn(`[OBS] No OBS connection`);
        }
        try {
            await this.send('SetSourceFilterVisibility', { sourceName, filterName, filterEnabled });
        }
        catch (error) {
            nodecg.log.error('Error setting scene item property:', error);
        }
    }
}
const obs = new OBSUtility();
const settings = {
    address: `${ncgOBSConfig.ip}:${ncgOBSConfig.port}`,
    password: ncgOBSConfig.password,
};
async function connect() {
    try {
        await obs.connect(settings);
        nodecg.log.info('[OBS] Connection successful');
        obsConnectionRep.value = true;
    }
    catch (err) {
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
exports.default = obs;
