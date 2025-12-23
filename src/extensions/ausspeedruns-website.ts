import * as nodecgApiContext from "./nodecg-api-context.js";
import { z } from "zod";

import { allAusSpeedrunsUsernamesRep } from "./replicants.js";
import { queryGraphQL } from "./util/graphql.js";

const nodecg = nodecgApiContext.get();

const QUERY_USERS = `
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
		const results = await queryGraphQL(nodecg.bundleConfig.graphql.url, QUERY_USERS);

		return queryUsers.parse(results).users;
	} catch (error) {
		nodecg.log.error("[GraphQL Users Import]: " + error);
		return [];
	}
}

getAllUsers().then(
	(allUsers) => {
		allAusSpeedrunsUsernamesRep.value = allUsers ?? [];
	},
	() => {},
);
