/* eslint-disable camelcase */
export interface ConfigSchema {
	obs: {
		enabled: boolean;
		port: number;
		ip: string;
		password: string;
		customTransitionsFolder?: string;
	};
	twitch: {
		parents: string[];
	};
	googleCredentials: GoogleCredentials;
	raisely: {
		enabled: boolean;
		accessToken?: string;
		campaignId?: string;
		profileId?: string;
	};
	hostname?: string;
	tiltify?: {
		enabled: boolean;
		key: string;
		campaign: string;
		id: string;
	};
	graphql?: {
		url: string;
		event: string;
	};
	x32?: {
		enabled: boolean;
		ip: string;
	};
	asmm?: {
		enabled: boolean;
		url: string;
		password: string;
	};
}

interface GoogleCredentials {
	enabled: boolean; // Custom added
	sheetname: string; // Custom added
	spreadsheet: string;
	installed: {
		client_id: string;
		project_id: string;
		auth_uri: string;
		token_uri: string;
		auth_provider_x509_cert_url: string;
		client_secret: string;
		redirect_uris: string[];
	};
}
