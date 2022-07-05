import React from 'react';
import styled from 'styled-components';

import { OverlayProps } from '../../types/OverlayProps';

import { SmallInfo, ISmallStyling } from '../elements/info-box/small';
import { SponsorsBox } from '../elements/sponsors';
import { AudioIndicator } from '../elements/audio-indicator';
import { Facecam } from '../elements/facecam';
import { RaceFinish } from '../elements/race-finish';
import { Couch } from '../elements/couch';

import BGLeft from '../media/pixel/Standard 2p Left.png';
import BGRight from '../media/pixel/Standard 2p Right.png';

const Standard2Container = styled.div`
	height: 1016px;
	width: 1920px;
`;

const Topbar = styled.div`
	display: flex;
	position: absolute;
	height: 296px;
	width: 1920px;
	border-bottom: 1px solid var(--sec);
	overflow: hidden;
`;

const RightBox = styled.div`
	width: 666px;
	height: 100%;
	background: var(--main);
	background-image: url('${BGRight}');
	background-repeat: no-repeat;
	background-position: bottom;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

const SponsorSize = {
	height: 195,
	width: 340,
};

const TwitterSize = {
	height: 200,
	width: 400,
	marginTop: -40,
};

const CentralDivider = styled.div`
	height: 719px;
	width: 2px;
	position: absolute;
	top: 297px;
	left: 959px;
	background: var(--sec);
`;

const customSmallStyling: ISmallStyling = {
	categoryWidth: 320,
	mainStyle: {
		height: '100%',
		width: 666,
		backgroundColor: 'var(--main)',
		backgroundImage: `url('${BGLeft}')`,
		backgroundPosition: 'bottom',
		backgroundRepeat: 'no-repeat',
	},
};

export const Standard2: React.FC<OverlayProps> = (props) => {
	const leftTeamID = props.runData?.teams[0]?.id || '';
	const rightTeamID = props.runData?.teams[1]?.id || '';
	const leftTeamTime = props.timer?.teamFinishTimes.hasOwnProperty(leftTeamID)
		? props.timer.teamFinishTimes[leftTeamID].time
		: '';
	const rightTeamTime = props.timer?.teamFinishTimes.hasOwnProperty(rightTeamID)
		? props.timer.teamFinishTimes[rightTeamID].time
		: '';
	const leftTeamPlace = findPlace(leftTeamID);
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
			props.runData.teams.forEach(team => {
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
			currentAudio = props.runData.teams[0].players.findIndex(player => props.audioIndicator === player.id);
		}
	}

	return (
		<Standard2Container>
			<Topbar>
				<SmallInfo timer={props.timer} runData={props.runData} style={customSmallStyling} />

				<AudioIndicator
					active={currentAudio === 0}
					side="left"
					style={{ position: 'absolute', top: 255, left: 625 }}
				/>
				<AudioIndicator
					active={currentAudio === 1}
					side="right"
					style={{
						position: 'absolute',
						top: 255,
						right: 625,
						zIndex: 2,
					}}
				/>

				<Facecam
					width={586}
					maxNameWidth={190}
					style={{
						borderRight: '1px solid var(--sec)',
						borderLeft: '1px solid var(--sec)',
					}}
					teams={props.runData?.teams}
					noCam={props.preview ? props.noCam.preview : props.noCam.current}
				/>

				<RaceFinish style={{ top: 220, left: 830 }} time={leftTeamTime} place={leftTeamPlace} />
				<RaceFinish style={{ top: 220, left: 960 }} time={rightTeamTime} place={rightTeamPlace} />

				<RightBox>
					<div style={{ display: 'flex', width: '100%', flexGrow: 1, alignItems: 'center' }}>
						<Couch
							couch={props.preview ? props.couchInformation.preview : props.couchInformation.current}
							style={{ width: '30%' }}
						/>
						<SponsorsBox sponsors={props.sponsors} style={{ flexGrow: 1 }} sponsorStyle={SponsorSize} tweetStyle={TwitterSize} />
					</div>
				</RightBox>
			</Topbar>
			<CentralDivider />
		</Standard2Container>
	);
};
