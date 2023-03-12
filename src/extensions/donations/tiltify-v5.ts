import axios, { AxiosError, AxiosResponse } from 'axios';

import * as nodecgApiContext from '../nodecg-api-context';
import type NodeCG from '@alvancamp/test-nodecg-types';
import type { Donation } from '@asm-graphics/types/Donations';
import { TiltifyCampaignReturn, TiltifyDonationsReturn } from '@asm-graphics/types/TiltifyReturn';
import _ from 'underscore';

const nodecg = nodecgApiContext.get();
const ncgLog = new nodecg.Logger('Tiltify-V5');
const tiltifyConfig = nodecg.bundleConfig.tiltify!;	// This script only gets imported if there is a tiltify config

const donationTotalRep = nodecg.Replicant('donationTotal') as unknown as NodeCG.ServerReplicantWithSchemaDefault<number>;
const donationsListRep = nodecg.Replicant('donations') as unknown as NodeCG.ServerReplicantWithSchemaDefault<Donation[]>;

let accessToken = "";

// Get access token
async function getAccessToken() {
	const res = await axios.post(`https://v5api.tiltify.com/oauth/token?client_id=${tiltifyConfig.id}&client_secret=${tiltifyConfig.key}&grant_type=client_credentials`);
	if (res.data.access_token) {
		ncgLog.info('Got access token!');
		accessToken = res.data.access_token;
		ncgLog.info('Token data', JSON.stringify(res.data));
	}
}

// Get campaign data
async function getCampaignData() {
	if (!accessToken) return;
	try {
		const res = await axios.get<null, AxiosResponse<TiltifyCampaignReturn>>(`https://v5api.tiltify.com/api/public/campaigns/${tiltifyConfig.campaign}`, { headers: { Authorization: `Bearer ${accessToken}` } });
		if (res.data?.data?.amount_raised) donationTotalRep.value = parseFloat(res.data.data.amount_raised.value);
	} catch (error) {
		if ((error as any).status === 401) {
			getAccessToken();
		}
		ncgLog.error("Total", JSON.stringify(error));
		ncgLog.error("Potential Tiltify Error", JSON.stringify((error as any).response));
	}
}

async function getDonationsData() {
	if (!accessToken) return;
	try {
		const res = await axios.get<null, AxiosResponse<TiltifyDonationsReturn>>(`https://v5api.tiltify.com/api/public/campaigns/${tiltifyConfig.campaign}/donations?limit=100`, { headers: { Authorization: `Bearer ${accessToken}` } });
		const tiltifyResDonations = res.data.data;

		// New donations
		const newDonos = tiltifyResDonations.filter(donation => donationsListRep.value.findIndex(oldDono => oldDono.id === donation.id.toString()) === -1);

		if (newDonos.length > 0) {
			// Correct format for our donation format
			const parsedDonos: Donation[] = newDonos.map(donation => ({
				id: donation.id,
				amount: parseFloat(donation.amount.value),
				read: false,
				currencySymbol: getCurrencySymbol(donation.amount.currency),
				name: donation.donor_name,
				time: new Date(donation.completed_at).getTime(),
				desc: donation.donor_comment,
				currencyCode: donation.amount.currency,
			}))

			const mutableDonations = _.clone(donationsListRep.value);

			donationsListRep.value = mutableDonations.concat(parsedDonos);
		}
	} catch (error) {
		if ((error as any).status === 401) {
			getAccessToken();
		}
		ncgLog.error("Donations", JSON.stringify(error));
		ncgLog.error("Potential Tiltify Error", JSON.stringify((error as any).response));
	}
}

// Initialise
async function tiltifyInit() {
	// Update access every hour
	setInterval(() => {
		getAccessToken();
	}, 30 * 60 * 1000);

	// Get data
	setInterval(() => {
		getCampaignData();
		getDonationsData();
	}, 5000);

	getAccessToken();
}

if (tiltifyConfig.enabled) {
	ncgLog.info("Tiltify enabled");
	tiltifyInit();
} else {
	ncgLog.info("Tiltify disabled");
}

nodecg.listenFor('markDonationReadUnread', (id: string) => {
	const donationIndex = donationsListRep.value.findIndex((donation) => donation.id === id);
	if (donationIndex > -1) {
		donationsListRep.value[donationIndex].read = !donationsListRep.value[donationIndex].read;
	} else {
		nodecg.log.error("[Donation] Could not find donation to mark as read/unread");
	}
});

function getCurrencySymbol(currencyCode: string) {
	switch (currencyCode.toUpperCase()) {
		case "AUD":
		case "NZD":
		case "USD":
		case "CAD":
			return "$";
		case "GBP":
			return "£";
		case "EUR":
			return "€";
		case "JPY":
			return "¥";
		default:
			return currencyCode;
	}
}
