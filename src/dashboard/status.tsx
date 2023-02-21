import React from 'react';
import { createRoot } from 'react-dom/client';
import styled from 'styled-components';


import useCurrentTime from '../hooks/useCurrentTime';
import useSurroundingRuns from '../hooks/useSurroundingRuns';
import { useReplicant } from 'use-nodecg';
import type { ConnectionStatus } from '@asm-graphics/types/Connections';

const StatusContainer = styled.div``;

const TimeToNextContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 1rem;
`;

const Time = styled.span`
	font-size: 4rem;
`;

const ConnectionStatus = styled.div`
	height: 4rem;
	color: white;
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 2rem;
`;

const Header = styled.h1`
	text-align: center;
	border-top: 1px solid white;
	padding-top: 1rem;
`;

function connectionStatusStyle(status: ConnectionStatus): { text: string; colour: string } {
	switch (status) {
		case 'disconnected':
			return { text: 'Disconnected', colour: '#757575' };
		case 'connected':
			return { text: 'Connected', colour: '#4CAF50' };
		case 'error':
			return { text: 'Error', colour: '#D32F2F' };
		case 'warning':
			return { text: 'Missed Heartbeat', colour: '#FF9800' };
		default:
			return { text: status, colour: '#ff008c' };
	}
}

function durationToTime(duration?: number) {
	if (!duration) return '--:--:--';

	const durationDate = new Date(duration);

	return `${duration < 0 ? '-' : ''}${durationDate.getHours()}:${durationDate.getMinutes()?.toLocaleString('en-AU', {
		minimumIntegerDigits: 2,
	})}:${durationDate.getSeconds()?.toLocaleString('en-AU', { minimumIntegerDigits: 2 })}`;
}

function timeColour(duration?: number) {
	if (!duration) return 'rgba(255, 255, 255, 0.5)';

	if ((duration <= 60 * 1000)) {
		// Below 1 min / late
		return '#FF0000';
	} else if (duration <= 15 * 60 * 1000) {
		// Within 15 mins
		return '#90ff90';
	} else if (duration <= 30 * 60 * 1000) {
		// Within 30 mins
		return '#8a8aff';
	}

	return '#FFFFFF';
}

export const Status: React.FC = () => {
	const currentTime = useCurrentTime();
	// const currentTime = new Date('2024-09-23');
	const [_, currentRun, nextRun] = useSurroundingRuns();
	const [x32StatusRep] = useReplicant<ConnectionStatus, ConnectionStatus>('x32:status', 'disconnected');
	const [obsStatusRep] = useReplicant<ConnectionStatus, ConnectionStatus>('obs:status', 'disconnected');

	const x32StatusInfo = connectionStatusStyle(x32StatusRep);
	const obsStatusInfo = connectionStatusStyle(obsStatusRep);

	const timeToCurrentRunStart = new Date(currentRun?.scheduled ?? 0).getTime() - currentTime.getTime();
	const timeToCurrentRunEnd = new Date(((currentRun?.scheduledS ?? 0) + (currentRun?.estimateS ?? 0)) * 1000 ?? 0).getTime() - currentTime.getTime();
	const timeToNextRunStart = new Date(nextRun?.scheduled ?? 0).getTime() - currentTime.getTime();

	console.log(timeToCurrentRunEnd)

	return (
		<StatusContainer>
			<TimeToNextContainer>
				Time until current run starts{' '}
				<Time style={{ color: timeColour(timeToCurrentRunStart) }}>
					{durationToTime(timeToCurrentRunStart)}
				</Time>
			</TimeToNextContainer>
			<TimeToNextContainer>
				Time until run finish{' '}
				<Time style={{ color: timeColour(timeToCurrentRunEnd) }}>{durationToTime(timeToCurrentRunEnd)}</Time>
			</TimeToNextContainer>
			<TimeToNextContainer>
				Time until next run{' '}
				<Time style={{ color: timeColour(timeToNextRunStart) }}>{durationToTime(timeToNextRunStart)}</Time>
			</TimeToNextContainer>
			<Header>OBS</Header>
			<ConnectionStatus style={{ backgroundColor: obsStatusInfo.colour }}>{obsStatusInfo.text}</ConnectionStatus>
			<Header>X32</Header>
			<ConnectionStatus style={{ backgroundColor: x32StatusInfo.colour }}>{x32StatusInfo.text}</ConnectionStatus>

		</StatusContainer>
	);
};

createRoot(document.getElementById('root')!).render(<Status />);
