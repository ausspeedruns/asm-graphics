import * as nodecgApiContext from '../nodecg-api-context';

import { Donation } from '../../types/Donations';
import TiltifyClient from './util/tiltify-api';
import _ from 'underscore';

const nodecg = nodecgApiContext.get();
const donationTotalRep = nodecg.Replicant<number>('donationTotal');
const donationsListRep = nodecg.Replicant<Donation[]>('donations');

if (nodecg.bundleConfig.tiltify.key === "") {
	nodecg.log.info("[Tiltify] API Key not set");
}

if (nodecg.bundleConfig.tiltify.campaign === "") {
	nodecg.log.info(
		"[Tiltify] Campaign id not set"
	);
}

const client = new TiltifyClient(nodecg.bundleConfig.tiltify.key);

async function askTiltifyForAllDonations() {
	client.Campaigns.getDonations(
		nodecg.bundleConfig.tiltify.campaign,
		(allDonations) => {
			// New donations
			const newDonos = allDonations.filter(donation => donationsListRep.value.findIndex(oldDono => oldDono.id === donation.id.toString()) === -1);

			if (newDonos.length > 0) {
				const parsedDonos: Donation[] = newDonos.map(donation => ({
					id: donation.id.toString(),
					amount: donation.amount,
					read: false,
					currencySymbol: '$',
					name: donation.name,
					time: donation.completedAt,
					desc: donation.comment
				}))

				const mutableDonations = _.clone(donationsListRep.value);

				donationsListRep.value = mutableDonations.concat(parsedDonos);
			}
		}
	);
}

async function askTiltifyForTotal() {
	client.Campaigns.get(nodecg.bundleConfig.tiltify.campaign, (campaign) => {
		donationTotalRep.value = campaign.amountRaised;
	});
}

function askTiltify() {
	askTiltifyForTotal();
	askTiltifyForAllDonations();
}

setInterval(function () {
	askTiltify();
}, 5000);

// setInterval(function () {
// 	askTiltifyForAllDonations();
// }, 10000);

askTiltify();

// nodecg.listenFor("mark-donation-as-read", (value, ack) => {
// 	const isElement = (element) => element.id === value.id;
// 	const elementIndex = donationsRep.value.findIndex(isElement);
// 	if (elementIndex !== -1) {
// 		donationsRep.value[elementIndex].read = true;
// 		if (ack && !ack.handled) {
// 			ack(null, null);
// 		}
// 	} else {
// 		if (ack && !ack.handled) {
// 			ack(new Error("Donation not found to mark as read"), null);
// 		}
// 	}
// });

// nodecg.listenFor("mark-donation-as-shown", (value, ack) => {
// 	const isElement = (element) => element.id === value.id;
// 	const elementIndex = donationsRep.value.findIndex(isElement);
// 	if (elementIndex !== -1) {
// 		donationsRep.value[elementIndex].shown = true;
// 		if (ack && !ack.handled) {
// 			ack(null, null);
// 		}
// 	} else {
// 		if (ack && !ack.handled) {
// 			ack(new Error("Donation not found to mark as read"), null);
// 		}
// 	}
// });

nodecg.listenFor('markDonationReadUnread', (id: string) => {
	const donationIndex = donationsListRep.value.findIndex((donation) => donation.id === id);
	if (donationIndex > -1) {
		donationsListRep.value[donationIndex].read = !donationsListRep.value[donationIndex].read;
	} else {
		nodecg.log.error("[Donation] Could not find donation to mark as read/unread");
	}
});

// nodecg.listenFor('markDonationUnead', (id: string) => {
// 	const donationIndex = donationsListRep.value.findIndex((donation) => donation.id === id);
// 	if (donationIndex > -1) {
// 		donationsListRep.value[donationIndex].read = false;
// 	} else {
// 		nodecg.log.error("[Donation] Could not find donation to mark as unread");
// 	}
// });
