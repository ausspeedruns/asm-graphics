export interface ConfigSchema {
	obs?: {
		autoConnect?: boolean;
		port?: number;
		ip?: string;
		password?: string;
		customTransitionsFolder?: string;
	};
	tiltify?: {
		autoConnect?: boolean;
		key?: string;
		campaign?: string;
		id?: string;
	};
	graphql?: {
		url?: string;
		event?: string;
		apiKey?: string;
	};
	x32?: {
		autoConnect?: boolean;
		ip?: string;
	};
}
