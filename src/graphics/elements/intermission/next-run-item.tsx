import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';

import { FitText } from '../fit-text';

import { RunData } from '@asm-graphics/types/RunData';
import { NodeCGAPIClient } from '@alvancamp/test-nodecg-types/client/api/api.client';
import { ConfigSchema } from '@asm-graphics/types/ConfigSchema';

const nodecgConfig = (nodecg as NodeCGAPIClient<ConfigSchema>).bundleConfig;

const InterNextRunItemContainer = styled.div`
	height: 100%;
	width: 100%;
	font-family: Nasalization;
	background: var(--main);
	display: flex;
	flex-direction: column;
	border: 1px solid var(--sec);
`;

const InterFutureRunItemContainer = styled.div`
	height: 100%;
	width: 100%;
	font-family: Nasalization;
	background: var(--main);
	display: flex;
	border: 1px solid var(--sec);
`;

const Time = styled.div`
	width: 20%;
	font-size: 28px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--text-dark);
	background: #ffffff;
	text-align: center;
`;

const InfoBlock = styled.div`
	width: 100%;
	height: fit-content;
	display: flex;
	flex-direction: column;
	align-items: center;
	//justify-content: center;
	color: var(--text-light);
	padding: 6px;
	box-sizing: border-box;
	height: 100%;
	justify-content: space-evenly;
`;

const GameTitle = styled(FitText)`
	font-size: 33px;
	/* font-weight: bold; */
	max-width: 330px;
`;

const TopText = styled.div`
	display: flex;
	align-items: baseline;
	justify-content: space-around;
	gap: 20px;
	width: 100%;
`;

const Category = styled(FitText)`
	max-width: 200px;
	font-size: 27px;
	font-family: Orbitron;
`;

const System = styled.span`
	/* max-width: 50%; */
	/* flex-grow: 1; */
	font-size: 20px;
`;

const Runners = styled(FitText)`
	max-width: 95%;
	font-size: 23px;
`;

const FutureRunsEstRow = styled.div`
	display: flex;
	justify-content: space-around;
	align-items: center;
	width: 100%;
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
	// if (props.nextRun) time = 'Up Next';

	let correctedEstimate = props.run.estimate || '';
	if (correctedEstimate[0] === '0') {
		correctedEstimate = correctedEstimate.substring(1);
	}

	if (props.nextRun) {
		return (
			<InterNextRunItemContainer>
				<Time style={{ width: '100%', fontSize: 38, padding: 5, boxSizing: 'border-box' }}>
					Up Next - {time}
				</Time>
				<InfoBlock>
					<GameTitle style={{ fontSize: 40, maxWidth: 430 }} text={props.run.game || ''} />
					<Category style={{ fontSize: 32, maxWidth: 430 }} text={props.run.category?.toUpperCase() || ''} />
					<TopText>
						<span style={{ fontSize: 32, minWidth: 143, textAlign: 'right', maxWidth: '50%' }}>
							<span style={{ fontSize: 20 }}>EST </span>
							{correctedEstimate}
						</span>
						<System style={{ fontSize: 32 }}>{props.run.system}</System>
					</TopText>
					<Runners style={{ fontSize: 36 }} text={playerNames || ''} />
				</InfoBlock>
			</InterNextRunItemContainer>
		);
	} else {
		return (
			<InterFutureRunItemContainer>
				<Time>{time}</Time>
				<InfoBlock>
					<GameTitle text={props.run.game || ''} />
					<FutureRunsEstRow>
						<Category text={props.run.category?.toUpperCase() || ''} />
						<span style={{ fontSize: 27, minWidth: 143, textAlign: 'right', maxWidth: '50%' }}>
							<span style={{ fontSize: 14 }}>EST </span>
							{correctedEstimate}
						</span>
					</FutureRunsEstRow>

					<TopText>
						<System>{props.run.system}</System>
						<Runners text={playerNames || ''} />
					</TopText>
				</InfoBlock>
			</InterFutureRunItemContainer>
		);
	}
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
					{nodecgConfig.graphql?.event ?? ''}!
				</b>
			</span>
		</EndRunCont>
	);
};
