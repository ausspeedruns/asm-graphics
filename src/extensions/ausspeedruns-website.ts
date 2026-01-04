import * as nodecgApiContext from "./nodecg-api-context.js";
import { z } from "zod";

import { getReplicant } from "./replicants.js";
import { queryGraphQL } from "./util/graphql.js";

const nodecg = nodecgApiContext.get();

const allAusSpeedrunsUsernamesRep = getReplicant("all-usernames");
const ausspeedrunsWebsiteSettingsRep = getReplicant("ausspeedruns-website:settings");

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
	if (!ausspeedrunsWebsiteSettingsRep.value.url) return;

	try {
		const results = await queryGraphQL(ausspeedrunsWebsiteSettingsRep.value.url, QUERY_USERS);

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
