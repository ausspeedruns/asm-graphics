import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import styled from 'styled-components';

import { OverlayProps, OverlayRef } from '../../types/OverlayProps';

import { SmallInfo, ISmallStyling } from '../elements/info-box/small';

import { SponsorBoxRef, SponsorsBox } from '../elements/sponsors';
import { AudioIndicator } from '../elements/audio-indicator';
import { Facecam } from '../elements/facecam';
import { RaceFinish } from '../elements/race-finish';
import { PersonCompressed } from '../elements/couch';

import BGLeft from '../media/pixel/Wide 2p Left.png';
import BGRight from '../media/pixel/Wide 2p Right.png';
import BGBottom from '../media/pixel/Wide 2p Bottom.png';

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
	border-bottom: 1px solid var(--sec);
`;

const RightBox = styled.div`
	width: 666px;
	height: 100%;
	background: var(--main);
	background-image: url('${BGRight}');
	display: flex;
	flex-direction: column;
`;

const SponsorSize = {
	height: 195,
	width: 340,
};

const TwitterSize = {
	height: 240,
	width: 540,
	marginTop: -40,
};

const CentralDivider = styled.div`
	height: 540px;
	width: 2px;
	position: absolute;
	top: 341px;
	left: 959px;
	background: var(--sec);
`;

const BottomBlock = styled.div`
	position: absolute;
	top: 881px;
	height: 135px;
	width: 1920px;
	background: var(--main);
	background-image: url('${BGBottom}');
	border-bottom: 1px solid var(--sec);
	border-top: 1px solid var(--sec);
	box-sizing: border-box;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const BespokeCouch = styled.div`
	font-family: Noto Sans;
	display: flex;
	align-items: center;
`;

const CouchLabel = styled.span`
	color: var(--text-light);
	font-size: 30px;
	margin-right: 8px;
`;

const customSmallStyling: ISmallStyling = {
	gameTitleSize: 60,
	gameTitleWidth: 640,
	categoryWidth: 320,
	mainStyle: {
		width: 666,
		height: '100%',
		background: 'var(--main)',
		backgroundImage: `url('${BGLeft}')`,
	},
};

export const Widescreen2 = forwardRef<OverlayRef, OverlayProps>((props, ref) => {
	const sponsorRef = useRef<SponsorBoxRef>(null);

	useImperativeHandle(ref, () => ({
		showTweet(newVal) {
			sponsorRef.current?.showTweet?.(newVal);
		},
	}));

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

	// Custom couch so here is couch code
	const host = (props.preview ? props.couchInformation.preview : props.couchInformation.current).find(
		(person) => person.host,
	);

	// Remove host from array now
	const couch = (props.preview ? props.couchInformation.preview : props.couchInformation.current).filter(
		(person) => !person.host,
	);

	return (
		<Widescreen2Container>
			<Topbar>
				<SmallInfo timer={props.timer} runData={props.runData} style={customSmallStyling} />

				<AudioIndicator
					active={currentAudio === 0}
					side="left"
					style={{ position: 'absolute', top: 300, left: 624 }}
				/>
				<AudioIndicator
					active={currentAudio === 1}
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
						borderRight: '1px solid var(--sec)',
						borderLeft: '1px solid var(--sec)',
						zIndex: 2,
					}}
					teams={props.runData?.teams}
					maxNameWidth={190}
					noCam={props.preview ? props.noCam.preview : props.noCam.current}
					audioIndicator={props.obsAudioIndicator}
				/>

				<RaceFinish style={{ top: 265, left: 830, zIndex: 3 }} time={leftTeamTime} place={leftTeamPlace} />
				<RaceFinish style={{ top: 265, left: 960, zIndex: 3 }} time={rightTeamTime} place={rightTeamPlace} />

				<RightBox>
					<SponsorsBox
						ref={sponsorRef}
						style={{ flexGrow: 1 }}
						sponsors={props.sponsors}
						sponsorStyle={SponsorSize}
						tweetStyle={TwitterSize}
					/>
				</RightBox>
			</Topbar>
			<CentralDivider />
			<BottomBlock>
				<BespokeCouch>
					<CouchLabel>
						{props.couchInformation.current.length > 1 ? 'Commentators' : 'Commentator'}
					</CouchLabel>
					{/* Since this is a special placement it has to be made custom here */}
					{couch.map((person) => {
						return (
							<PersonCompressed
								key={person.name}
								person={person}
								speaking={props.obsAudioIndicator?.find((audio) => audio.id == person.name)?.active}
							/>
						);
					})}
					{host && (
						<PersonCompressed
							key={'Host'}
							person={host}
							speaking={props.obsAudioIndicator?.find((audio) => audio.id == host.name)?.active}
							host
						/>
					)}
				</BespokeCouch>
			</BottomBlock>
		</Widescreen2Container>
	);
});
