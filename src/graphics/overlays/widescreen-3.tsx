import React from "react";
import styled from "styled-components";

import { OverlayProps } from "@asm-graphics/types/OverlayProps";

import { AudioIndicator } from "../elements/audio-indicator";
import { Facecam } from "../elements/facecam";
import { getTeams } from "../elements/team-data";
// import { RaceFinish } from '../elements/race-finish';

import { Timer } from "../elements/timer";
import * as RunInfo from "../elements/run-info";

import GameplayBL from "../media/Widescreen-3-BL.svg";
import GameplayTL from "../media/Widescreen-3-TL.svg";
import GameplayTR from "../media/Widescreen-3-TR.svg";
import { RaceFinish } from "../elements/race-finish";

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
	const teamData = getTeams(props.runData, props.timer, 3);

	return (
		<Widescreen3Container>
			<WideAudioIndicator active={props.gameAudioIndicator === 0} side="top" style={{ left: 961 }} />
			<WideAudioIndicator active={props.gameAudioIndicator === 1} side="top" style={{ left: 1262 }} />
			<WideAudioIndicator active={props.gameAudioIndicator === 2} side="top" style={{ left: 1563 }} />
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
						icons={[
							<NPIcon src={GameplayBL} key="BL" />,
							<NPIcon src={GameplayTL} key="TL" />,
							<NPIcon src={GameplayTR} key="TR" />,
						]}
						style={{ borderRight: "1px solid var(--sec)" }}
						audioIndicator={props.microphoneAudioIndicator}
					/>

					<RaceFinish
						style={{ top: 758, left: 1046, zIndex: 3 }}
						time={teamData[0].time}
						place={teamData[0].place}
					/>
					<RaceFinish
						style={{ top: 758, left: 1346, zIndex: 3 }}
						time={teamData[1].time}
						place={teamData[1].place}
					/>
					<RaceFinish
						style={{ top: 758, left: 1647, zIndex: 3 }}
						time={teamData[2].time}
						place={teamData[2].place}
					/>
					<InfoBox>
						<InfoBoxRow style={{ height: "23%" }}>
							<InfoBoxCell>
								<RunInfo.GameTitle
									style={{ fontSize: 30 }}
									maxWidth={440}
									game={props.runData?.game || ""}
								/>
							</InfoBoxCell>
							<InfoBoxCell>
								<RunInfo.Category
									style={{ fontSize: 30 }}
									maxWidth={440}
									category={props.runData?.category || ""}
								/>
							</InfoBoxCell>
						</InfoBoxRow>
						<InfoBoxRow style={{ height: "43%" }}>
							<InfoBoxCell>
								<div style={{ width: "100%", display: "flex", justifyContent: "space-evenly" }}>
									<RunInfo.System style={{ fontSize: 34 }} system={props.runData?.system || ""} />
									<RunInfo.Year style={{ fontSize: 34 }} year={props.runData?.release || ""} />
									<RunInfo.Estimate fontSize={34} estimate={props.runData?.estimate || ""} />
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
