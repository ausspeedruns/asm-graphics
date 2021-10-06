"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodecgApiContext = tslib_1.__importStar(require("../nodecg-api-context"));
const nodecg = nodecgApiContext.get();
const donationTotalRep = nodecg.Replicant('donationTotal');
const donationsListRep = nodecg.Replicant('donations');
;
const tiltifyTotalRep = nodecg.Replicant('total', 'nodecg-tiltify');
const tiltifyDonationsRep = nodecg.Replicant('allDonations', 'nodecg-tiltify');
tiltifyTotalRep.on('change', newVal => {
    donationTotalRep.value = newVal;
});
tiltifyDonationsRep.on('change', newVal => {
    if (!newVal)
        return;
    newVal.forEach(donation => {
        var _a, _b, _c;
        if (!((_a = donationsListRep.value) === null || _a === void 0 ? void 0 : _a.find(donate => donate.id === donation.id))) {
            (_b = donationsListRep.value) === null || _b === void 0 ? void 0 : _b.push({
                amount: donation.amount,
                currencySymbol: '$',
                id: donation.id.toString(),
                name: donation.name,
                time: donation.completedAt.toString(),
                read: false,
                desc: (_c = donation.comment) !== null && _c !== void 0 ? _c : ''
            });
        }
    });
});
