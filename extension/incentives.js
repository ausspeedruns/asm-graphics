"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodecgApiContext = tslib_1.__importStar(require("./nodecg-api-context"));
const nodecg = nodecgApiContext.get();
const incentivesRep = nodecg.Replicant('incentives', { defaultValue: [] });
nodecg.listenFor('disableIncentive', (index) => {
    const incentiveIndex = incentivesRep.value.findIndex(incentive => incentive.index === index);
    if (incentiveIndex === -1)
        return nodecg.log.error(`[Incentives] Tried to disable incentive index: ${index} but could not find in list.`);
    incentivesRep.value[incentiveIndex].active = false;
});
// Dunno why this would be used but just in case :)
nodecg.listenFor('activateIncentive', (index) => {
    const incentiveIndex = incentivesRep.value.findIndex(incentive => incentive.index === index);
    if (incentiveIndex === -1)
        return nodecg.log.error(`[Incentives] Tried to activate incentive index: ${index} but could not find in list.`);
    incentivesRep.value[incentiveIndex].active = true;
});
