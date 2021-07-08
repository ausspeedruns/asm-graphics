import React from 'react';
import styled from 'styled-components';

import { OverlayProps } from '../../types/OverlayProps';

import { Timer } from '../elements/timer';
import * as RunInfo from '../elements/run-info';
import { SponsorsBox } from '../elements/sponsors';
import { Facecam } from '../elements/facecam';
import { OrangeStripe } from '../elements/orange-stripe';
import { Couch } from '../elements/couch';
import { ASMBanner } from '../elements/asm-banner';
import { useReplicant } from 'use-nodecg';
import { AudioIndicator } from '../elements/audio-indicator';
import { RaceFinish } from '../elements/race-finish';

const DS2Container = styled.div`
	height: 1016px;
	width: 1920px;
	display: flex;
	justify-content: center;
`;

const Sidebar = styled.div`
	/* position: absolute; */
	height: 1016px;
	width: 564px;
	border-right: 1px solid var(--asm-orange);
	border-left: 1px solid var(--asm-orange);
	overflow: hidden;
`;

const InfoDivider = styled.div`
	height: 1px;
	width: 430px;
	background: var(--asm-orange);
`;

const VerticalStack = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	height: 100%;
`;

const InfoBoxBG = styled.div`
	background: var(--main-col);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 664px;
`;

const InfoBox = styled.div`
	height: 340px;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
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
    marginTop: -44
};

export const DS2: React.FC<OverlayProps> = (props) => {
	const [audioIndicatorRep] = useReplicant<string, string>(
		'audio-indicator',
		'',
	);

	const leftTeamID = props.runData?.teams[0]?.id || '';
	const rightTeamID = props.runData?.teams[1]?.id || '';
	const leftTeamTime = props.timer?.teamFinishTimes.hasOwnProperty(leftTeamID) ? props.timer.teamFinishTimes[leftTeamID].time : ''
	const rightTeamTime = props.timer?.teamFinishTimes.hasOwnProperty(rightTeamID) ? props.timer.teamFinishTimes[rightTeamID].time : ''
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


	return (
		<DS2Container>
			<Sidebar>
				<Facecam height={352} teams={props.runData?.teams} noCam={props.preview ? props.noCam.preview : props.noCam.current} />
			
				<RaceFinish
					style={{ top: 276, left: 830 }}
					time={leftTeamTime}
					place={leftTeamPlace}
				/>
				<RaceFinish
					style={{ top: 276, left: 960 }}
					time={rightTeamTime}
					place={rightTeamPlace}
				/>

				<AudioIndicator
					active={
						audioIndicatorRep ===
						(props.runData?.teams[0]?.id || '')
					}
					side="top"
					style={{ position: 'absolute', top: 270, left: 678 }}
				/>
				<AudioIndicator
					active={
						audioIndicatorRep ===
						(props.runData?.teams[1]?.id || '')
					}
					side="top"
					style={{
						position: 'absolute',
						top: 270,
						right: 661,
						zIndex: 2,
					}}
				/>
				<InfoBoxBG>
					<InfoBox>
						<VerticalStack style={{ height: 180 }}>
							<Timer
								fontSize={110}
								timer={props.timer}
								style={{ marginBottom: -15 }}
							/>
							<RunInfo.Estimate
								fontSize={30}
								estimate={props.runData?.estimate || ''}
							/>
						</VerticalStack>
						<InfoDivider />
						<RunInfo.Category
							maxWidth={450}
							category={props.runData?.category || ''}
						/>
						<InfoDivider />
						<VerticalStack style={{ height: 100 }}>
							<RunInfo.GameTitle
								maxWidth={540}
								game={props.runData?.game || ''}
								style={{ fontSize: 37 }}
							/>
							<div style={{width: '100%', display: 'flex', justifyContent: 'space-evenly'}}>
								<RunInfo.System
									system={props.runData?.system || ''}
									style={{ fontSize: 25, zIndex: 2 }}
								/>
								<RunInfo.Year
									year={props.runData?.release || ''}
									style={{ fontSize: 25, zIndex: 2 }}
								/>
							</div>
						</VerticalStack>
					</InfoBox>
					<Couch
						couch={
							props.preview
								? props.couchInformation.preview
								: props.couchInformation.current
						}
					/>
					<ASMBanner />
					<SponsorBoxS
						sponsorStyle={SponsorsSize}
						tweetStyle={TwitterSize}
					/>
					<OrangeStripe side="bottom" style={{ width: '100%' }} />
				</InfoBoxBG>
			</Sidebar>
		</DS2Container>
	);
};
