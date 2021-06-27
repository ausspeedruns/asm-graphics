
import * as nodecgApiContext from '../nodecg-api-context';
import needle from 'needle';

import { Donation } from '../../types/Donations';
import { Config } from '../../types/ConfigSchema';

const nodecg = nodecgApiContext.get();

const donationTotalRep = nodecg.Replicant<number>('donationTotal', { persistent: true, defaultValue: 0 });
const donationsListRep = nodecg.Replicant<Donation[]>('donations', { persistent: true, defaultValue: [] });

const campaignID = (nodecg.bundleConfig as Config).raisely.campaignId || "";
const profileID = (nodecg.bundleConfig as Config).raisely.profileId || "";

if (!campaignID || !profileID) {
	nodecg.log.error('Raisely is enabled but there is no campaign or profile ID. Errors will occur');
}

/* Get info on startup */
// Get donation total
async function GetTotal() {
	needle.get(`https://api.raisely.com/v3/profiles/${profileID}?campaign=${campaignID}`, { headers: { Accept: 'application/json' } }, (err, res) => {
		if (err) {
			nodecg.log.warn('Error getting Raisely Profile: ' + err.message);
			return;
		}

		donationTotalRep.value = parseInt(res.body.data.total, 10) / 100;
	});
}

// Get all donations
async function GetDonations() {
	needle.get(`https://api.raisely.com/v3/profiles/${profileID}/donations?sort=createdAt&order=desc&campaign=${campaignID}`, { headers: { Accept: 'application/json' } }, (err, res) => {
		if (err) {
			nodecg.log.warn('Error getting Raisely Profile: ' + err.message);
			return;
		}

		res.body.data.forEach((donation: any) => {
			if (!donationsListRep.value?.find(donate => donate.id === donation.uuid)) {
				donationsListRep.value?.push({
					id: donation.uuid,
					read: false,
					time: donation.createdAt,
					amount: parseInt(donation.amount, 10) / 100,
					name: donation.preferredName,
					desc: donation.message || ''
				})
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
