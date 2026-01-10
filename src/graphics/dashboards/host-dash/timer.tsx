import styled from "@emotion/styled";
import { useReplicant } from "@nodecg/react-hooks";

import type { Timer as ITimer } from "@asm-graphics/types/Timer";

import { Button, Box, Tooltip } from "@mui/material";
import { Check, Close, FastRewind, Pause, PlayArrow, Undo } from "@mui/icons-material";
import type { RunDataActiveRun, RunDataTeam } from "@asm-graphics/types/RunData";

const TimerContainer = styled.div`
	padding: 8px;
	font-family:
		Noto Sans,
		sans-serif;
`;

const CurrentTime = styled(Box)`
	width: 100%;
	background: #eee;
	padding: 8px 0;
	font-size: 25px;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const MainButtons = styled.div`
	margin: 8px 0;
	width: 100%;
	display: flex;
	gap: 4px;
`;

const TeamBlock = styled.div``;

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
		<TimerContainer>
			<CurrentTime
				style={{
					background: timerRep?.state === "finished" ? "#388E3C" : "",
					color: fontColor,
				}}
				boxShadow={1}
			>
				<div>{timerRep?.time}</div>
			</CurrentTime>
			<MainButtons>
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
				<Tooltip title="Reset">
					<div style={{ width: "100%" }}>
						<Button
							fullWidth
							variant="contained"
							disabled={timerRep?.state === "stopped"}
							onClick={resetPress}
						>
							<FastRewind /> Reset
						</Button>
					</div>
				</Tooltip>
				{runDataActiveRep?.teams.length === 1 && timerRep && (
					<>
						<StopForfeitButton fullWidth team={runDataActiveRep?.teams[0]!} timerRep={timerRep} />
						<StopForfeitButton fullWidth forfeit team={runDataActiveRep?.teams[0]!} timerRep={timerRep} />
						<UndoButton fullWidth team={runDataActiveRep?.teams[0]!} timerRep={timerRep} />
					</>
				)}
			</MainButtons>
			{runDataActiveRep && runDataActiveRep.teams.length > 1 && timerRep && (
				<TeamBlock>
					{runDataActiveRep &&
						timerRep &&
						runDataActiveRep.teams.map((team) => (
							<TeamTimer team={team} timerRep={timerRep} key={team.id} />
						))}
				</TeamBlock>
			)}
		</TimerContainer>
	);
};

const TeamTimerContainer = styled.div`
	display: flex;
	gap: 4px;
	align-items: center;
	font-size: 1.2rem;
`;

const Names = styled.div`
	margin-left: 8px;
`;

const EndTime = styled.div`
	font-weight: bold;
	font-size: 1.5rem;
	margin-left: 16px;
`;

interface TeamTimerProps {
	team: RunDataTeam;
	timerRep: ITimer;
}

const TeamTimer: React.FC<TeamTimerProps> = (props: TeamTimerProps) => {
	const finishTime = props.timerRep.teamFinishTimes[props.team.id]?.time || undefined;
	const state = props.timerRep.teamFinishTimes[props.team.id]?.state || undefined;

	return (
		<TeamTimerContainer style={{ margin: "4px 0" }}>
			<StopForfeitButton team={props.team} timerRep={props.timerRep} />
			<StopForfeitButton forfeit team={props.team} timerRep={props.timerRep} />
			<UndoButton team={props.team} timerRep={props.timerRep} />
			<Names>
				{props.team.name && <span style={{ fontWeight: "bold" }}>{props.team.name}: </span>}
				{props.team.players.map((player) => player.name).join(", ")}
			</Names>
			<EndTime>
				{finishTime && state === "completed"
					? finishTime
					: finishTime && state === "forfeit"
						? `Forfeit ${finishTime}`
						: ""}
			</EndTime>
		</TeamTimerContainer>
	);
};

interface StopButtonProps {
	team: RunDataTeam;
	timerRep: ITimer;
	forfeit?: boolean;
	fullWidth?: boolean;
}

const StopForfeitButton: React.FC<StopButtonProps> = (props: StopButtonProps) => {
	// STOP
	const stopPress = () => {
		void nodecg.sendMessageToBundle("timerStop", "nodecg-speedcontrol", {
			id: props.team.id,
			forfeit: props.forfeit,
		});
	};

	return (
		<Tooltip title={props.forfeit ? "Forfeit" : "DONE"}>
			<span>
				<Button
					fullWidth={props.fullWidth}
					variant="contained"
					disabled={
						(props.team.id && !!props.timerRep?.teamFinishTimes[props.team.id]) ||
						props.timerRep?.state === "stopped"
					}
					onClick={stopPress}
					color={props.forfeit ? "error" : "success"}
				>
					{props.forfeit ? (
						<>
							<Close /> Forfeit
						</>
					) : (
						<>
							<Check /> Done
						</>
					)}
				</Button>
			</span>
		</Tooltip>
	);
};

interface UndoButtonProps {
	team: RunDataTeam;
	timerRep: ITimer;
	fullWidth?: boolean;
}

const UndoButton: React.FC<UndoButtonProps> = (props: UndoButtonProps) => {
	// UNDO
	const undoPress = () => {
		void nodecg.sendMessageToBundle("timerUndo", "nodecg-speedcontrol", props.team.id);
	};

	return (
		<Tooltip title="Undo">
			<Button
				fullWidth={props.fullWidth}
				variant="contained"
				disabled={
					props.timerRep.state !== "finished" ||
					!props.timerRep.teamFinishTimes[props.team.id] ||
					!["running", "finished"].includes(props.timerRep?.state ?? "")
				}
				onClick={undoPress}
			>
				<Undo /> Undo
			</Button>
		</Tooltip>
	);
};
