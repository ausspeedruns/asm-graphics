import React from 'react';
import styled from 'styled-components';

import { OverlayProps } from '@asm-graphics/types/OverlayProps';

import { AudioIndicator } from '../elements/audio-indicator';
import { Facecam } from '../elements/facecam';
// import { RaceFinish } from '../elements/race-finish';

import { Timer } from '../elements/timer';
import * as RunInfo from '../elements/run-info';

import GameplayBL from '../media/Widescreen-3-BL.svg';
import GameplayTL from '../media/Widescreen-3-TL.svg';
import GameplayTR from '../media/Widescreen-3-TR.svg';
import { RaceFinish } from '../elements/race-finish';

const Widescreen3Container = styled.div`
	height: 1016px;
	width: 1920px;
	position: relative;
	display: flex;
	flex-direction: column;
`;

const Screen = styled.div`
	width: 903px;
	height: 507px;
	border: 1px solid var(--sec);
	box-sizing: border-box;
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
		border-right: 0px;
	}
`;

const CentralDivider = styled.div`
	height: 719px;
	width: 2px;
	position: absolute;
	top: 297px;
	left: 959px;
	background: var(--sec);
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
	background: var(--main);
	/* background-image: url('../shared/design/contour-maps/widescreen-3-bottom.svg'); */
	width: 901px;
	height: 182px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	border-right: 1px solid var(--main);
`;

const InfoBoxRow = styled.div`
	display: flex;
	width: 100%;
	justify-content: center;
	align-items: center;
`;
const InfoBoxCell = styled.div`
	display: flex;
	/* flex-grow: 1; */
	width: 45%;
	justify-content: center;
	align-items: center;
	z-index: 2;
`;

const WideAudioIndicator = styled(AudioIndicator)`
	position: absolute;
	top: 753px;

	& > div {
		width: 50px;
	}
`;

const RightBG = styled.div`
	position: absolute;
	right: 0;
	height: 1016px;
	width: 57px;
	background: var(--main);
`;

export const Widescreen3: React.FC<OverlayProps> = (props) => {
	const leftTeamID = props.runData?.teams[0]?.id || '';
	const middleTeamID = props.runData?.teams[1]?.id || '';
	const rightTeamID = props.runData?.teams[2]?.id || '';
	const leftTeamTime = props.timer?.teamFinishTimes.hasOwnProperty(leftTeamID)
		? props.timer.teamFinishTimes[leftTeamID].time
		: '';
	const middleTeamTime = props.timer?.teamFinishTimes.hasOwnProperty(middleTeamID)
		? props.timer.teamFinishTimes[middleTeamID].time
		: '';
	const rightTeamTime = props.timer?.teamFinishTimes.hasOwnProperty(rightTeamID)
		? props.timer.teamFinishTimes[middleTeamID].time
		: '';
	const leftTeamPlace = findPlace(leftTeamID);
	const middleTeamPlace = findPlace(middleTeamID);
	const rightTeamPlace = findPlace(rightTeamID);

	function findPlace(teamID: string) {
		if (props.timer?.teamFinishTimes.hasOwnProperty(teamID)) {
			// Forfeit dont get a place (sorry runner)
			if (props.timer.teamFinishTimes[teamID].state === 'forfeit') {
				return -1;
			} else {
				// On a scale of 1 to fucked this is probably just a weird look
				// Get place
				const allFinishTimes: [string, number][] = [];
				for (const loopTeamID in props.timer.teamFinishTimes) {
					allFinishTimes.push([loopTeamID, props.timer.teamFinishTimes[loopTeamID].milliseconds]);
				}

				allFinishTimes.sort((a, b) => {
					return a[1] - b[1];
				});

				return allFinishTimes.findIndex((element) => element[0] === teamID) + 1;
			}
		}
		return 4;
	}

	let currentAudio = -1;

	if (props.runData?.teams) {
		if (props.runData.teams.length > 1) {
			let totalIndex = -1;
			props.runData.teams.forEach((team) => {
				team.players.forEach((player) => {
					totalIndex++;
					if (player.id === props.audioIndicator) {
						currentAudio = totalIndex;
						return;
					}

					if (currentAudio !== -1) {
						return;
					}
				});
			});
		} else {
			currentAudio = props.runData.teams[0].players.findIndex((player) => props.audioIndicator === player.id);
		}
	}

	return (
		<Widescreen3Container>
			<WideAudioIndicator active={currentAudio === 0} side="top" style={{ left: 961 }} />
			<WideAudioIndicator active={currentAudio === 1} side="top" style={{ left: 1262 }} />
			<WideAudioIndicator active={currentAudio === 2} side="top" style={{ left: 1563 }} />
			<RightBG />
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
						icons={[<NPIcon src={GameplayBL} />, <NPIcon src={GameplayTL} />, <NPIcon src={GameplayTR} />]}
						style={{ borderRight: '1px solid var(--sec)' }}
						audioIndicator={props.obsAudioIndicator}
					/>

					<RaceFinish style={{ top: 758, left: 1046, zIndex: 3 }} time={leftTeamTime} place={leftTeamPlace} />
					<RaceFinish
						style={{ top: 758, left: 1346, zIndex: 3 }}
						time={middleTeamTime}
						place={middleTeamPlace}
					/>
					<RaceFinish
						style={{ top: 758, left: 1647, zIndex: 3 }}
						time={rightTeamTime}
						place={rightTeamPlace}
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
								<Timer fontSize={60} timer={props.timer} />
							</InfoBoxCell>
						</InfoBoxRow>
					</InfoBox>
				</Screen>
			</BottomBar>
			<CentralDivider />
		</Widescreen3Container>
	);
};
