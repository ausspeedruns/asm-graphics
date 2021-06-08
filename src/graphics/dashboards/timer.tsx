import React from 'react';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';

import { Timer as TimerI } from '../../types/Timer';

import { Button, Box } from '@material-ui/core';
import { Check, Close, FastRewind, Pause, PlayArrow, Undo } from '@material-ui/icons';
import { RunDataActiveRun, RunDataTeam } from '../../types/RunData';

const TimerContainer = styled.div`
	padding: 8px;
	font-family: Noto Sans, sans-serif;
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

export const Timer: React.FC = () => {
	const [timerRep] = useReplicant<TimerI, undefined>('timer', undefined, {
		namespace: 'nodecg-speedcontrol',
	});
	const [runDataActiveRep] = useReplicant<RunDataActiveRun, undefined>('runDataActiveRun', undefined, {
		namespace: 'nodecg-speedcontrol',
	});
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
		if (timerRep?.state === 'stopped' || timerRep?.state === 'paused') {
			nodecg.sendMessageToBundle('timerStart', 'nodecg-speedcontrol');
		} else if (timerRep?.state === 'running') {
			nodecg.sendMessageToBundle('timerPause', 'nodecg-speedcontrol');
		}
	};

	// RESET
	const resetPress = () => {
		nodecg.sendMessageToBundle('timerReset', 'nodecg-speedcontrol');
	};

	let fontColor = '#000';
	switch (timerRep?.state) {
		case 'finished':
			fontColor = '#fff';
			break;

		case 'paused':
			fontColor = '#949494';
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
			<CurrentTime
				style={{
					background: timerRep?.state === 'finished' ? '#388E3C' : '',
					color: fontColor,
				}}
				boxShadow={1}>
				<span>{timerRep?.time}</span>
			</CurrentTime>
			<MainButtons>
				<Button
					fullWidth
					variant="contained"
					disabled={timerRep?.state === 'finished'}
					onClick={playPress}
					style={{ marginRight: 4 }}>
					{timerRep?.state === 'running' ? <Pause /> : <PlayArrow />}
				</Button>
				<Button
					fullWidth
					variant="contained"
					disabled={timerRep?.state === 'stopped'}
					onClick={resetPress}
					style={{ marginRight: 4 }}>
					<FastRewind />
				</Button>
				{(runDataActiveRep?.teams.length || []) === 1 && timerRep ? (
					<>
						<StopForfeitButton fullWidth team={runDataActiveRep?.teams[0]!} timerRep={timerRep} />
						<StopForfeitButton fullWidth forfeit team={runDataActiveRep?.teams[0]!} timerRep={timerRep} />
						<UndoButton fullWidth team={runDataActiveRep?.teams[0]!} timerRep={timerRep} />
					</>
				) : (
					<></>
				)}
			</MainButtons>
			{(runDataActiveRep?.teams.length || []) === 1 && timerRep ? (
				<></>
			) : (
				<TeamBlock>
					{runDataActiveRep && timerRep ? (
						runDataActiveRep.teams.map((team) => (
							<TeamTimer team={team} timerRep={timerRep} key={team.id} />
						))
					) : (
						<></>
					)}
				</TeamBlock>
			)}
		</TimerContainer>
	);
};

const TeamTimerContainer = styled.div``;

interface TeamTimerProps {
	team: RunDataTeam;
	timerRep: TimerI;
}

const TeamTimer: React.FC<TeamTimerProps> = (props: TeamTimerProps) => {
	const finishTime = props.timerRep.teamFinishTimes[props.team.id]?.time || undefined;
	const state = props.timerRep.teamFinishTimes[props.team.id]?.state || undefined;

	return (
		<TeamTimerContainer style={{ margin: '4px 0' }}>
			<StopForfeitButton team={props.team} timerRep={props.timerRep} />
			<StopForfeitButton forfeit team={props.team} timerRep={props.timerRep} />
			<UndoButton team={props.team} timerRep={props.timerRep} />
			<span>{props.team.name || props.team.players.map((player) => `${player.name}, `)}</span>
			<span>
				{finishTime && state === 'completed' ? finishTime : finishTime && state === 'forfeit' ? 'Forfeit' : ''}
			</span>
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
		nodecg.sendMessageToBundle('timerStop', 'nodecg-speedcontrol', {
			id: props.team.id,
			forfeit: props.forfeit,
		});
	};

	return (
		<Button
			fullWidth={props.fullWidth}
			variant="contained"
			style={{ marginRight: 4 }}
			disabled={
				(props.team.id && !!props.timerRep?.teamFinishTimes[props.team.id]) ||
				props.timerRep?.state === 'stopped'
			}
			onClick={stopPress}>
			{props.forfeit ? <Close /> : <Check />}
		</Button>
	);
};

interface UndoButtonProps {
	team: RunDataTeam;
	timerRep: TimerI;
	fullWidth?: boolean;
}

const UndoButton: React.FC<UndoButtonProps> = (props: UndoButtonProps) => {
	// STOP
	const undoPress = () => {
		nodecg.sendMessageToBundle('timerUndo', 'nodecg-speedcontrol', props.team.id);
	};

	return (
		<Button
			fullWidth={props.fullWidth}
			variant="contained"
			style={{ marginRight: 4 }}
			disabled={
				(!props.team.id && props.timerRep?.state !== 'finished') ||
				(!!props.team.id &&
					(!props.timerRep?.teamFinishTimes[props.team.id] ||
						!['running', 'finished'].includes(props.timerRep?.state || '')))
			}
			onClick={undoPress}>
			<Undo />
		</Button>
	);
};
