import React from 'react';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';
// @ts-ignore
// import Twemoji from 'react-twemoji';

import { OverlayProps } from '../../types/OverlayProps';

import { Timer } from '../elements/timer';
import * as RunInfo from '../elements/run-info';
import { SponsorsBox } from '../elements/sponsors';
import { AudioIndicator } from '../elements/audio-indicator';
import { Facecam } from '../elements/facecam';
import { RaceFinish } from '../elements/race-finish';
import { OrangeStripe } from '../elements/orange-stripe';
import { PersonCompressed } from '../elements/couch';

const Widescreen2Container = styled.div`
	height: 1016px;
	width: 1920px;
`;

const Topbar = styled.div`
	display: flex;
	position: absolute;
	height: 341px;
	width: 1920px;
	overflow: hidden;
	border-bottom: 1px solid var(--asm-orange);
`;

const InfoTopDivider = styled.div`
	height: 1px;
	width: 652px;
	background: var(--asm-orange);
`;

const InfoSideDivider = styled.div`
	height: 160px;
	width: 1px;
	background: var(--asm-orange);
`;

const VerticalStack = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
`;

const InfoBox = styled.div`
	height: 100%;
	width: 666px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	padding-top: 10px;
	box-sizing: border-box;
	background: var(--main-col);
`;

const InfoSubBox = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	width: 100%;
`;

const RightBox = styled.div`
	width: 666px;
	height: 100%;
	background: var(--main-col);
	display: flex;
	flex-direction: column;
`;

const SponsorSize = {
	height: 195,
	width: 340,
};

const TwitterSize = {
	height: 200,
	width: 540,
	marginTop: -40,
};

const CentralDivider = styled.div`
	height: 540px;
	width: 2px;
	position: absolute;
	top: 341px;
	left: 959px;
	background: var(--asm-orange);
`;

const BottomBlock = styled.div`
	position: absolute;
	top: 881px;
	height: 134px;
	width: 1920px;
	background: var(--main-col);
	background-size: 37px;
	background-blend-mode: hard-light;
	border-bottom: 1px solid var(--asm-orange);
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
`;

const BespokeCouch = styled.div`
	font-family: Noto Sans;
	display: flex;
	align-items: center;
`;

const CouchLabel = styled.span`
	color: #ffffff;
	font-style: italic;
	font-size: 20px;
	margin-right: 4px;
`;

export const Widescreen2: React.FC<OverlayProps> = (props) => {
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
		<Widescreen2Container>
			<Topbar>
				<InfoBox>
					<VerticalStack style={{ height: 100, width: '100%' }}>
						<RunInfo.GameTitle
							maxWidth={620}
							game={props.runData?.game || ''}
							style={{ fontSize: 50 }}
						/>
					
						<div style={{width: '100%', display: 'flex', justifyContent: 'space-evenly'}}>
							<RunInfo.System system={props.runData?.system || ''} style={{ fontSize: 25, zIndex: 2 }} />
							<RunInfo.Year year={props.runData?.release || ''} style={{ fontSize: 25, zIndex: 2 }} />
						</div>
					</VerticalStack>
					<InfoTopDivider />
					<InfoSubBox>
						<VerticalStack style={{ height: 120 }}>
							<RunInfo.Category
								maxWidth={290}
								category={props.runData?.category || ''}
							/>
							<RunInfo.Estimate
								fontSize={30}
								estimate={props.runData?.estimate || ''}
							/>
						</VerticalStack>
						<InfoSideDivider />
						<Timer fontSize={75} timer={props.timer} />
					</InfoSubBox>
					<OrangeStripe
						side="bottom"
						style={{
							transform: 'scaleY(1.28125)',
							transformOrigin: 'bottom',
						}}
					/>
				</InfoBox>

				<AudioIndicator
					active={
						audioIndicatorRep ===
						(props.runData?.teams[0]?.id || '')
					}
					side="left"
					style={{ position: 'absolute', top: 300, left: 624 }}
				/>
				<AudioIndicator
					active={
						audioIndicatorRep ===
						(props.runData?.teams[1]?.id || '')
					}
					side="right"
					style={{
						position: 'absolute',
						top: 300,
						right: 624,
						zIndex: 2,
					}}
				/>

				<Facecam
					width={588}
					style={{
						borderRight: '1px solid var(--asm-orange)',
						borderLeft: '1px solid var(--asm-orange)',
						zIndex: 2,
					}}
					teams={props.runData?.teams}
					maxNameWidth={190}
					noCam={props.preview ? props.noCam.preview : props.noCam.current}
				/>

				<RaceFinish
					style={{ top: 265, left: 830, zIndex: 3 }}
					time={leftTeamTime}
					place={leftTeamPlace}
				/>
				<RaceFinish
					style={{ top: 265, left: 960, zIndex: 3 }}
					time={rightTeamTime}
					place={rightTeamPlace}
				/>

				<RightBox>
					<SponsorsBox
						style={{ flexGrow: 1 }}
						sponsorStyle={SponsorSize}
						tweetStyle={TwitterSize}
					/>
					<OrangeStripe
						side="bottom"
						style={{
							transform: 'scaleY(1.28125)',
							transformOrigin: 'bottom',
						}}
					/>
				</RightBox>
			</Topbar>
			<CentralDivider />
			<BottomBlock>
				<OrangeStripe
					side="top"
					style={{ width: '100%' }}
				/>
				<BespokeCouch>
					<CouchLabel>{props.couchInformation.current.length > 1 ? 'Commentators' : 'Commentator'}</CouchLabel>
					{/* Since this is a special placement it has to be made custom here */}
					{props.preview
						? props.couchInformation.preview.map((person) => {
								return <PersonCompressed person={person} />;
						  })
						: props.couchInformation.current.map((person) => {
								return <PersonCompressed person={person} />;
						  })}
				</BespokeCouch>
				<div />
			</BottomBlock>
		</Widescreen2Container>
	);
};
