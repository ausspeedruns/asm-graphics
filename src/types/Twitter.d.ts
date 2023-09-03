/* eslint-disable camelcase */
export interface RulesRes {
	data: {
		id: string;
		value: string;
		tag: string;
		meta: {
			sent: number;
		};
		errors: Object;
	}[];
}

export interface Tweet {
	data: Data;
	includes: TweetIncludes;
	matchingRules: MatchingRule[];
}

interface Data {
	authorID: string;
	id: string;
	text: string;
	created_at: string;
}

interface TweetIncludes {
	users: User[];
}

interface User {
	id: string;
	name: string;
	username: string;
}

interface MatchingRule {
	id: number;
	tag: string;
}
