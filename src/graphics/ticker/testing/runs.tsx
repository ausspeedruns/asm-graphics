import { useState } from "react";
import { Run } from "../runs/run";
import { Button, Stack, TextField } from "@mui/material";
import type { RunData } from "@asm-graphics/types/RunData";
import styles from "./testing.module.css";

interface RunsProps {
	showcaseBackgroundColour: string;
}

export function Runs(props: RunsProps) {
	const [gameName, setGameName] = useState("Super Mario 64");
	const [scheduledTime, setScheduledTime] = useState(Date.now());
	const [playerNames, setPlayerNames] = useState(["Player1", "Player2"]);

	const run: RunData = {
		id: "test-run",
		game: gameName,
		scheduledS: Math.floor(scheduledTime / 1000),
		teams: [
			{
				id: "team-1",
				players: playerNames.map((name, index) => ({
					name: name.trim(),
					id: `player-${index}`,
					teamID: "team-1",
					social: {},
					customData: {},
				})),
			},
		],
		customData: {},
	};

	return (
		<div className={styles.container}>
			<h2>Run</h2>
			<div className={styles.showcaseViewport}>
				<div className={styles.showcase} style={{ backgroundColor: props.showcaseBackgroundColour }}>
					<Run run={run} key={gameName} />
				</div>
			</div>
			<div className={styles.controls}>
				<TextField
					label="Game"
					variant="outlined"
					value={gameName}
					onChange={(e) => setGameName(e.target.value)}
				/>
				<Stack direction="row" spacing={1}>
					<TextField
						label="Scheduled Time"
						variant="outlined"
						value={Math.floor(scheduledTime / 1000)}
						onChange={(e) => setScheduledTime(parseInt(e.target.value) * 1000)}
						type="number"
						helperText="Unix timestamp in seconds"
					/>
					<Button variant="outlined" onClick={() => setScheduledTime(scheduledTime - 60000)}>
						-1 Min
					</Button>
					<Button variant="outlined" onClick={() => setScheduledTime(Date.now())}>
						Now
					</Button>
					<Button variant="outlined" onClick={() => setScheduledTime(scheduledTime + 60000)}>
						+1 Min
					</Button>
					<Button variant="outlined" onClick={() => setScheduledTime(scheduledTime + 300000)}>
						+5 Min
					</Button>
					<Button variant="outlined" onClick={() => setScheduledTime(scheduledTime + 3600000)}>
						+1 Hour
					</Button>
					<Button variant="outlined" onClick={() => setScheduledTime(scheduledTime + 86400000)}>
						+1 Day
					</Button>
				</Stack>
				{playerNames.map((name, index) => (
					<TextField
						key={index}
						label={`Player ${index + 1}`}
						variant="outlined"
						value={name}
						onChange={(e) => {
							const newPlayerNames = [...playerNames];
							newPlayerNames[index] = e.target.value;
							setPlayerNames(newPlayerNames);
						}}
					/>
				))}

				<Stack direction="row" spacing={1}>
					<Button variant="outlined" onClick={() => setPlayerNames([...playerNames, ""])}>
						Add Player
					</Button>
					<Button
						variant="text"
						disabled={playerNames.length === 0}
						onClick={() => {
							if (playerNames.length > 0) {
								setPlayerNames(playerNames.slice(0, -1));
							}
						}}
					>
						Remove Last
					</Button>
				</Stack>
			</div>
		</div>
	);
}
