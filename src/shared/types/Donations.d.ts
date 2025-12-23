export type Donation = {
	desc?: string;
	id: string;
	read: boolean;
	time: number;
	name: string;
	amount: number;
	currencySymbol: string;
	currencyCode?: string;
};

export interface DonationMatch extends Donation {
	pledge: number;
	endsAt: number;
	completedAt: number;
	active: boolean;
	updated: number;
}
