import axios, { AxiosError, AxiosResponse } from "axios";

import * as nodecgApiContext from "../nodecg-api-context";
import type { Donation } from "@asm-graphics/types/Donations";
import { TiltifyCampaignReturn, TiltifyDonationMatchReturn, TiltifyDonationsReturn } from "@asm-graphics/types/TiltifyReturn";
import _ from "underscore";

const nodecg = nodecgApiContext.get();
const ncgLog = new nodecg.Logger("Tiltify-V5");
const tiltifyConfig = nodecg.bundleConfig.tiltify!; // This script only gets imported if there is a tiltify config

import { donationTotalRep, donationsRep, donationMatchesRep } from "../replicants";

let accessToken = "";

// Get access token
async function getAccessToken() {
	try {
		const res = await axios.post(
			`https://v5api.tiltify.com/oauth/token?client_id=${tiltifyConfig.id}&client_secret=${tiltifyConfig.key}&grant_type=client_credentials`,
		);
		if (res.data.access_token) {
			ncgLog.info("Got access token!");
			accessToken = res.data.access_token;
			ncgLog.info("Token data", JSON.stringify(res.data));
		}
	} catch (error: unknown | AxiosError) {
		if (axios.isAxiosError(error)) {
			ncgLog.error("getAccessToken axios error: ", JSON.stringify(error));
		}
		else {
			ncgLog.error("getAccessToken unknown error: ", JSON.stringify(error));
		}
	}
}

// Get campaign data
async function getCampaignData() {
	if (!accessToken) return;
	try {
		const res = await axios.get<null, AxiosResponse<TiltifyCampaignReturn>>(
			`https://v5api.tiltify.com/api/public/campaigns/${tiltifyConfig.campaign}`,
			{ headers: { Authorization: `Bearer ${accessToken}` } },
		);
		if (res.data?.data?.amount_raised) donationTotalRep.value = parseFloat(res.data.data.amount_raised.value);
	} catch (error: unknown | AxiosError) {
		if (axios.isAxiosError(error)) {
			if (error.status === 401) {
				getAccessToken();
			}
			else {
				ncgLog.error("getDonationsData axios error: ", JSON.stringify(error));
			}
		}
		else {
			ncgLog.error("getCampaignData unknown error: ", JSON.stringify(error));
		}
	}
}

async function getDonationsData() {
	if (!accessToken) return;
	try {
		const res = await axios.get<null, AxiosResponse<TiltifyDonationsReturn>>(
			`https://v5api.tiltify.com/api/public/campaigns/${tiltifyConfig.campaign}/donations?limit=100`,
			{ headers: { Authorization: `Bearer ${accessToken}` } },
		);
		const tiltifyResDonations = res.data.data;

		// New donations
		const newDonos = tiltifyResDonations.filter(
			(donation) => donationsRep.value.findIndex((oldDono) => oldDono.id === donation.id.toString()) === -1,
		);

		if (newDonos.length > 0) {
			// Correct format for our donation format
			const parsedDonos: Donation[] = newDonos.map((donation) => ({
				id: donation.id,
				amount: parseFloat(donation.amount.value),
				read: false,
				currencySymbol: getCurrencySymbol(donation.amount.currency),
				name: donation.donor_name,
				time: new Date(donation.completed_at).getTime(),
				desc: donation.donor_comment,
				currencyCode: donation.amount.currency,
			}));

			const mutableDonations = _.clone(donationsRep.value);

			donationsRep.value = mutableDonations.concat(parsedDonos);
		}
	} catch (error: unknown | AxiosError) {
		if (axios.isAxiosError(error)) {
			if (error.status === 401) {
				getAccessToken();
			}
			else {
				ncgLog.error("getDonationsData axios error: ", JSON.stringify(error));
			}
		}
		else {
			ncgLog.error("getDonationsData unknown error: ", JSON.stringify(error));
		}
	}
}

async function getDonationMatchData() {
	if (!accessToken) return;
	try {
		const res = await axios.get<null, AxiosResponse<TiltifyDonationMatchReturn>>(
			`https://v5api.tiltify.com/api/public/campaigns/${tiltifyConfig.campaign}/donation_matches`,
			{ headers: { Authorization: `Bearer ${accessToken}` } },
		);
		const tiltifyResDonationMatches = res.data.data;

		// {
		// 	"active": true,
		// 	"amount": { "currency": "AUD", "value": "3000.00" },
		// 	"completed_at": null,
		// 	"donation_id": "b45db459-090b-49ad-aec9-abfd9870e845",
		// 	"ends_at": "2024-03-24T06:38:18Z",
		// 	"id": "ede97d2e-1c90-41e8-b318-68c3550dcb80",
		// 	"inserted_at": "2024-03-22T00:38:21Z",
		// 	"matched_by": "A Bear with a Shotgun",
		// 	"pledged_amount": { "currency": "AUD", "value": "3000.00" },
		// 	"started_at_amount": { "currency": "AUD", "value": "0.00" },
		// 	"starts_at": "2024-03-24T06:38:18Z",
		// 	"total_amount_raised": { "currency": "AUD", "value": "50.00" },
		// 	"updated_at": "2024-03-22T00:38:21Z"
		// }

		// Donation matches
		donationMatchesRep.value = tiltifyResDonationMatches.map((data) => ({
			id: data.id,
			name: data.matched_by,
			active: data.active,
			amount: parseFloat(data.total_amount_raised.value),
			pledge: parseFloat(data.pledged_amount.value),
			time: new Date(data.starts_at).getTime(),
			currencyCode: data.pledged_amount.currency,
			currencySymbol: getCurrencySymbol(data.pledged_amount.currency),
			updated: Date.now(),
			endsAt: new Date(data.ends_at).getTime(),
			completedAt: new Date(data.completed_at).getTime(),
			read: false, // Will always be false
			desc: "", // Will always be empty,
		}));
	} catch (error: unknown | AxiosError) {
		if (axios.isAxiosError(error)) {
			if (error.status === 401) {
				getAccessToken();
			}
			else {
				ncgLog.error("getDonationMatchData axios error: ", JSON.stringify(error));
			}
		}
		else {
			ncgLog.error("getDonationMatchData unknown error: ", JSON.stringify(error));
		}
	}
}

// Initialise
async function tiltifyInit() {
	// Update access every hour
	setInterval(
		() => {
			getAccessToken();
		},
		30 * 60 * 1000,
	);

	// Get data
	setInterval(() => {
		getCampaignData();
		getDonationsData();
		getDonationMatchData();
	}, 5000);

	getAccessToken();
}

if (tiltifyConfig.enabled) {
	ncgLog.info("Tiltify enabled");
	tiltifyInit();
} else {
	ncgLog.info("Tiltify disabled");
}

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
