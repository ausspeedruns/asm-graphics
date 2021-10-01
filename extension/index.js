"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodecgApiContext = tslib_1.__importStar(require("./nodecg-api-context"));
let ncgConfig;
module.exports = (nodecg) => {
    // Store a reference to this nodecg API context in a place where other libs can easily access it.
    // This must be done before any other files are `require`d.
    nodecgApiContext.set(nodecg);
    ncgConfig = nodecg.bundleConfig;
    init().then(() => {
        nodecg.log.info('Initialization successful.');
    }).catch(error => {
        nodecg.log.error('Failed to initialize:', error);
    });
};
async function init() {
    const nodecg = nodecgApiContext.get();
    require('./replicants');
    // The order of these is literally just the chronological order of when they were made, a.k.a the best way to watch Star Wars
    if (ncgConfig.obs.enabled) {
        require('./util/obs');
    }
    require('./overlay');
    require('./audio');
    require('./couch');
    require('./host');
    if (ncgConfig.twitter.enabled) {
        require('./twitter');
        require('./util/twitter');
    }
    else {
        nodecg.log.info('Twitter not enabled. Showing tweets will not work');
    }
    if (ncgConfig.googleCredentials.enabled) {
        require('./util/google');
    }
    else {
        nodecg.log.info('Google API not enabled. Incentives will not work');
    }
    if (ncgConfig.raisely.enabled) {
        require('./donations/raisely');
    }
    require('./incentives');
    require('./staff-messages');
    require('./donations');
}
