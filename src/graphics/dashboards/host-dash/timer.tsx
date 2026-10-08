import { useReplicant } from "@nodecg/react-hooks";

import type { Timer as ITimer } from "@asm-graphics/types/Timer.js";

import { Button, Tooltip, Paper } from "@mui/material";
import { Check, Close, FastRewind, Pause, PlayArrow, Undo } from "@mui/icons-material";
import type { RunDataActiveRun, RunDataTeam } from "@asm-graphics/types/RunData.js";
import styles from "./timer.module.css";

export function Timer() {
	const [timerRep] = useReplicant<ITimer>("timer", {
		bundle: "nodecg-speedcontrol",
	});
	const [runDataActiveRep] = useReplicant<RunDataActiveRun>("runDataActiveRun", {
		bundle: "nodecg-speedcontrol",
	});

	// PLAY/PAUSE
	const playPress = () => {
		if (timerRep?.state === "stopped" || timerRep?.state === "paused") {
			void nodecg.sendMessageToBundle("timerStart", "nodecg-speedcontrol");
		} else if (timerRep?.state === "running") {
			void nodecg.sendMessageToBundle("timerPause", "nodecg-speedcontrol");
		}
	};

	// RESET
	const resetPress = () => {
		void nodecg.sendMessageToBundle("timerReset", "nodecg-speedcontrol");
	};

	let fontColor = "#000";
	switch (timerRep?.state) {
		case "finished":
			fontColor = "#fff";
			break;

		case "paused":
			fontColor = "#949494";
			break;

		default:
			break;
	}

	return (
		<div className={styles.timerContainer}>
			<Paper
				className={styles.currentTime}
				style={{
					background: timerRep?.state === "finished" ? "#388E3C" : "",
				}}
				elevation={1}
			>
				<div>{timerRep?.time}</div>
			</Paper>
			<div className={styles.mainButtons}>
				<Tooltip title={timerRep?.state === "running" ? "Pause" : "Start"}>
					<div style={{ width: "100%" }}>
						<Button
							fullWidth
							variant="contained"
							disabled={timerRep?.state === "finished"}
							onClick={playPress}
							color={timerRep?.state === "running" ? "primary" : "success"}
						>
							{timerRep?.state === "running" ? (
								<>
									<Pause /> Pause
								</>
							) : (
								<>
									<PlayArrow /> Start
								</>
							)}
						</Button>
					</div>
				</Tooltip>
				{runDataActiveRep?.teams.length === 1 && timerRep && (
					<>
						<DoneButton team={runDataActiveRep?.teams[0]!} timerRep={timerRep} />
						<ForfeitButton team={runDataActiveRep?.teams[0]!} timerRep={timerRep} />
						<Tooltip title="Reset">
							<Button variant="contained" disabled={timerRep?.state === "stopped"} onClick={resetPress}>
								<FastRewind />
							</Button>
						</Tooltip>
						<UndoButton team={runDataActiveRep?.teams[0]!} timerRep={timerRep} />
					</>
				)}
			</div>
			{runDataActiveRep && runDataActiveRep.teams.length > 1 && timerRep && (
				<div>
					{runDataActiveRep &&
						timerRep &&
						runDataActiveRep.teams.map((team) => (
							<TeamTimer team={team} timerRep={timerRep} key={team.id} />
						))}
				</div>
			)}
		</div>
	);
}

interface TeamTimerProps {
	team: RunDataTeam;
	timerRep: ITimer;
}

function TeamTimer(props: TeamTimerProps) {
	const finishTime = props.timerRep.teamFinishTimes[props.team.id]?.time || undefined;
	const state = props.timerRep.teamFinishTimes[props.team.id]?.state || undefined;

	return (
		<div className={styles.teamTimerContainer} style={{ margin: "4px 0" }}>
			<DoneButton team={props.team} timerRep={props.timerRep} />
			<ForfeitButton team={props.team} timerRep={props.timerRep} />
			<UndoButton team={props.team} timerRep={props.timerRep} />
			<div className={styles.names}>
				{props.team.name && <span style={{ fontWeight: "bold" }}>{props.team.name}: </span>}
				{props.team.players.map((player) => player.name).join(", ")}
			</div>
			<div className={styles.endTime}>
				{finishTime && state === "completed"
					? finishTime
					: finishTime && state === "forfeit"
						? `Forfeit ${finishTime}`
						: ""}
			</div>
		</div>
	);
}

interface DoneButtonProps {
	team: RunDataTeam;
	timerRep: ITimer;
}

function DoneButton(props: DoneButtonProps) {
	// STOP
	const stopPress = () => {
		void nodecg.sendMessageToBundle("timerStop", "nodecg-speedcontrol", {
			id: props.team.id,
		});
	};

	return (
		<Tooltip title={"DONE"}>
			<span style={{ width: "100%" }}>
				<Button
					fullWidth
					variant="contained"
					disabled={
						(props.team.id && !!props.timerRep?.teamFinishTimes[props.team.id]) ||
						props.timerRep?.state === "stopped"
					}
					onClick={stopPress}
					color="success"
				>
					<Check /> Done
				</Button>
			</span>
		</Tooltip>
	);
}

interface StopButtonProps {
	team: RunDataTeam;
	timerRep: ITimer;
	fullWidth?: boolean;
}

function ForfeitButton(props: StopButtonProps) {
	// STOP
	const stopPress = () => {
		void nodecg.sendMessageToBundle("timerStop", "nodecg-speedcontrol", {
			id: props.team.id,
			forfeit: true,
		});
	};

	return (
		<Tooltip title={"Forfeit"}>
			<span>
				<Button
					fullWidth={props.fullWidth}
					variant="contained"
					disabled={
						(props.team.id && !!props.timerRep?.teamFinishTimes[props.team.id]) ||
						props.timerRep?.state === "stopped"
					}
					onClick={stopPress}
					color="error"
				>
					<Close />
				</Button>
			</span>
		</Tooltip>
	);
}

interface UndoButtonProps {
	team: RunDataTeam;
	timerRep: ITimer;
}

function UndoButton(props: UndoButtonProps) {
	// UNDO
	const undoPress = () => {
		void nodecg.sendMessageToBundle("timerUndo", "nodecg-speedcontrol", props.team.id);
	};

	return (
		<Tooltip title="Undo">
			<Button
				variant="contained"
				disabled={
					props.timerRep.state !== "finished" ||
					!props.timerRep.teamFinishTimes[props.team.id] ||
					!["running", "finished"].includes(props.timerRep?.state ?? "")
				}
				onClick={undoPress}
			>
				<Undo />
			</Button>
		</Tooltip>
	);
}
