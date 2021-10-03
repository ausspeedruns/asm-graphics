export interface Donation {
	desc?: string;
	id: string | number;
	read: boolean;
	time: string;
	name: string;
	amount: number;
	currencySymbol: string;
}
