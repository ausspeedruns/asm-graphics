import type { RunDataActiveRun } from "@asm-graphics/types/RunData";
import type { Timer } from "@asm-graphics/types/Timer";

type TeamData = {
	id: string;
	time?: string;
	place: number;
};

export const getTeams = (runData?: RunDataActiveRun, timer?: Timer, defaultTeamsCount: number = 4) => {
	const teamData: TeamData[] = [];

	const finishTimes = timer?.teamFinishTimes ?? {};

	const sortedFinishTimes = Object.entries(finishTimes)
		.map(([id, { milliseconds }]) => [id, milliseconds] as [string, number])
		.sort((a, b) => a[1] - b[1]);

	if (runData?.teams) {
		for (const [_teamIndex, team] of runData.teams.entries()) {
			const id = team?.id ?? "";

			// Determine time and place
			const time = Object.hasOwn(finishTimes, id) ? finishTimes[id]?.time : "";
			const place = Object.hasOwn(finishTimes, id)
				? finishTimes[id]?.state === "forfeit"
					? -1
					: sortedFinishTimes.findIndex(([tid]) => tid === id) + 1
				: 4;

			teamData.push({ id, time, place });
		}
	}

	while (teamData.length < defaultTeamsCount) {
		teamData.push({ id: "", time: undefined, place: 4 });
	}

	return teamData;
};
