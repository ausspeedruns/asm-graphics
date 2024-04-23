import React from "react";
import styled from "styled-components";
import { useReplicant } from "@nodecg/react-hooks";

import { Timer as TimerI } from "@asm-graphics/types/Timer";

import { Button, Box, Tooltip } from "@mui/material";
import { Check, Close, FastRewind, Pause, PlayArrow, Undo } from "@mui/icons-material";
import { RunDataActiveRun, RunDataTeam } from "@asm-graphics/types/RunData";

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
`;

const TeamBlock = styled.div``;

const RunnerReadyText = styled.div`
	text-align: center;
	font-weight: bold;
	font-size: 1.5rem;
	margin-bottom: 8px;
`;

export const Timer: React.FC = () => {
	const [timerRep] = useReplicant<TimerI | undefined>("timer", undefined, {
		namespace: "nodecg-speedcontrol",
	});
	const [runDataActiveRep] = useReplicant<RunDataActiveRun | undefined>("runDataActiveRun", undefined, {
		namespace: "nodecg-speedcontrol",
	});
	// const [runnerReadyRep] = useReplicant<boolean>("runner:ready", false);
	const [techReadyRep] = useReplicant<boolean>("tech:ready", false);
	// const [disableTime, setDisableTime] = useState(false);
	// const [currentTime, setCurrentTime] = useState('00:00:00');
	// const timerRef = useRef<HTMLDivElement>(null);

	// TIMER
	// useEffect(() => {
	// 	setDisableTime(['running', 'finished'].includes(timerRep?.state || ''));
	// }, []);

	// useEffect(() => {
	// 	setCurrentTime(timerRep?.time || '00:00:00');
	// }, [timerRep]);

	// const timerBlur = () => {
	// 	setCurrentTime(timerRep?.time || '00:00:00');
	// };

	// const timerEdit = () => {
	// 	if (currentTime.match(/^(\d+:)?(?:\d{1}|\d{2}):\d{2}$/)) {
	// 		nodecg.sendMessageToBundle('timerEdit', 'nodecg-speedcontrol', currentTime);
	// 		if (timerRef.current) {
	// 			timerRef.current.blur();
	// 		}
	// 	}
	// };

	// PLAY/PAUSE
	const playPress = () => {
		if (timerRep?.state === "stopped" || timerRep?.state === "paused") {
			nodecg.sendMessageToBundle("timerStart", "nodecg-speedcontrol");
		} else if (timerRep?.state === "running") {
			nodecg.sendMessageToBundle("timerPause", "nodecg-speedcontrol");
		}
	};

	// RESET
	const resetPress = () => {
		nodecg.sendMessageToBundle("timerReset", "nodecg-speedcontrol");
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
			{/* <TextField
				variant="filled"
				InputProps={{ readOnly: true }}
				value={timerRep?.time}
				fullWidth
				// onBlur={timerBlur}
				// ref={timerRef}
				// onKeyUp={timerEdit}
			/> */}
			<RunnerReadyText>
				{/* {runnerReadyRep ? "RUNNER IS READY!" : "Runner not ready"} */}
				{techReadyRep ? "TECH IS READY!" : "Tech not ready"}
			</RunnerReadyText>
			<CurrentTime
				style={{
					background: timerRep?.state === "finished" ? "#388E3C" : "",
					color: fontColor,
				}}
				boxShadow={1}>
				<div>{timerRep?.time}</div>
			</CurrentTime>
			<MainButtons>
				<Tooltip title={timerRep?.state === "running" ? "Pause" : "Play"}>
					<div style={{ width: "100%", marginRight: 4 }}>
						<Button
							fullWidth
							variant="contained"
							disabled={timerRep?.state === "finished"}
							onClick={playPress}>
							{timerRep?.state === "running" ? <Pause /> : <PlayArrow />}
						</Button>
					</div>
				</Tooltip>
				<Tooltip title="Reset">
					<div style={{ width: "100%", marginRight: 4 }}>
						<Button
							fullWidth
							variant="contained"
							disabled={timerRep?.state === "stopped"}
							onClick={resetPress}>
							<FastRewind />
						</Button>
					</div>
				</Tooltip>
				{runDataActiveRep?.teams.length === 1 && timerRep && (
					<>
						<StopForfeitButton fullWidth team={runDataActiveRep?.teams[0]} timerRep={timerRep} />
						<StopForfeitButton fullWidth forfeit team={runDataActiveRep?.teams[0]} timerRep={timerRep} />
						<UndoButton fullWidth team={runDataActiveRep?.teams[0]} timerRep={timerRep} />
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
`;

interface TeamTimerProps {
	team: RunDataTeam;
	timerRep: TimerI;
}

const TeamTimer: React.FC<TeamTimerProps> = (props: TeamTimerProps) => {
	const finishTime = props.timerRep.teamFinishTimes[props.team.id]?.time || undefined;
	const state = props.timerRep.teamFinishTimes[props.team.id]?.state || undefined;

	return (
		<TeamTimerContainer style={{ margin: "4px 0" }}>
			<StopForfeitButton team={props.team} timerRep={props.timerRep} />
			<StopForfeitButton forfeit team={props.team} timerRep={props.timerRep} />
			<UndoButton team={props.team} timerRep={props.timerRep} />
			<div>{props.team.name || props.team.players.map((player) => player.name).join(", ")}</div>
			<div>
				{finishTime && state === "completed" ? finishTime : finishTime && state === "forfeit" ? `Forfeit ${finishTime}` : ""}
			</div>
		</TeamTimerContainer>
	);
};

interface StopButtonProps {
	team: RunDataTeam;
	timerRep: TimerI;
	forfeit?: boolean;
	fullWidth?: boolean;
}

const StopForfeitButton: React.FC<StopButtonProps> = (props: StopButtonProps) => {
	// STOP
	const stopPress = () => {
		nodecg.sendMessageToBundle("timerStop", "nodecg-speedcontrol", {
			id: props.team.id,
			forfeit: props.forfeit,
		});
	};

	return (
		<Tooltip title={props.forfeit ? "Forfeit" : "Stop"}>
			<Button
				fullWidth={props.fullWidth}
				variant="contained"
				disabled={
					(props.team.id && !!props.timerRep?.teamFinishTimes[props.team.id]) ||
					props.timerRep?.state === "stopped"
				}
				onClick={stopPress}>
				{props.forfeit ? <Close /> : <Check />}
			</Button>
		</Tooltip>
	);
};

interface UndoButtonProps {
	team: RunDataTeam;
	timerRep: TimerI;
	fullWidth?: boolean;
}

const UndoButton: React.FC<UndoButtonProps> = (props: UndoButtonProps) => {
	// UNDO
	const undoPress = () => {
		nodecg.sendMessageToBundle("timerUndo", "nodecg-speedcontrol", props.team.id);
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
				onClick={undoPress}>
				<Undo />
			</Button>
		</Tooltip>
	);
};
