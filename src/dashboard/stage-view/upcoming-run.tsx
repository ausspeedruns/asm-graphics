import useNextRun from "@asm-graphics/shared/hooks/useNextRun";

export function UpcomingRun() {
	const nextRun = useNextRun();
	return (
		<div>
			<span>{nextRun?.game}</span>
			<span>{nextRun?.category}</span>
			<span>{nextRun?.estimate}</span>
			<span>{nextRun?.teams.flatMap((team) => team.players).join(", ")}</span>
		</div>
	);
}
