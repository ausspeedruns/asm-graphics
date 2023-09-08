import { RunDataActiveRun } from "@asm-graphics/types/RunData";
import { Timer } from "@asm-graphics/types/Timer";

type TeamData = {
	id: string;
	time?: string;
	place: number;
}

export const getTeams = (
	runData: RunDataActiveRun | undefined,
	timer: Timer | undefined,
	audioIndicator: string | undefined,
	defaultTeamsCount: number = 4,
) => {
	const teamData: TeamData[] = [];

	let gameAudioActive = -1;
	let totalIndex = 0;

	const finishTimes = timer?.teamFinishTimes ?? {};

	const sortedFinishTimes = Object.entries(finishTimes)
		.map(([id, { milliseconds }]) => [id, milliseconds] as [string, number])
		.sort((a, b) => a[1] - b[1]);

	if (runData?.teams) {
		for (const [_teamIndex, team] of runData.teams.entries()) {
			const id = team?.id ?? "";
			const time = Object.hasOwn(finishTimes, id) ? finishTimes[id].time : "";
			const place = Object.hasOwn(finishTimes, id)
				? finishTimes[id].state === "forfeit"
					? -1
					: sortedFinishTimes.findIndex(([tid]) => tid === id) + 1
				: 4;

			teamData.push({ id, time, place });

			for (const player of team.players) {
				if (player.id === audioIndicator) {
					gameAudioActive = totalIndex;
				}
				totalIndex++;
			}

			if (gameAudioActive !== -1) {
				break;
			}
		}
	}

	while (teamData.length < defaultTeamsCount) {
		teamData.push({ id: "", time: undefined, place: 4 });
	}

	return { teamData, gameAudioActive };
};
