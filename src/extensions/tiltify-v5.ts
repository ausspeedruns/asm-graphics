import * as nodecgApiContext from "./nodecg-api-context.js";
import type { Donation } from "@asm-graphics/types/Donations.js";
import _ from "underscore";
import z from "zod";
import { getReplicant } from "./replicants.js";
import type { ConnectionStatus } from "@asm-graphics/shared/replicants.js";

const nodecg = nodecgApiContext.get();
const ncgLog = new nodecg.Logger("Tiltify-V5");

const donationTotalRep = getReplicant("donationTotal");
const donationsRep = getReplicant("donations");
const donationMatchesRep = getReplicant("donation-matches");
const tiltifyStatusRep = getReplicant("tiltify:status");
const tiltifyConnectionDetailsRep = getReplicant("tiltify:connectionDetails");

const AmountSchema = z.object({
	currency: z.string(),
	value: z.string(),
});

const PaginationMetadataSchema = z.object({
	after: z.string().nullable(),
	before: z.string().nullable(),
	limit: z.number(),
});

let accessToken = "";
let expiryTime = 0;

const status = {
	accessCode: false,
	campaignData: false,
	donationsData: false,
	donationMatchesData: false,
};

const TiltifyOAuthTokenSchema = z.object({
	access_token: z.string(),
	expires_in: z.number(), // seconds
	token_type: z.string(),
});

// Get access token
async function getAccessToken() {
	updateTiltifyStatus("connecting", "Getting Tiltify access token...");

	try {
		const res = await fetch(
			`https://v5api.tiltify.com/oauth/token?client_id=${tiltifyConnectionDetailsRep.value.clientId}&client_secret=${tiltifyConnectionDetailsRep.value.clientSecret}&grant_type=client_credentials`,
			{ method: "POST" },
		);
		const data = await res.json();

		const parsedData = TiltifyOAuthTokenSchema.safeParse(data);

		if (!parsedData.success) {
			ncgLog.error("getAccessToken: Failed to parse data");
			ncgLog.error(JSON.stringify(data));
			ncgLog.error(parsedData.error);
			status.accessCode = false;
			
			updateTiltifyStatus("error", "Get Access Token: Failed to parse data. Check console for details.");
			return;
		}

		if (parsedData.data.access_token) {
			ncgLog.info("Got access token!");
			accessToken = parsedData.data.access_token;
			expiryTime = parsedData.data.expires_in;
			ncgLog.info("Token data", JSON.stringify(parsedData.data));
			status.accessCode = true;
		}
	} catch (error) {
		ncgLog.error("getAccessToken error: ", JSON.stringify(error));
	}
}

const AvatarSchema = z.object({
	alt: z.string(),
	height: z.number(),
	src: z.string(),
	width: z.number(),
});

const TiltifyCampaignSchema = z.object({
	amount_raised: AmountSchema,
	avatar: AvatarSchema,
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
	retired_at: z.string().nullable(),
	slug: z.string(),
	status: z.string(),
	supporting_type: z.string(),
	total_amount_raised: AmountSchema,
	updated_at: z.string(),
	url: z.string(),
	user: z.object({
		avatar: AvatarSchema,
		description: z.string(),
		id: z.string(),
		legacy_id: z.number(),
		slug: z.string(),
		social: z.object({
			discord: z.string().nullable(),
			facebook: z.string().nullable(),
			instagram: z.string().nullable(),
			snapchat: z.string().nullable(),
			tiktok: z.string().nullable(),
			twitch: z.string().nullable(),
			twitter: z.string().nullable(),
			youtube: z.string().nullable(),
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
			`https://v5api.tiltify.com/api/public/campaigns/${tiltifyConnectionDetailsRep.value.campaignId}`,
			{
				headers: { Authorization: `Bearer ${accessToken}` },
			},
		);
		const data = await res.json();

		const parsedData = TiltifyCampaignEndpointSchema.safeParse(data);

		// {
		// 	data: {
		// 		id: "c20c9685-cd1b-4d5f-8595-74378cb06859",
		// 		name: "AusSpeedruns At DreamHack 2024",
		// 		status: "retired",
		// 		user: {
		// 			id: "816e4ebc-24c4-46bf-806d-27ea12750cc0",
		// 			description: "Australian Speedrunning Marathon or ASM for short is the aussie representation of the video game hobby known as Speedrunning. When we're not breaking times in games, we're working together to produce a marathon of our content to raise money for charity!",
		// 			url: "/@ausspeedruns",
		// 			username: "AusSpeedruns",
		// 			slug: "ausspeedruns",
		// 			avatar: {
		// 				width: 200,
		// 				alt: "alt",
		// 				src: "https://assets.tiltify.com/uploads/user/thumbnail/42581/d9d68bdb-24ec-4bb4-9595-de50a7479667.jpeg",
		// 				height: 200
		// 			},
		// 			social: {
		// 				twitch: "ausspeedruns",
		// 				twitter: "ausspeedruns",
		// 				facebook: null,
		// 				discord: "https://discord.ausspeedruns.com/",
		// 				website: "https://AusSpeedruns.com",
		// 				snapchat: null,
		// 				instagram: "ausspeedruns",
		// 				youtube: "@AusSpeedruns",
		// 				tiktok: "ausspeedruns"
		// 			},
		// 			total_amount_raised: {
		// 				value: "157778.91",
		// 				currency: "USD"
		// 			},
		// 			legacy_id: 42581
		// 		},
		// 		description: "AusSpeedruns is at the one and only DreamHack Melbourne!! We have 3 days of speedrunning lined up ranging from Super Mario 64 to Half Life 2 to BioShock to even more! Check out the schedule here: https://ausspeedruns.com/ASDH2024/schedule. We are as always excited to be raising money for Game On Cancer to help support cancer research!",
		// 		url: "/@ausspeedruns/asdh2024",
		// 		cause_id: "71e7c11b-2a80-48ed-bf7a-f1c85cb901e6",
		// 		inserted_at: "2024-04-22T11:02:38Z",
		// 		updated_at: "2025-04-07T18:53:43Z",
		// 		user_id: "816e4ebc-24c4-46bf-806d-27ea12750cc0",
		// 		slug: "asdh2024",
		// 		campaign_id: null,
		// 		avatar: {
		// 			width: 64,
		// 			alt: "alt",
		// 			src: "https://assets.tiltify.com/uploads/event/thumbnail/528963/blob-bc5bd9c1-d48d-4ea6-b9b7-6c04cb8bda4e.png",
		// 			height: 64
		// 		},
		// 		fundraising_event_id: "efbb0649-4394-4bd2-ae08-9d3a8e852ebd",
		// 		supporting_type: "none",
		// 		retired_at: "2024-07-02T12:45:51Z",
		// 		published_at: "2024-04-22T11:02:38Z",
		// 		parent_facts: [
		// 			{
		// 				id: "ff68d181-11d6-4946-84c9-e2471f78692c",
		// 				name: "Cure Cancer",
		// 				usage_type: "cause"
		// 			},
		// 			{
		// 				id: "efbb0649-4394-4bd2-ae08-9d3a8e852ebd",
		// 				name: "AusSpeedruns x Game On Cancer® 2024",
		// 				usage_type: "fundraising_event_activation"
		// 			}
		// 		],
		// 		original_goal: {
		// 			value: "3000",
		// 			currency: "AUD"
		// 		},
		// 		goal: {
		// 			value: "10000",
		// 			currency: "AUD"
		// 		},
		// 		amount_raised: {
		// 			value: "9956.00",
		// 			currency: "AUD"
		// 		},
		// 		total_amount_raised: {
		// 			value: "9956.00",
		// 			currency: "AUD"
		// 		},
		// 		livestream: {
		// 			type: "twitch",
		// 			channel: "ausspeedruns"
		// 		},
		// 		legacy_id: 528963,
		// 		donate_url: "https://donate.tiltify.com/@ausspeedruns/asdh2024",
		// 		has_schedule: false,
		// 		team_campaign_id: null
		// 	}
		// }

		if (!parsedData.success) {
			ncgLog.error("getCampaignData: Failed to parse data");
			ncgLog.error(JSON.stringify(data));
			ncgLog.error(parsedData.error);
			updateTiltifyStatus("error", "Get Campaign Data: Failed to parse data. Check console for details.");
			return;
		}

		if (parsedData.data.data.amount_raised) {
			donationTotalRep.value = parseFloat(parsedData.data.data.amount_raised.value);
		}

		status.campaignData = true;
	} catch (error) {
		ncgLog.error("getCampaignData error: ", JSON.stringify(error));
		status.campaignData = false;
	}
}

const TiltifyDonationSchema = z.object({
	amount: AmountSchema,
	campaign_id: z.string(),
	completed_at: z.string(),
	currency: z.string().optional(),
	donor_comment: z.string().nullable(),
	donor_name: z.string(),
	id: z.string(),
	inserted_at: z.string().optional(),
	updated_at: z.string().optional(),
});

const TiltifyDonationsEndpointSchema = z.object({
	data: z.array(TiltifyDonationSchema),
	metadata: PaginationMetadataSchema,
});

async function getDonationsData() {
	if (!accessToken) return;
	try {
		const res = await fetch(
			`https://v5api.tiltify.com/api/public/campaigns/${tiltifyConnectionDetailsRep.value.campaignId}/donations?limit=100`,
			{ headers: { Authorization: `Bearer ${accessToken}` } },
		);
		const data = await res.json();

		const parsedData = TiltifyDonationsEndpointSchema.safeParse(data);

		if (!parsedData.success) {
			ncgLog.error("getDonationsData: Failed to parse data");
			ncgLog.error(JSON.stringify(data));
			ncgLog.error(parsedData.error);
			updateTiltifyStatus("error", "Get Donations Data: Failed to parse data. Check console for details.");
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
		status.donationsData = true;
	} catch (error) {
		ncgLog.error("getDonationsData error: ", JSON.stringify(error));
		status.donationsData = false;
	}
}

const TiltifyDonationMatchSchema = z.object({
	active: z.boolean(),
	amount: AmountSchema,
	completed_at: z.string().nullable(),
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
			`https://v5api.tiltify.com/api/public/campaigns/${tiltifyConnectionDetailsRep.value.campaignId}/donation_matches`,
			{ headers: { Authorization: `Bearer ${accessToken}` } },
		);
		const data = await res.json();

		const parsedData = TiltifyDonationMatchEndpointSchema.safeParse(data);

		if (!parsedData.success) {
			ncgLog.error("getDonationMatchData: Failed to parse data");
			ncgLog.error(JSON.stringify(data));
			ncgLog.error(parsedData.error);
			updateTiltifyStatus("error", "Get Donation Match Data: Failed to parse data. Check console for details.");
			return;
		}

		const tiltifyResDonationMatches = parsedData.data.data;

		// {
		// 	active: false,
		// 	id: "93105479-47e9-4390-bde1-10dd53bd3c27",
		// 	amount: {
		// 		value: "2000.00",
		// 		currency: "AUD"
		// 	},
		// 	inserted_at: "2024-04-26T00:45:15Z",
		// 	updated_at: "2024-04-26T12:29:06Z",
		// 	completed_at: "2024-04-26T12:29:06Z",
		// 	starts_at: "2024-04-29T00:45:13Z",
		// 	donation_id: "44bca58b-12a7-47b1-981c-41f493079d37",
		// 	ends_at: "2024-04-29T00:45:13Z",
		// 	started_at_amount: {
		// 		value: "55.00",
		// 		currency: "AUD"
		// 	},
		// 	pledged_amount: {
		// 		value: "2000.00",
		// 		currency: "AUD"
		// 	},
		// 	match_type: "amount",
		// 	total_amount_raised: {
		// 		value: "1982.00",
		// 		currency: "AUD"
		// 	},
		// 	matched_by: "A Bear with a Shotgun"
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
		status.donationMatchesData = true;
	} catch (error) {
		ncgLog.error("getDonationMatchData error: ", JSON.stringify(error));
		status.donationMatchesData = false;
	}
}

let accessTokenTimeout: NodeJS.Timeout | undefined;
let campaignDataInterval: NodeJS.Timeout | undefined;

async function autoRefreshAccessToken() {
	await getAccessToken();

	const buffer = 60; // seconds
	const refreshIn = Math.max((expiryTime - buffer) * 1000, 30 * 1000); // Use the expiry time, a minimum of 30 seconds

	if (accessTokenTimeout) clearInterval(accessTokenTimeout);

	accessTokenTimeout = setTimeout(() => {
		void autoRefreshAccessToken();
	}, refreshIn);
}

// Initialise
async function connectToTiltify() {
	updateTiltifyStatus("connecting", "Connecting to Tiltify...");

	await autoRefreshAccessToken();

	// Get data
	campaignDataInterval = setInterval(() => {
		void getCampaignData();
		void getDonationsData();
		void getDonationMatchData();

		if (Object.values(status).every((statusValue) => statusValue)) {
			updateTiltifyStatus("connected", "Connected to Tiltify");
		} else {
			const errorMessage = "";

			for (const [key, value] of Object.entries(status)) {
				if (!value) {
					errorMessage.concat(`Failed to get ${camelCaseSplit(key)} data.\n`);
				}
			}

			updateTiltifyStatus("warning", errorMessage.trim());
		}
	}, 5000);
}

nodecg.listenFor("tiltify:setConnection", (data: boolean) => {
	if (data) {
		ncgLog.info("Tiltify connection requested via dashboard");
		void connectToTiltify();
	} else {
		ncgLog.info("Tiltify disconnected via dashboard");
		accessToken = "";
		if (accessTokenTimeout) clearInterval(accessTokenTimeout);
		if (campaignDataInterval) clearInterval(campaignDataInterval);
		updateTiltifyStatus("disconnected", "Disconnected via dashboard");
	}
});

if (nodecg.bundleConfig.tiltify?.autoConnect) {
	ncgLog.info("Tiltify enabled");
	void connectToTiltify();
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

function camelCaseSplit(str: string) {
	const split = str.replace(/([a-z])([A-Z])/g, "$1 $2");
	return split.charAt(0).toUpperCase() + split.slice(1);
}

function updateTiltifyStatus(status: ConnectionStatus['status'], message = "") {
	tiltifyStatusRep.value = {
		status,
		timestamp: Date.now(),
		message,
	};
}
