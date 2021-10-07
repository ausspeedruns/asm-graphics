export interface Donation {
	desc?: string;
	id: string | number;
	read: boolean;
	time: number;
	name: string;
	amount: number;
	currencySymbol: string;
}
