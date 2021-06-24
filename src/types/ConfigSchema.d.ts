/* eslint-disable camelcase */
export interface Config {
	obs: {
		enabled: boolean;
		port: number;
		ip: string;
		password: string;
	};
	twitch: {
		parents: string[];
	};
	twitter: {
		enabled: boolean;
		key: string;
		secret: string;
		bearer?: string;
		rules: { value: string, tag: string }[];
	};
	googleCredentials: GoogleCredentials;
	raisely: {
		enabled: boolean;
		accessToken: string;
		campaignId: string;
	}
}

interface GoogleCredentials {
	enabled: boolean; // Custom added
	spreadsheet: string;
    installed: {
		client_id:                string;
		project_id:               string;
		auth_uri:                 string;
		token_uri:                string;
		auth_provider_x509_cert_url: string;
		client_secret:            string;
		redirect_uris:            string[];
	};
}