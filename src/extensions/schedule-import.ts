import * as nodecgApiContext from "./nodecg-api-context";
import { request, gql } from "graphql-request";
import { z } from "zod";
import moment from "moment";
import { v4 as uuid } from "uuid";

import type { RunDataArray, RunDataPlayer, RunDataTeam } from "@asm-graphics/types/RunData";

const nodecg = nodecgApiContext.get();

const SPEEDCONTROL_runDataArray = nodecg.Replicant<RunDataArray>("runDataArray", "nodecg-speedcontrol");

const SCHEDULE_QUERY = gql`
	query {
		event(where: { shortname: "${nodecg.bundleConfig.graphql?.event}" }) {
			runs(orderBy: {scheduledTime: asc}) {
				id
				game
				category
				platform
				techPlatform
				specialRequirements
				race
				coop
				estimate
				scheduledTime
				runners {
					id
					username
					pronouns
					twitch
				}
			}
		}
	}
`;

const scheduleSchema = z.object({
	event: z.object({
		runs: z.array(
			z.object({
				id: z.string(),
				game: z.string(),
				category: z.string(),
				platform: z.string(),
				race: z.boolean(),
				coop: z.boolean(),
				estimate: z.string(),
				scheduledTime: z
					.preprocess((a) => new Date(z.string().parse(a)), z.date())
					.transform((a) => new Date(a)),
				runners: z.array(
					z.object({
						id: z.string(),
						username: z.string(),
						pronouns: z.string(),
						twitch: z.string(),
					}),
				),
				techPlatform: z.string(),
				specialRequirements: z.string(),
			}),
		),
	}),
});

async function getSchedule() {
	if (nodecg.bundleConfig.graphql === undefined) return;

	try {
		const results = await request(nodecg.bundleConfig.graphql.url, SCHEDULE_QUERY);

		return scheduleSchema.parse(results).event.runs;
	} catch (error) {
		nodecg.log.error("[GraphQL Schedule Import]: " + error);
		return [];
	}
}

function convertScheduleToSpeedcontrol(runs: z.TypeOf<typeof scheduleSchema>["event"]["runs"]): RunDataArray {
	return runs.map((run) => {
		const teams: RunDataTeam[] = [];

		run.runners.forEach((runner, i) => {
			const teamId = uuid();

			const player: RunDataPlayer = {
				name: runner.username,
				id: runner.id,
				teamID: teamId,
				pronouns: runner.pronouns,
				customData: {},
				social: {
					twitch: runner.twitch,
				},
			};

			if (run.race) {
				teams[i] = {
					id: teamId,
					players: [player],
				};
			} else {
				if (teams.length == 0) teams[0] = { id: teamId, players: [] };
				teams[0].players.push(player);
			}
		});

		let customData = {};
		customData = {
			techPlatform: run.techPlatform,
			specialRequirements: run.specialRequirements,
			gameDisplay: run.game,
		};

		return {
			id: run.id,
			game: run.game,
			category: run.category,
			estimate: run.estimate,
			estimateS: moment(run.estimate, "hh:mm:ss").diff(moment().startOf("day"), "seconds"),
			scheduled: run.scheduledTime.toISOString(),
			scheduledS: run.scheduledTime.getTime() / 1000,
			system: run.platform,
			customData: customData,
			teams: teams,
		};
	});
}

nodecg.listenFor("scheduleImport:import", () => {
	getSchedule().then((runs) => {
		if (runs === undefined) return;
		// console.log(convertScheduleToSpeedcontrol(runs));
		SPEEDCONTROL_runDataArray.value = convertScheduleToSpeedcontrol(runs);
	});
});
