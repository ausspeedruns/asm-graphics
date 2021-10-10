import React from 'react';
import styled from 'styled-components';

import { FitText } from '../fit-text';

import { RunData } from '../../../types/RunData';

const InterNextRunItemContainer = styled.div`
	height: 80px;
	width: 100%;
	font-family: National Park;
	background: #302414;
	display: flex;
`;

const Time = styled.div`
	width: 100px;
	font-size: 28px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #251803;
	background: #F2DAB2;
`;

const InfoBlock = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	//align-items: center;
	//justify-content: center;
	color: #F2DAB2;
	padding: 5px 10px 5px 5px;
`;

const GameTitle = styled(FitText)`
	font-size: 33px;
	max-width: 330px !important;
`;

const TopText = styled.div`
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	width: 100%;
	margin-top: -4px;
`;

const Category = styled(FitText)`
	max-width: 280px;
`;

const Runners = styled(FitText)`
	max-width: 182px;
`;

interface Props {
	run: RunData;
}

export const InterNextRunItem: React.FC<Props> = (props: Props) => {
	const scheduleTime = new Date(props.run.scheduled || '');

	// Thanks setup block
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

	// If one team then combine
	// If more then combine team names and add vs

	const time = scheduleTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

	let correctedEstimate = props.run.estimate || '';
	if (correctedEstimate[0] === "0") {
		correctedEstimate = correctedEstimate.substring(1);
	}

	return (
		<InterNextRunItemContainer>
			<Time>{time === 'Invalid Date' ? '--:--' : time}</Time>
			<InfoBlock>
				<TopText>
					<GameTitle text={props.run.game || ''} />
					{/* <System>{props.run.system}</System> */}
					<span style={{ fontSize: 25 }}>
						<span style={{ fontSize: 14 }}>EST </span>
						{correctedEstimate}
					</span>
				</TopText>
				<TopText style={{ fontSize: 18, marginTop: 5 }}>
					<Category text={props.run.category?.toUpperCase() || ''} />
					<Runners text={playerNames || ''} />
				</TopText>
			</InfoBlock>
		</InterNextRunItemContainer>
	);
};

const EndRunCont = styled.div`
	color: #F2DAB2;
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
				<b>Thank you for watching<br />PAX x AusSpeedruns 2021!</b>
			</span>
		</EndRunCont>
	);
};
