import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import styled from 'styled-components';

import { OverlayProps, OverlayRef } from '@asm-graphics/types/OverlayProps';

import { SmallInfo, ISmallStyling } from '../elements/info-box/small';
import { SponsorBoxRef, SponsorsBox } from '../elements/sponsors';
import { AudioIndicator } from '../elements/audio-indicator';
import { Facecam } from '../elements/facecam';
import { RaceFinish } from '../elements/race-finish';
import { Couch } from '../elements/couch';

import StandardLeft from '../media/ASM23/standard-2-left.png';
import StandardRight from '../media/ASM23/standard-2-right.png';

const Standard2Container = styled.div`
	height: 1016px;
	width: 1920px;
`;

const Topbar = styled.div`
	display: flex;
	position: absolute;
	height: 295px;
	width: 1920px;
	border-bottom: 1px solid var(--asm-orange);
	overflow: hidden;
`;

const LeftBox = styled.div`
	width: 666px;
	height: 100%;
	display: flex;
	background: var(--main);
	position: relative;
`;

const RightBox = styled.div`
	width: 666px;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	background: var(--main);
	position: relative;
`;

const SponsorSize = {
	height: 230,
	width: 440,
	marginRight: -40,
};

const TwitterSize = {
	height: 220,
	width: 420,
	marginTop: -40,
};

const CentralDivider = styled.div`
	height: 720px;
	width: 2px;
	position: absolute;
	top: 296px;
	left: 959px;
	background: var(--asm-orange);
`;

const customSmallStyling: ISmallStyling = {
	categoryWidth: 260,
	timerStackHeight: 148,
	lowerStackHeight: 148,
	gameNameBottomMargin: -40,
	mainStyle: {
		height: '100%',
		width: '100%',
		zIndex: 1,
		padding: 0,
	},
	lowerStackStyle: {
		justifyContent: 'space-between',
	},
	timerStyle: {
		flexGrow: 1,
	},
	gameNameStyle: {
		lineHeight: '42px',
	},
	categoryStyle: {
		width: 284,
	},
};

export const Standard2 = forwardRef<OverlayRef, OverlayProps>((props, ref) => {
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
			currentAudio = props.runData.teams[0]?.players.findIndex((player) => props.audioIndicator === player.id);
		}
	}

	return (
		<Standard2Container>
			<Topbar>
				<LeftBox>
					<img
						style={{ position: 'absolute', height: '100%', width: '100%', objectFit: 'cover' }}
						src={StandardLeft}
					/>
					<SmallInfo timer={props.timer} runData={props.runData} style={customSmallStyling} />
				</LeftBox>

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
						borderRight: '1px solid var(--asm-orange)',
						borderLeft: '1px solid var(--asm-orange)',
					}}
					teams={props.runData?.teams}
					audioIndicator={props.obsAudioIndicator}
				/>

				<RaceFinish style={{ top: 220, left: 830 }} time={leftTeamTime} place={leftTeamPlace} />
				<RaceFinish style={{ top: 220, left: 960 }} time={rightTeamTime} place={rightTeamPlace} />

				<RightBox>
					<img
						style={{ position: 'absolute', height: '100%', width: '100%', objectFit: 'cover' }}
						src={StandardRight}
					/>
					<div
						style={{
							display: 'flex',
							width: '100%',
							flexGrow: 1,
							alignItems: 'center',
						}}>
						<Couch
							couch={props.couchInformation}
							style={{ width: '30%', zIndex: 3 }}
							audio={props.obsAudioIndicator}
						/>
						<SponsorsBox
							ref={sponsorRef}
							sponsors={props.sponsors}
							style={{ flexGrow: 1 }}
							sponsorStyle={SponsorSize}
							tweetStyle={TwitterSize}
						/>
					</div>
				</RightBox>
			</Topbar>
			<CentralDivider />
		</Standard2Container>
	);
});
