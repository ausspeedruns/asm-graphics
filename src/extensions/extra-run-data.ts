import * as nodecgApiContext from './nodecg-api-context';

import { RunDataActiveRun } from '../types/RunData';
import { RunnerNames } from '../types/ExtraRunData';

const nodecg = nodecgApiContext.get();

const runnerNamesRep = nodecg.Replicant<RunnerNames[]>('runner-names', { defaultValue: [] });
const runDataActiveRep = nodecg.Replicant<RunDataActiveRun>('runDataActiveRun', 'nodecg-speedcontrol');

runDataActiveRep.on('change', newVal => {
	const runnerNames: RunnerNames[] | undefined = newVal?.teams.map(team => {
		let teamName = '';
		let teamID = team.id;
		let twitch;

		if (team.players.length > 1) {
			// Use team name
			teamName = team.name || team.players.join(', ');
			teamID = team.id;
		} else {
			// Use player name
			teamName = team.players[0].name;
			twitch = team.players[0].social.twitch;
		}
		
		return {name: teamName, id: teamID, twitch: twitch};
	});

	runnerNamesRep.value = runnerNames || [];
});
