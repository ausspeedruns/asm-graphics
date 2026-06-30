export interface Credits {
	logo: string;
	eventName: string;
	sections: CreditsSection[];
}

export interface CreditsSection {
	title: string;
	names: CreditsName[];
}

export interface CreditsName {
	name: string;
	role?: string;
}
