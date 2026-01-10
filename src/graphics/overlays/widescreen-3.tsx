import styled from "styled-components";

import type { OverlayProps } from "@asm-graphics/types/OverlayProps";

import { AudioIndicator } from "../elements/audio-indicator";
import { Facecam } from "../elements/facecam";
import { getTeams } from "../elements/team-data";
// import { RaceFinish } from '../elements/race-finish';

import { Timer } from "../elements/timer";
import * as RunInfo from "../elements/run-info";

import GameplayBL from "../media/icons/Widescreen-3-BL.svg";
import GameplayTL from "../media/icons/Widescreen-3-TL.svg";
import GameplayTR from "../media/icons/Widescreen-3-TR.svg";
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
	height: 508px;
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

const NPIcon = styled.img`
	width: 40px;
	height: auto;
	margin: 0 5px;
`;

const InfoBox = styled.div`
	background: var(--main);
	/* background-image: url('../shared/design/contour-maps/widescreen-3-bottom.svg'); */
	width: 923px;
	height: 182px;
	padding: 0 20px;
	display: grid;
	grid-template-columns: 50% 50%;
	align-items: center;
	justify-items: center;
	border-right: 1px solid var(--main);

	font-size: 22px;

	& #gameTitle {
		font-size: 250%;
	}

	& #timer {
		font-size: 400%;
	}

	& #category {
		max-width: 90%;
		font-size: 120%;
	}
`;

const InfoBoxColumn = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 10px;
`;

const GameInfoBox = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-evenly;
	align-items: center;
`;

const WideAudioIndicator = styled(AudioIndicator)`
	position: absolute;
	top: 753px;

	& > div {
		width: 50px;
	}
`;

const LeftBG = styled.div`
	position: absolute;
	left: 0;
	height: 1016px;
	width: 57px;
	background: var(--main);
`;

const RightBG = styled.div`
	position: absolute;
	right: 0;
	height: 1016px;
	width: 57px;
	background: var(--main);
`;

export const Widescreen3 = (props: OverlayProps) => {
	const teamData = getTeams(props.runData, props.timer, 3);

	return (
		<Widescreen3Container>
			<WideAudioIndicator active={props.gameAudioIndicator === 0} side="top" style={{ left: 961 }} />
			<WideAudioIndicator active={props.gameAudioIndicator === 1} side="top" style={{ left: 1262 }} />
			<WideAudioIndicator active={props.gameAudioIndicator === 2} side="top" style={{ left: 1563 }} />
			<LeftBG />
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
						time={teamData[0]?.time}
						place={teamData[0]?.place}
					/>
					<RaceFinish
						style={{ top: 758, left: 1346, zIndex: 3 }}
						time={teamData[1]?.time}
						place={teamData[1]?.place}
					/>
					<RaceFinish
						style={{ top: 758, left: 1647, zIndex: 3 }}
						time={teamData[2]?.time}
						place={teamData[2]?.place}
					/>
					<InfoBox>
						<InfoBoxColumn id="gameInfo">
							<RunInfo.GameTitle game={props.runData?.game ?? ""} />
							<GameInfoBox>
								<RunInfo.System system={props.runData?.system ?? ""} />
								<RunInfo.Year year={props.runData?.release ?? ""} />
								<RunInfo.Estimate estimate={props.runData?.estimate ?? ""} />
							</GameInfoBox>
						</InfoBoxColumn>
						<InfoBoxColumn id="runInfo">
							<RunInfo.Category category={props.runData?.category ?? ""} />
							<Timer timer={props.timer} />
						</InfoBoxColumn>
					</InfoBox>
				</Screen>
			</BottomBar>
			<CentralDivider />
		</Widescreen3Container>
	);
};
