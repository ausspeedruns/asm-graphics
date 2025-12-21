import * as nodecgApiContext from "../nodecg-api-context";
import type { Donation } from "@asm-graphics/types/Donations";
import _ from "underscore";
import z from "zod";
import { donationTotalRep, donationsRep, donationMatchesRep } from "../replicants";

const nodecg = nodecgApiContext.get();
const ncgLog = new nodecg.Logger("Tiltify-V5");
const tiltifyConfig = nodecg.bundleConfig.tiltify!; // This script only gets imported if there is a tiltify config

const AmountSchema = z.object({
	currency: z.string(),
	value: z.string(),
});

const PaginationMetadataSchema = z.object({
	after: z.string(),
	before: z.string().optional(),
	limit: z.number(),
});

let accessToken = "";

const TiltifyOAuthTokenSchema = z.object({
	access_token: z.string(),
	expires_in: z.number(),
	token_type: z.string(),
});

// Get access token
async function getAccessToken() {
	try {
		const res = await fetch(
			`https://v5api.tiltify.com/oauth/token?client_id=${tiltifyConfig.id}&client_secret=${tiltifyConfig.key}&grant_type=client_credentials`,
			{ method: "POST" }
		);
		const data = await res.json();

		const parsedData = TiltifyOAuthTokenSchema.safeParse(data);

		if (!parsedData.success) {
			ncgLog.error("getAccessToken: Failed to parse data");
			ncgLog.error(JSON.stringify(data));
			ncgLog.error("Errors:");
			ncgLog.error(parsedData.error);
			return;
		}

		if (data.access_token) {
			ncgLog.info("Got access token!");
			accessToken = data.access_token;
			ncgLog.info("Token data", JSON.stringify(data));
		}
	} catch (error) {
		ncgLog.error("getAccessToken error: ", JSON.stringify(error));
	}
}

const TiltifyCampaignSchema = z.object({
	amount_raised: AmountSchema,
	avatar: z.object({
		alt: z.string(),
		height: z.number(),
		src: z.string(),
		width: z.number(),
	}),
	cause_id: z.string(),
	description: z.string(),
	fundraising_event_id: z.string(),
	goal: AmountSchema,
	has_schedule: z.boolean(),
	id: z.string(),
	inserted_at: z.string(),
	legacy_id: z.number(),
	name: z.string(),
	original_goal: AmountSchema,
	published_at: z.string(),
	retired_at: z.string().optional(),
	slug: z.string(),
	status: z.string(),
	supporting_type: z.string(),
	total_amount_raised: AmountSchema,
	updated_at: z.string(),
	url: z.string(),
	user: z.object({
		avatar: z.object({
			alt: z.string(),
			height: z.number(),
			src: z.string(),
			width: z.number(),
		}),
		description: z.string(),
		id: z.string(),
		legacy_id: z.number(),
		slug: z.string(),
		social: z.object({
			discord: z.string().optional(),
			facebook: z.string().optional(),
			instagram: z.string().optional(),
			snapchat: z.string().optional(),
			tiktok: z.string().optional(),
			twitch: z.string().optional(),
			twitter: z.string().optional(),
			youtube: z.string().optional(),
		}),
		total_amount_raised: AmountSchema,
		url: z.string(),
		username: z.string(),
	}),
	user_id: z.string(),
});

const TiltifyCampaignEndpointSchema = z.object({
	data: TiltifyCampaignSchema,
});

// Get campaign data
async function getCampaignData() {
	if (!accessToken) return;
	try {
		const res = await fetch(
			`https://v5api.tiltify.com/api/public/campaigns/${tiltifyConfig.campaign}`,
			{ headers: { Authorization: `Bearer ${accessToken}` } }
		);
		const data = await res.json();

		const parsedData = TiltifyCampaignEndpointSchema.safeParse(data);

		if (!parsedData.success) {
			ncgLog.error("getCampaignData: Failed to parse data");
			ncgLog.error(JSON.stringify(data));
			ncgLog.error("Errors:");
			ncgLog.error(parsedData.error);
			return;
		}

		if (data?.data?.amount_raised) donationTotalRep.value = parseFloat(data.data.amount_raised.value);
	} catch (error) {
		ncgLog.error("getCampaignData error: ", JSON.stringify(error));
	}
}

const TiltifyDonationSchema = z.object({
	amount: AmountSchema,
	campaign_id: z.string(),
	completed_at: z.string(),
	currency: z.string(),
	donor_comment: z.string().nullable(),
	donor_name: z.string(),
	id: z.string(),
	inserted_at: z.string(),
	updated_at: z.string(),
});

const TiltifyDonationsEndpointSchema = z.object({
	data: z.array(TiltifyDonationSchema),
	metadata: PaginationMetadataSchema,
});

async function getDonationsData() {
	if (!accessToken) return;
	try {
		const res = await fetch(
			`https://v5api.tiltify.com/api/public/campaigns/${tiltifyConfig.campaign}/donations?limit=100`,
			{ headers: { Authorization: `Bearer ${accessToken}` } },
		);
		const data = await res.json();

		const parsedData = TiltifyDonationsEndpointSchema.safeParse(data);

		if (!parsedData.success) {
			ncgLog.error("getDonationsData: Failed to parse data");
			ncgLog.error(JSON.stringify(data));
			ncgLog.error("Errors:");
			ncgLog.error(parsedData.error);
			return;
		}

		const tiltifyResDonations = parsedData.data.data;

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
				desc: donation.donor_comment ?? "",
				currencyCode: donation.amount.currency,
			}));

			const mutableDonations = _.clone(donationsRep.value);

			donationsRep.value = mutableDonations.concat(parsedDonos);
		}
	} catch (error) {
		ncgLog.error("getDonationsData error: ", JSON.stringify(error));
	}
}

const TiltifyDonationMatchSchema = z.object({
	active: z.boolean(),
	amount: AmountSchema,
	completed_at: z.date().nullable(),
	donation_id: z.string(),
	ends_at: z.string(),
	id: z.string(),
	inserted_at: z.string(),
	matched_by: z.string(),
	pledged_amount: AmountSchema,
	started_at_amount: AmountSchema,
	starts_at: z.string(),
	total_amount_raised: AmountSchema,
	updated_at: z.string(),
});

const TiltifyDonationMatchEndpointSchema = z.object({
	data: z.array(TiltifyDonationMatchSchema),
	metadata: PaginationMetadataSchema,
});

async function getDonationMatchData() {
	if (!accessToken) return;
	try {
		const res = await fetch(
			`https://v5api.tiltify.com/api/public/campaigns/${tiltifyConfig.campaign}/donation_matches`,
			{ headers: { Authorization: `Bearer ${accessToken}` } },
		);
		const data = await res.json();

		const parsedData = TiltifyDonationMatchEndpointSchema.safeParse(data);

		if (!parsedData.success) {
			ncgLog.error("getDonationMatchData: Failed to parse data");
			ncgLog.error(JSON.stringify(data));
			ncgLog.error("Errors:");
			ncgLog.error(parsedData.error);
			return;
		}

		const tiltifyResDonationMatches = parsedData.data.data;
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
			completedAt: new Date(data.completed_at ?? "").getTime(),
			read: false, // Will always be false
			desc: "", // Will always be empty,
		}));
	} catch (error) {
		ncgLog.error("getDonationMatchData error: ", JSON.stringify(error));
	}
}

// Initialise
async function tiltifyInit() {
	// Update access every hour
	setInterval(
		() => {
			void getAccessToken();
		},
		30 * 60 * 1000,
	);

	// Get data
	setInterval(() => {
		void getCampaignData();
		void getDonationsData();
		void getDonationMatchData();
	}, 5000);

	void getAccessToken();
}

if (tiltifyConfig.enabled) {
	ncgLog.info("Tiltify enabled");
	void tiltifyInit();
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
