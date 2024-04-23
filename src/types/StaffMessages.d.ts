export interface StaffMessage {
	author: string;
	message: string;
	date: Date | string;
	fromHost?: boolean;
}
