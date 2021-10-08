import React from 'react';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';

import { OverlayProps } from '../../types/OverlayProps';

import { AudioIndicator } from '../elements/audio-indicator';
import { Facecam } from '../elements/facecam';
// import { RaceFinish } from '../elements/race-finish';

import { Timer } from '../elements/timer';
import * as RunInfo from '../elements/run-info';

const Widescreen3Container = styled.div`
	height: 1016px;
	width: 1920px;
	position: relative;
	display: flex;
	flex-direction: column;
`;

const Screen = styled.div`
	width: 901px;
	height: 507px;
	border: 1px solid var(--pax-gold);
`;

const TopBar = styled.div`
	display: flex;
	justify-content: center;
	width: 1920px;
	/* border-bottom: 1px solid var(--pax-gold); */

	& > div {
		border-top: 0px;
	}
`;

const BottomBar = styled.div`
	display: flex;
	width: 1920px;
	justify-content: center;

	& > div {
		border-bottom: 0px;
	}
`;

const CentralDivider = styled.div`
	height: 719px;
	width: 2px;
	position: absolute;
	top: 297px;
	left: 959px;
	background: var(--pax-gold);
`;

const LeftBorderImage = styled.img`
	position: absolute;
	top: 0;
	left: 0;
	border-right: 1px solid var(--pax-gold);
`;

const RightBorderImage = styled.img`
	position: absolute;
	top: 0;
	right: 0;
	border-left: 1px solid var(--pax-gold);
`;

// const Facecam = styled.div`
// 	width: 901px;
// 	height: 289px;
// `;

const NPIcon = styled.img`
	width: 40px;
	height: auto;
	margin: 0 5px;
`;

const InfoBox = styled.div`
	background-image: url('../shared/design/contour-maps/widescreen-3-bottom.svg');
	width: 901px;
	height: 181px;
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

const InfoBoxRow = styled.div`
	display: flex;
	width: 100%;
	justify-content: center;
	align-items: center;
`;
const InfoBoxCell = styled.div`
	flex-grow: 1;
	width: 50%;
	justify-content: center;
	align-items: center;
`;

const WideAudioIndicator = styled(AudioIndicator)`
	position: absolute;
	top: 753px;

	& > div {
		width: 50px;
	}
`;

export const Widescreen3: React.FC<OverlayProps> = (props) => {
	const [audioIndicatorRep] = useReplicant<string, string>('audio-indicator', '');

	// const leftTeamID = props.runData?.teams[0]?.id || '';
	// const rightTeamID = props.runData?.teams[1]?.id || '';
	// const leftTeamTime = props.timer?.teamFinishTimes.hasOwnProperty(leftTeamID)
	// 	? props.timer.teamFinishTimes[leftTeamID].time
	// 	: '';
	// const rightTeamTime = props.timer?.teamFinishTimes.hasOwnProperty(rightTeamID)
	// 	? props.timer.teamFinishTimes[rightTeamID].time
	// 	: '';
	// const leftTeamPlace = findPlace(leftTeamID);
	// const rightTeamPlace = findPlace(rightTeamID);

	// function findPlace(teamID: string) {
	// 	if (props.timer?.teamFinishTimes.hasOwnProperty(teamID)) {
	// 		// Forfeit dont get a place (sorry runner)
	// 		if (props.timer.teamFinishTimes[teamID].state === 'forfeit') {
	// 			return -1;
	// 		} else {
	// 			// On a scale of 1 to fucked this is probably just a weird look
	// 			// Get place
	// 			const allFinishTimes: [string, number][] = [];
	// 			for (const loopTeamID in props.timer.teamFinishTimes) {
	// 				allFinishTimes.push([loopTeamID, props.timer.teamFinishTimes[loopTeamID].milliseconds]);
	// 			}

	// 			allFinishTimes.sort((a, b) => {
	// 				return a[1] - b[1];
	// 			});

	// 			return allFinishTimes.findIndex((element) => element[0] === teamID) + 1;
	// 		}
	// 	}
	// 	return 4;
	// }

	let currentAudio = -1;

	if (props.runData?.teams) {
		if (props.runData.teams.length > 1) {
			let totalIndex = -1;
			props.runData.teams.forEach(team => {
				team.players.forEach((player) => {
					totalIndex++;
					if (player.id === audioIndicatorRep) {
						currentAudio = totalIndex;
						return;
					}
					
					if (currentAudio !== -1) {
						return;
					}
				});
			});
		} else {
			currentAudio = props.runData.teams[0].players.findIndex(player => audioIndicatorRep === player.id);
		}
	}

	return (
		<Widescreen3Container>
			<WideAudioIndicator
				active={currentAudio === 0}
				side="top"
				style={{ left: 961 }}
			/>
			<WideAudioIndicator
				active={currentAudio === 1}
				side="top"
				style={{ left: 1262 }}
			/>
			<WideAudioIndicator
				active={currentAudio === 2}
				side="top"
				style={{ left: 1563 }}
			/>
			<LeftBorderImage src="../shared/design/contour-maps/widescreen-3-left.svg" />
			<RightBorderImage src="../shared/design/contour-maps/widescreen-3-right.svg" />
			<TopBar>
				<Screen />
				<Screen />
			</TopBar>
			<BottomBar>
				<Screen />
				<Screen>
					<Facecam
						width={901}
						height={326}
						dontAlternatePronouns
						pronounStartSide="right"
						teams={props.runData?.teams}
						icons={[
							<NPIcon src={require('../media/Widescreen-3-BL.svg')} />,
							<NPIcon src={require('../media/Widescreen-3-TL.svg')} />,
							<NPIcon src={require('../media/Widescreen-3-TR.svg')} />,
						]}
					/>
					<InfoBox>
						<InfoBoxRow style={{ height: '23%' }}>
							<InfoBoxCell>
								<RunInfo.GameTitle
									style={{ fontSize: 30 }}
									maxWidth={440}
									game={props.runData?.game || ''}
								/>
							</InfoBoxCell>
							<InfoBoxCell>
								<RunInfo.Category
									style={{ fontSize: 30 }}
									maxWidth={440}
									category={props.runData?.category || ''}
								/>
							</InfoBoxCell>
						</InfoBoxRow>
						<InfoBoxRow style={{ height: '43%' }}>
							<InfoBoxCell>
								<div style={{ width: '100%', display: 'flex', justifyContent: 'space-evenly' }}>
									<RunInfo.System style={{ fontSize: 34 }} system={props.runData?.system || ''} />
									<RunInfo.Year style={{ fontSize: 34 }} year={props.runData?.release || ''} />
									<RunInfo.Estimate fontSize={34} estimate={props.runData?.estimate || ''} />
								</div>
							</InfoBoxCell>
							<InfoBoxCell>
								<Timer style={{ marginLeft: -39 }} fontSize={90} timer={props.timer} />
							</InfoBoxCell>
						</InfoBoxRow>
					</InfoBox>
				</Screen>
			</BottomBar>
			<CentralDivider />
		</Widescreen3Container>
	);
};
