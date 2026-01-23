import * as nodecgApiContext from "./nodecg-api-context.js";
import { z } from "zod";
import { parse, differenceInSeconds, startOfDay, getUnixTime } from "date-fns";

import { queryGraphQL } from "./util/graphql.js";
import { getReplicant } from "./replicants.js";

import type { RunDataArray, RunDataPlayer, RunDataTeam } from "@asm-graphics/types/RunData.js";

const nodecg = nodecgApiContext.get();

const ausspeedrunsWebsiteSettingsRep = getReplicant("ausspeedruns-website:settings");

const SPEEDCONTROL_runDataArray = nodecg.Replicant<RunDataArray>("runDataArray", "nodecg-speedcontrol");

const SCHEDULE_QUERY = `
	query ($eventSlug: String!) {
		event(where: { shortname: $eventSlug }) {
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
	if (!ausspeedrunsWebsiteSettingsRep.value.url) return;

	try {
		const results = await queryGraphQL(ausspeedrunsWebsiteSettingsRep.value.url, SCHEDULE_QUERY, {
			eventSlug: ausspeedrunsWebsiteSettingsRep.value.eventSlug,
		});

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
			const teamId = crypto.randomUUID();

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
				teams[0]?.players.push(player);
			}
		});

		let customData = {};
		customData = {
			techPlatform: run.techPlatform,
			specialRequirements: run.specialRequirements,
			gameDisplay: run.game,
		};

		const estimateDate = parse(run.estimate, "HH:mm:ss", new Date());
		return {
			id: run.id,
			game: run.game,
			category: run.category,
			estimate: run.estimate,
			estimateS: differenceInSeconds(estimateDate, startOfDay(estimateDate)),
			scheduled: run.scheduledTime.toISOString(),
			scheduledS: getUnixTime(run.scheduledTime),
			system: run.platform,
			customData: customData,
			teams: teams,
		};
	});
}

nodecg.listenFor("scheduleImport:import", async () => {
	const runs = await getSchedule();
	if (runs === undefined) return;
	console.log(JSON.stringify(runs));
	// console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAA=====================================");
	// console.log(JSON.stringify(convertScheduleToSpeedcontrol(runs)));
	SPEEDCONTROL_runDataArray.value = convertScheduleToSpeedcontrol(runs);

	// TODO: Just bring this function in here lol
	nodecg.sendMessage("scheduleImport:getGameYears");
});
