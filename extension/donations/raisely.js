"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodecgApiContext = tslib_1.__importStar(require("../nodecg-api-context"));
const needle_1 = tslib_1.__importDefault(require("needle"));
const nodecg = nodecgApiContext.get();
const donationTotalRep = nodecg.Replicant('donationTotal', { persistent: true, defaultValue: 0 });
const donationsListRep = nodecg.Replicant('donations', { persistent: true, defaultValue: [] });
const campaignID = nodecg.bundleConfig.raisely.campaignId || "";
const profileID = nodecg.bundleConfig.raisely.profileId || "";
if (!campaignID || !profileID) {
    nodecg.log.error('Raisely is enabled but there is no campaign or profile ID. Errors will occur');
}
/* Get info on startup */
// Get donation total
async function GetTotal() {
    needle_1.default.get(`https://api.raisely.com/v3/profiles/${profileID}?campaign=${campaignID}`, { headers: { Accept: 'application/json' } }, (err, res) => {
        if (err) {
            nodecg.log.warn('Error getting Raisely Profile: ' + err.message);
            return;
        }
        donationTotalRep.value = parseInt(res.body.data.total, 10) / 100;
    });
}
// Get all donations
async function GetDonations() {
    needle_1.default.get(`https://api.raisely.com/v3/profiles/${profileID}/donations?sort=createdAt&order=desc&campaign=${campaignID}`, { headers: { Accept: 'application/json' } }, (err, res) => {
        if (err) {
            nodecg.log.warn('Error getting Raisely Profile: ' + err.message);
            return;
        }
        res.body.data.forEach((donation) => {
            var _a, _b;
            if (!((_a = donationsListRep.value) === null || _a === void 0 ? void 0 : _a.find(donate => donate.id === donation.uuid))) {
                (_b = donationsListRep.value) === null || _b === void 0 ? void 0 : _b.push({
                    id: donation.uuid,
                    read: false,
                    time: donation.createdAt,
                    amount: parseInt(donation.amount, 10) / 100,
                    name: donation.preferredName,
                    desc: donation.message || ''
                });
            }
        });
    });
}
GetTotal();
GetDonations();
setInterval(() => {
    GetTotal();
    GetDonations();
}, 30 * 1000); // 30 Seconds
