import * as nodecgApiContext from "./nodecg-api-context";
import { RunData, RunDataActiveRun, RunDataTeam } from "@asm-graphics/types/RunData";
import { v4 as uuid } from "uuid";

import games from './5-min-runs.json';

const nodecg = nodecgApiContext.get();

function generateAllRunsData(): RunData[] {
	return games.map((game) => {
		const teams: RunDataTeam[] = game.Runners.split(", ").map(runner => {
			const teamID = uuid();

			return {
				id: teamID,
				players: [
					{
						id: uuid(),
						name: runner,
						customData: {},
						teamID,
						social: {

						}
					}
				]
			}
		})

		return { 
			id: uuid(),
			customData: {},
			game: game.Game,
			system: game.Platform,
			category: game.Category,
			teams: teams
		}
	});
}

nodecg.listenFor("scheduleImport:inject-5-min-runs", () => {
	const currentRun = nodecg.readReplicant<RunDataActiveRun>("runDataActiveRun", "nodecg-speedcontrol");
	console.log(currentRun?.id)

	if (!currentRun) return;

	const generatedGames = generateAllRunsData();
	console.log(generatedGames)

	for (let i = 0; i < generatedGames.length; i++) {
		const run = generatedGames[i];

		console.log(run.game)
		let previousId: string;
		if (i == 0) {
			previousId = currentRun.id;
		} else {
			previousId = generatedGames[i - 1].id;
		}

		console.log("modifyRun", run.id, previousId)
		nodecg.sendMessageToBundle("modifyRun", "nodecg-speedcontrol", { runData: run, prevID: previousId })
	}
});
