import { RunDataActiveRun } from "@asm-graphics/types/RunData";
import { Fragment } from "react/jsx-runtime";
import { FitText } from "../fit-text";

interface Props {
	run: RunDataActiveRun;
	alignment?: "centre" | "left" | "right";
}

export function RunnerNames(props: Props) {
	if (!props.run) return null;

	let playerNames: React.ReactNode[] = [];
		if (props.run.teams.length > 0) {
			playerNames = props.run.teams.map((team, index) => {
				const players = team.players.map((player) => player.name).join(", ");

				if (!props.run) return null;

				return (
					<Fragment key={index}>
						<FitText alignment={props.alignment} text={players} />
						{index !== props.run.teams.length - 1 && <span style={{ fontSize: "60%" }}> vs </span>}
					</Fragment>
				);
			});
		}

	return playerNames;
}