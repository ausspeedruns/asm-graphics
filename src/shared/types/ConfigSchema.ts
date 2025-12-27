export interface ConfigSchema {
	obs: {
		enabled: boolean;
		port: number;
		ip: string;
		password: string;
		customTransitionsFolder?: string;
	};
	twitch?: {
		clientId?: string;
	};
	tiltify?: {
		enabled: boolean;
		key: string;
		campaign: string;
		id: string;
	};
	graphql?: {
		url: string;
		event: string;
		apiKey?: string;
	};
	x32?: {
		enabled: boolean;
		ip: string;
	};
}
