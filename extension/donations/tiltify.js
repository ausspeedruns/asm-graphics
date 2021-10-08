"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodecgApiContext = tslib_1.__importStar(require("../nodecg-api-context"));
const nodecg = nodecgApiContext.get();
const donationTotalRep = nodecg.Replicant('donationTotal');
const donationsListRep = nodecg.Replicant('donations');
;
const tiltifyTotalRep = nodecg.Replicant('total', 'nodecg-tiltify');
const tiltifyDonationsRep = nodecg.Replicant('alldonations', 'nodecg-tiltify');
tiltifyTotalRep.on('change', newVal => {
    donationTotalRep.value = newVal;
});
tiltifyDonationsRep.on('change', newVal => {
    if (!newVal)
        return;
    const mutableDonations = [];
    newVal.forEach(donation => {
        var _a, _b;
        if (!((_a = donationsListRep.value) === null || _a === void 0 ? void 0 : _a.find(donate => donate.id === donation.id))) {
            mutableDonations.push({
                amount: donation.amount,
                currencySymbol: '$',
                id: donation.id.toString(),
                name: donation.name,
                time: donation.completedAt,
                read: false,
                desc: (_b = donation.comment) !== null && _b !== void 0 ? _b : ''
            });
        }
    });
    donationsListRep.value = mutableDonations.filter((item, pos, self) => {
        return self.findIndex(selfItem => item.id === selfItem.id) == pos;
    });
});
