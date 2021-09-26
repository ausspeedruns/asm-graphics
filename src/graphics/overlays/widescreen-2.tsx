import React from 'react';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';
// @ts-ignore
// import Twemoji from 'react-twemoji';

import { CouchPerson, OverlayProps } from '../../types/OverlayProps';

import { SmallInfo, ISmallStyling } from '../elements/info-box/small';

import { SponsorsBox } from '../elements/sponsors';
import { AudioIndicator } from '../elements/audio-indicator';
import { Facecam } from '../elements/facecam';
import { RaceFinish } from '../elements/race-finish';
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
	border-bottom: 1px solid var(--pax-gold);
`;

const RightBox = styled.div`
	width: 666px;
	height: 100%;
	background-image: url("../shared/design/contour-maps/widescreen-2-right.svg");
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
	background: var(--pax-gold);
`;

const BottomBlock = styled.div`
	position: absolute;
	top: 881px;
	height: 135px;
	width: 1920px;
	background-image: url("../shared/design/contour-maps/widescreen-2-bottom.svg");
	border-bottom: 1px solid var(--pax-gold);
	border-top: 1px solid var(--pax-gold);
	box-sizing: border-box;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const BespokeCouch = styled.div`
	font-family: National Park;
	display: flex;
	align-items: center;
`;

const CouchLabel = styled.span`
	color: #F2DAB2;
	font-size: 40px;
	margin-right: 8px;
`;

const customSmallStyling: ISmallStyling = {
	gameTitleSize: 60,
	gameTitleWidth: 640,
	categoryWidth: 320,
	mainStyle: {
		width: 666,
		height: '100%',
		backgroundImage: "url(../shared/design/contour-maps/widescreen-2-left.svg)",
	},
};

export const Widescreen2: React.FC<OverlayProps> = (props) => {
	const [audioIndicatorRep] = useReplicant<string, string>('audio-indicator', '');
	const [currentHost] = useReplicant<CouchPerson, CouchPerson>('host', {
		name: '',
		pronouns: '',
	});

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

	return (
		<Widescreen2Container>
			<Topbar>
				<SmallInfo timer={props.timer} runData={props.runData} style={customSmallStyling} />

				<AudioIndicator
					active={audioIndicatorRep === (props.runData?.teams[0]?.id || '')}
					side="left"
					style={{ position: 'absolute', top: 300, left: 624 }}
				/>
				<AudioIndicator
					active={audioIndicatorRep === (props.runData?.teams[1]?.id || '')}
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
						borderRight: '1px solid var(--pax-gold)',
						borderLeft: '1px solid var(--pax-gold)',
						zIndex: 2,
					}}
					teams={props.runData?.teams}
					maxNameWidth={190}
					noCam={props.preview ? props.noCam.preview : props.noCam.current}
				/>

				<RaceFinish style={{ top: 265, left: 830, zIndex: 3 }} time={leftTeamTime} place={leftTeamPlace} />
				<RaceFinish style={{ top: 265, left: 960, zIndex: 3 }} time={rightTeamTime} place={rightTeamPlace} />

				<RightBox>
					<SponsorsBox style={{ flexGrow: 1 }} sponsorStyle={SponsorSize} tweetStyle={TwitterSize} />
				</RightBox>
			</Topbar>
			<CentralDivider />
			<BottomBlock>
				<BespokeCouch>
					<CouchLabel>
						{props.couchInformation.current.length > 0 ? 'Commentators' : 'Commentator'}
					</CouchLabel>
					{/* Since this is a special placement it has to be made custom here */}
					{props.preview
						? props.couchInformation.preview.map((person) => {
								return <PersonCompressed person={person} />;
						  })
						: props.couchInformation.current.map((person) => {
								return <PersonCompressed person={person} />;
						  })}
					<PersonCompressed key={'Host'} person={currentHost} host />
				</BespokeCouch>
			</BottomBlock>
		</Widescreen2Container>
	);
};
