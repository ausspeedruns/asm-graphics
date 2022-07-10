import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';

import { FitText } from '../fit-text';

import { RunData } from '../../../types/RunData';

const InterNextRunItemContainer = styled.div`
	height: 193px;
	width: 286px;
	font-family: Noto Sans;
	background: var(--main-dark);
	display: flex;
	flex-direction: column;
`;

const Time = styled.div`
	width: 100%;
	font-size: 28px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--text-dark);
	background: #ffffff;
`;

const InfoBlock = styled.div`
	width: 100%;
	height: fit-content;
	display: flex;
	flex-direction: column;
	align-items: center;
	//justify-content: center;
	color: var(--text-light);
	padding: 5px;
	box-sizing: border-box;
`;

const GameTitle = styled(FitText)`
	font-size: 33px;
	font-weight: bold;
	max-width: 95%;
`;

const TopText = styled.div`
	display: flex;
	align-items: baseline;
	justify-content: center;
	gap: 20px;
	width: 100%;
`;

const Category = styled(FitText)`
	max-width: 95%;
	font-size: 27px;
`;

const System = styled.span`
	max-width: 50%;
	flex-grow: 1;
	font-size: 20px;
`;

const Runners = styled(FitText)`
	max-width: 95%;
	font-size: 23px;
`;

interface Props {
	run: RunData;
	nextRun?: boolean;
}

export const InterNextRunItem: React.FC<Props> = (props: Props) => {
	// If one team then combine
	// If more then combine team names and add vs
	let playerNames;
	if (props.run.teams.length === 0) {
		playerNames = '';
	} else {
		playerNames = props.run?.teams
			.map((team) => {
				return team.players.map((player) => player.name).join(', ');
			})
			.join(' vs ');
	}

	// Thanks setup block
	let time = props.run.scheduled ? format(new Date(props.run.scheduled), 'h:mm a') : '--:--';
	if (props.nextRun) time = 'Up Next';

	let correctedEstimate = props.run.estimate || '';
	if (correctedEstimate[0] === '0') {
		correctedEstimate = correctedEstimate.substring(1);
	}

	return (
		<InterNextRunItemContainer style={{ background: props.nextRun ? 'var(--sec)' : undefined }}>
			<Time style={{ fontWeight: props.nextRun ? 'bold' : undefined }}>{time}</Time>
			<InfoBlock>
				<GameTitle text={props.run.game || ''} />
				<Category text={props.run.category?.toUpperCase() || ''} />
				<TopText>
					<span style={{ fontSize: 20, minWidth: 143, textAlign: 'right', maxWidth: '50%' }}>
						<span style={{ fontSize: 14 }}>EST </span>
						{correctedEstimate}
					</span>
					<System>{props.run.system}</System>
				</TopText>
				<Runners text={playerNames || ''} />
			</InfoBlock>
		</InterNextRunItemContainer>
	);
};

const EndRunCont = styled.div`
	color: var(--text-light);
	display: flex;
	flex-direction: column;
	align-items: center;
	font-size: 30px;
	margin-top: -15px;
	text-align: center;
`;

export const EndRunItem: React.FC = () => {
	return (
		<EndRunCont>
			<span>The End</span>
			<span>
				<b>
					Thank you for watching
					<br />
					ASM2022!
				</b>
			</span>
		</EndRunCont>
	);
};
