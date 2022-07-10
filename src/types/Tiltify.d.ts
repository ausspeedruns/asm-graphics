export interface Campaign {
	id: number;
	name: string;
	slug: string;
	startsAt: number;
	endsAt?: number;
	description: string;
	causeId: number;
	originalFundraiserGoal: number;
	fundraiserGoalAmount: number;
	supportingAmountRaised: number;
	amountRaised: number;
	supportable: boolean;
	status: string;
	type: string;
	avatar: Avatar;
	livestream: Livestream;
	causeCurrency: string;
	totalAmountRaised: number;
	user: User;
	fundraisingEventId: number;
	regionId: unknown;
	metadata: Metadata;
}

export interface Avatar {
	src: string;
	alt: string;
	width: number;
	height: number;
}

export interface Livestream {
	type: string;
	channel: string;
}

export interface Metadata {
}

export interface User {
	id: number;
	username: string;
	slug: string;
	url: string;
	avatar: Avatar;
}

export interface Donation {
	id: number;
	amount: number;
	name: string;
	comment: string;
	completedAt: number;
	updatedAt: number;
	sustained: boolean;
}

