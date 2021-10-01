"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodecgApiContext = tslib_1.__importStar(require("./nodecg-api-context"));
const underscore_1 = tslib_1.__importDefault(require("underscore"));
const nodecg = nodecgApiContext.get();
const donationsRep = nodecg.Replicant('donations');
nodecg.listenFor('donations:toggleRead', (id) => {
    const donationIndex = donationsRep.value.findIndex(donation => donation.id === id);
    const newObj = underscore_1.default.clone(donationsRep.value[donationIndex]);
    newObj.read = !newObj.read;
    donationsRep.value[donationIndex] = newObj;
});
