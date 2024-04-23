// Mostly handles the activation and deactivation of incentives
import { Goal, War } from "@asm-graphics/types/Incentives";
import * as nodecgApiContext from "./nodecg-api-context";
import { request, gql } from "graphql-request";
import { z } from "zod";
import _ from "underscore";

import { incentivesRep, incentivesUpdatedLastRep } from "./replicants";

const nodecg = nodecgApiContext.get();

const baseIncentiveSchema = z.object({
	id: z.string(),
	run: z.object({
		game: z.string(),
		scheduledTime: z.string(),
	}),
	title: z.string(),
	notes: z.string(),
	active: z.boolean(),
});

const incentiveSchema = z.object({
	incentives: z.array(
		z.discriminatedUnion("type", [
			baseIncentiveSchema.extend({
				type: z.literal("goal"),
				data: z.object({
					goal: z.number(),
					current: z.number(),
				}),
			}),
			baseIncentiveSchema.extend({
				type: z.literal("war"),
				data: z.object({
					options: z.array(
						z.object({
							name: z.string(),
							total: z.number(),
						}),
					),
				}),
			}),
		]),
	),
});

if (nodecg.bundleConfig.graphql?.url) {
	setInterval(async () => {
		getIncentives();
	}, 5000);
}

nodecg.listenFor("updateIncentives", () => {
	getIncentives().then((success) => {
		if (success) {
			nodecg.sendMessage("incentivesUpdated", 200);
		} else {
			nodecg.sendMessage("incentivesUpdated", 418);
		}
	});
});

async function getIncentives() {
	if (!nodecg.bundleConfig.graphql) return;

	try {
		const results = await request(
			nodecg.bundleConfig.graphql!.url,
			gql`
				query {
					incentives(where: { event: { shortname: { equals: "${nodecg.bundleConfig.graphql.event}" } } }) {
						id
						run {
							game
							scheduledTime
						}
						title
						notes
						type
						data
						active
					}
				}
		`,
		);

		const rawIncentives = incentiveSchema.parse(results).incentives;
		const parsedIncentives = rawIncentives.map((incentive) => {
			switch (incentive.type) {
				case "goal":
					return {
						active: incentive.active,
						game: incentive.run.game,
						notes: incentive.notes,
						goal: incentive.data.goal,
						incentive: incentive.title,
						index: new Date(incentive.run.scheduledTime).getTime(),
						total: incentive.data.current,
						type: capitalizeFirstLetter(incentive.type),
					} as Goal;
				case "war":
					return {
						active: incentive.active,
						game: incentive.run.game,
						notes: incentive.notes,
						incentive: incentive.title,
						index: new Date(incentive.run.scheduledTime).getTime(),
						options: incentive.data.options,
						type: capitalizeFirstLetter(incentive.type),
					} as War;
			}
		});

		parsedIncentives.sort((a, b) => a.index - b.index);
		parsedIncentives.forEach((incentive, i) => (parsedIncentives[i] = { ...incentive, index: i }));

		if (!_.isEqual(incentivesRep.value, parsedIncentives)) {
			incentivesRep.value = parsedIncentives;
		}
		incentivesUpdatedLastRep.value = Date.now();
		return true;
	} catch (error) {
		nodecg.log.error("[GraphQL Incentives]: " + error);
		return false;
	}
}

function capitalizeFirstLetter(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
