import * as nodecgApiContext from './nodecg-api-context';
import { request, gql } from 'graphql-request';
import { z } from 'zod';

import type { User as AusSpeedrunsUser } from '@asm-graphics/types/AusSpeedrunsWebsite';

const nodecg = nodecgApiContext.get();

const allUsersRep = nodecg.Replicant<AusSpeedrunsUser[]>('all-usernames', { defaultValue: [] })

const QUERY_USERS = gql`
	query {
		users {
			id
			username
			pronouns
		}
	}
`;

const queryUsers = z.object({
	users: z.object({
		id: z.string(),
		username: z.string(),
		pronouns: z.string().optional(),
	}).array()
});

async function getAllUsers() {
	if (nodecg.bundleConfig.graphql === undefined) return;

	try {
		const results = await request(nodecg.bundleConfig.graphql!.url, QUERY_USERS);

		return queryUsers.parse(results).users;
	} catch (error) {
		nodecg.log.error('[GraphQL Users Import]: ' + error);
		return [];
	}
}

getAllUsers().then(allUsers => {
	allUsersRep.value = allUsers ?? [];
});
