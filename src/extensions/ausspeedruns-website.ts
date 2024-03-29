import * as nodecgApiContext from "./nodecg-api-context";
import { request, gql } from "graphql-request";
import { z } from "zod";

import { allAusSpeedrunsUsernamesRep } from "./replicants";

const nodecg = nodecgApiContext.get();

const QUERY_USERS = gql`
	query {
		users {
			id
			username
			pronouns
			twitch
		}
	}
`;

const queryUsers = z.object({
	users: z
		.object({
			id: z.string(),
			username: z.string(),
			pronouns: z.string().optional(),
			twitch: z.string().optional(),
		})
		.array(),
});

async function getAllUsers() {
	if (!nodecg.bundleConfig.graphql) return;

	try {
		const results = await request(nodecg.bundleConfig.graphql.url, QUERY_USERS);

		return queryUsers.parse(results).users;
	} catch (error) {
		nodecg.log.error("[GraphQL Users Import]: " + error);
		return [];
	}
}

getAllUsers().then((allUsers) => {
	allAusSpeedrunsUsernamesRep.value = allUsers ?? [];
});
