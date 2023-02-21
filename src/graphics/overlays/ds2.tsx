import React from 'react';
import styled from 'styled-components';

import { OverlayProps } from '@asm-graphics/types/OverlayProps';

import { VerticalInfo } from '../elements/info-box/vertical';
import { SponsorsBox } from '../elements/sponsors';
import { Facecam } from '../elements/facecam';
import { Couch } from '../elements/couch';
import { useReplicant } from 'use-nodecg';
import { AudioIndicator } from '../elements/audio-indicator';
import { RaceFinish } from '../elements/race-finish';

const DS2Container = styled.div`
	height: 1016px;
	width: 1920px;
	display: flex;
	justify-content: center;
	position: relative;
`;

const Sidebar = styled.div`
	height: 1016px;
	width: 564px;
	border-right: 1px solid var(--pax-gold);
	border-left: 1px solid var(--pax-gold);
	overflow: hidden;
`;

const InfoBoxBG = styled.div`
	background-image: url('../shared/design/contour-maps/standard.svg');
	background-size: cover;
	background-position: center;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 664px;
`;

const SponsorBoxS = styled(SponsorsBox)`
	width: 100%;
	/* height: 264px; */
	flex-grow: 1;
`;

const SponsorsSize = {
	height: 130,
	width: 430,
};

const TwitterSize = {
	height: 163,
	width: 480,
	marginTop: -44,
};

export const DS2: React.FC<OverlayProps> = (props) => {
	const [audioIndicatorRep] = useReplicant<string, string>('audio-indicator', '');

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
		<DS2Container>
			<Sidebar>
				<Facecam
					height={352}
					teams={props.runData?.teams}
					audioIndicator={props.obsAudioIndicator}
				/>

				<RaceFinish style={{ top: 276, left: 830 }} time={leftTeamTime} place={leftTeamPlace} />
				<RaceFinish style={{ top: 276, left: 960 }} time={rightTeamTime} place={rightTeamPlace} />

				<AudioIndicator
					active={currentAudio === 0}
					side="top"
					style={{ position: 'absolute', top: 270, left: 678 }}
				/>
				<AudioIndicator
					active={currentAudio === 1}
					side="top"
					style={{
						position: 'absolute',
						top: 270,
						right: 678,
						zIndex: 2,
					}}
				/>
				<InfoBoxBG>
					<VerticalInfo timer={props.timer} runData={props.runData} />
					<Couch couch={props.couchInformation} />
					<SponsorBoxS sponsorStyle={SponsorsSize} tweetStyle={TwitterSize} sponsors={props.sponsors} />
				</InfoBoxBG>
			</Sidebar>
		</DS2Container>
	);
};
