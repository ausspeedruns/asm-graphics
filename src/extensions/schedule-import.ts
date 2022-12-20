import * as nodecgApiContext from './nodecg-api-context';
import { request, gql } from 'graphql-request';
import { z } from 'zod';
import { RunDataArray, RunDataPlayer, RunDataTeam } from '@asm-graphics/types/RunData';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { Config } from '@asm-graphics/types/ConfigSchema';

const nodecg = nodecgApiContext.get();

const SPEEDCONTROL_runDataArray = nodecg.Replicant<RunDataArray>('runDataArray', 'nodecg-speedcontrol');

// const scheduleEventsListRep = nodecg.Replicant<string[]>('schedule-import:events');

// const scheduleEventsListSchema = z.object({
// 	events: z.array(z.object({
// 		shortname: z.string()
// 	})),
// });

// async function getEventsList() {
// 	try {
// 		console.log("Getting events list")
// 		const results = await request(
// 			nodecg.bundleConfig?.graphql.url,
// 			gql`
// 				query {
// 					events {
// 						shortname
// 					}
// 				}
// 		`);
// 		console.log(results)

// 		scheduleEventsListRep.value = scheduleEventsListSchema.parse(results).events.map(event => event.shortname);
// 	} catch (error) {
// 		nodecg.log.error('[GraphQL Schedule Import]: ' + error);
// 	}
// }

// getEventsList();

const SCHEDULE_QUERY = gql`
	query {
		event(where: { shortname: "${(nodecg.bundleConfig as Config).graphql?.event}" }) {
			runs(orderBy: {scheduledTime: asc}) {
				id
				game
				category
				platform
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
		runs: z.array(z.object({
			id: z.string(),
			game: z.string(),
			category: z.string(),
			platform: z.string(),
			race: z.boolean(),
			coop: z.boolean(),
			estimate: z.string(),
			scheduledTime: z.preprocess((a) => new Date(z.string().parse(a)), z.date()).transform(a => new Date(a)),
			runners: z.array(z.object({
				id: z.string(),
				username: z.string(),
				pronouns: z.string(),
				twitch: z.string(),
			})),
		}))
	}),
});

async function getSchedule() {
	if ((nodecg.bundleConfig as Config).graphql === undefined) return;

	try {
		const results = await request((nodecg.bundleConfig as Config).graphql!.url, SCHEDULE_QUERY);

		return scheduleSchema.parse(results).event.runs;
	} catch (error) {
		nodecg.log.error('[GraphQL Schedule Import]: ' + error);
		return [];
	}
}

interface AusSpeedrunsScheduleItem {
	id: string;
	game: string;
	category: string;
	platform: string;
	race: boolean;
	coop: boolean;
	estimate: string;
	scheduledTime: Date;
	runners: {
		id: string;
		username: string;
		pronouns: string;
		twitch: string;
	}[];
};

function convertScheduleToSpeedcontrol(runs: AusSpeedrunsScheduleItem[]): RunDataArray {
	return runs.map(run => {
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
				}
			}

			if (run.race) {
				teams[i] = {
					id: teamId,
					players: [player]
				}
			} else {
				if (teams.length == 0) teams[0] = { id: teamId, players: [] };
				teams[0].players.push(player);
			}
		});

		return {
			id: run.id,
			game: run.game,
			category: run.category,
			estimate: run.estimate,
			estimateS: moment(run.estimate, 'hh:mm:ss').toDate().getTime(),
			scheduled: run.scheduledTime.toISOString(),
			scheduledS: run.scheduledTime.getMilliseconds(),
			system: run.platform,
			customData: {},
			teams: teams,
		};
	});
}

nodecg.listenFor('scheduleImport:import', () => {
	getSchedule().then(runs => {
		if (runs === undefined) return;
		// console.log(convertScheduleToSpeedcontrol(runs));
		SPEEDCONTROL_runDataArray.value = convertScheduleToSpeedcontrol(runs);
	})
});
