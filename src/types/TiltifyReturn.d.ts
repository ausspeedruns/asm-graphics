export interface TiltifyCampaignReturn {
	data: TiltifyCampaignData;
}

export interface TiltifyCampaignData {
	amount_raised: Amount;
	avatar: Avatar;
	cause_id: string;
	description: string;
	fundraising_event_id: string;
	goal: Amount;
	has_schedule: boolean;
	id: string;
	inserted_at: string;
	legacy_id: number;
	name: string;
	original_goal: Amount;
	published_at: string;
	retired_at?: string;
	slug: string;
	status: string;
	supporting_type: string;
	total_amount_raised: Amount;
	updated_at: string;
	url: string;
	user: User;
	user_id: string;
}

export interface Amount {
	currency: string;
	value: string;
}

export interface Avatar {
	alt: string;
	height: number;
	src: string;
	width: number;
}

export interface User {
	avatar: Avatar;
	description: string;
	id: string;
	legacy_id: number;
	slug: string;
	social: Social;
	total_amount_raised: Amount;
	url: string;
	username: string;
}

export interface Social {
	discord?: string;
	facebook?: string;
	instagram?: string;
	snapchat?: string;
	tiktok?: string;
	twitch?: string;
	twitter?: string;
	website?: string;
	youtube?: string;
}

export interface TiltifyDonationsReturn {
	data: TiltifyDonation[];
	metadata: Metadata;
}

export interface TiltifyDonation {
	amount: Amount;
	campaign_id: string;
	completed_at: Date;
	donor_comment: string;
	donor_name: string;
	fundraising_event_id: string;
	id: string;
	legacy_id: number;
	poll_id: string;
	poll_option_id: string;
	reward_id: string;
	sustained: boolean;
	target_id: string;
	team_event_id: string;
}

export interface Metadata {
	after: string;
	before?: string;
	limit: number;
}

export interface TiltifyDonationMatchReturn {
	data: Datum[];
	metadata: Metadata;
}

export interface Datum {
	active: boolean;
	amount: Amount;
	completed_at: Date;
	donation_id: string;
	ends_at: Date;
	id: string;
	inserted_at: Date;
	matched_by: string;
	pledged_amount: Amount;
	started_at_amount: Amount;
	starts_at: Date;
	total_amount_raised: Amount;
	updated_at: Date;
}
