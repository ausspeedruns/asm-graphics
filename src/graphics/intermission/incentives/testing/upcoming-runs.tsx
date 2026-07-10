import { useRef, useState } from "react";
import { UpcomingRuns } from "../incent-upcoming-runs";
import { Button, Stack, TextField } from "@mui/material";
import type { RunData } from "@asm-graphics/types/RunData";
import styles from "./testing.module.css";
import type { TickerItemHandles } from "../../incentives";
import gsap from "gsap";

const DEFAULT_RUN: RunData = {
	id: "test-run",
	game: "Super Mario 64",
	category: "Any%",
	scheduledS: Math.floor(Date.now() / 1000),
	scheduled: new Date(Date.now()).toISOString(),
	estimate: "1:00:00",
	system: "Nintendo 64",
	release: "1996-09-29",
	teams: [
		{
			id: "team-1",
			players: [
				{
					name: "Player 1",
					id: "player-1",
					teamID: "team-1",
					social: {},
					customData: {},
				},
			],
		},
	],
	customData: {},
};

interface RunsProps {
	showcaseBackgroundColour: string;
	showcaseHeight?: number;
	showcaseWidth?: number;
}

export function Runs(props: RunsProps) {
	const ref = useRef<TickerItemHandles>(null);
	const [runs, setRuns] = useState<RunData[]>([DEFAULT_RUN]);

	function handleRunAnimation() {
		if (!ref.current) return;

		const tl = gsap.timeline();
		ref.current.animation(tl);
		tl.play();
	}

	function updateRun(index: number, field: keyof RunData, value: any) {
		const newRuns = [...runs];

		const originalRun = newRuns[index];
		if (!originalRun) return;

		newRuns[index] = { ...originalRun, [field]: value };
		setRuns(newRuns);
	}

	return (
		<div className={styles.container}>
			<h2>Run</h2>
			<div className={styles.showcaseViewport}>
				<div
					className={styles.showcase}
					style={{
						backgroundColor: props.showcaseBackgroundColour,
						height: props.showcaseHeight,
						width: props.showcaseWidth,
					}}
				>
					<UpcomingRuns upcomingRuns={runs} ref={ref} />
				</div>
			</div>
			<div className={styles.controls}>
				<Button onClick={handleRunAnimation}>Run Animation</Button>
				{runs.map((run, index) => (
					<div key={index}>
						<TextField
							label="Game"
							variant="outlined"
							value={run.game}
							onChange={(e) => updateRun(index, "game", e.target.value)}
						/>
						<TextField
							label="Category"
							variant="outlined"
							value={run.category}
							onChange={(e) => updateRun(index, "category", e.target.value)}
						/>
						<TextField
							label="Platform"
							variant="outlined"
							value={run.system}
							onChange={(e) => updateRun(index, "system", e.target.value)}
						/>
						<Stack direction="row" spacing={1}>
							<TextField
								label="Scheduled Time"
								variant="outlined"
								value={Math.floor(run.scheduledS! / 1000)}
								onChange={(e) => updateRun(index, "scheduledS", parseInt(e.target.value))}
								type="number"
								helperText="Unix timestamp in seconds"
							/>
							<Button
								variant="outlined"
								onClick={() => updateRun(index, "scheduledS", run.scheduledS! - 60000)}
							>
								-1 Min
							</Button>
							<Button variant="outlined" onClick={() => updateRun(index, "scheduledS", Date.now())}>
								Now
							</Button>
							<Button
								variant="outlined"
								onClick={() => updateRun(index, "scheduledS", run.scheduledS! + 60000)}
							>
								+1 Min
							</Button>
							<Button
								variant="outlined"
								onClick={() => updateRun(index, "scheduledS", run.scheduledS! + 300000)}
							>
								+5 Min
							</Button>
							<Button
								variant="outlined"
								onClick={() => updateRun(index, "scheduledS", run.scheduledS! + 3600000)}
							>
								+1 Hour
							</Button>
							<Button
								variant="outlined"
								onClick={() => updateRun(index, "scheduledS", run.scheduledS! + 86400000)}
							>
								+1 Day
							</Button>
						</Stack>
						{run.teams[0]!.players.map((player, index) => (
							<TextField
								key={index}
								label={`Player ${index + 1}`}
								variant="outlined"
								value={player.name}
								onChange={(e) => {
									const newPlayers = [...run.teams[0]!.players];
									newPlayers[index] = { ...newPlayers[index]!, name: e.target.value };
									updateRun(index, "teams", [{ ...run.teams[0]!, players: newPlayers }]);
								}}
							/>
						))}

						<Stack direction="row" spacing={1}>
							<Button
								variant="outlined"
								onClick={() =>
									updateRun(index, "teams", [
										{
											...run.teams[0]!,
											players: [
												...run.teams[0]!.players,
												{
													name: "",
													id: `player-${run.teams[0]!.players.length + 1}`,
													teamID: run.teams[0]!.id,
													social: {},
													customData: {},
												},
											],
										},
									])
								}
							>
								Add Player
							</Button>
							<Button
								variant="text"
								disabled={run.teams[0]!.players.length === 0}
								onClick={() => {
									if (run.teams[0]!.players.length > 0) {
										updateRun(index, "teams", [
											{ ...run.teams[0]!, players: run.teams[0]!.players.slice(0, -1) },
										]);
									}
								}}
							>
								Remove Last
							</Button>
						</Stack>
					</div>
				))}
				<Button
					variant="outlined"
					onClick={() => {
						setRuns([...runs, { ...DEFAULT_RUN }]);
					}}
				>
					Add Run
				</Button>
				<Button
					variant="outlined"
					onClick={() => {
						setRuns(runs.slice(0, -1));
					}}
				>
					Remove Last Run
				</Button>
			</div>
		</div>
	);
}
