import styled from "@emotion/styled";

import type { OverlayProps } from "../gameplay-overlay";

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
import { Container } from "../elements/container";
import { runCustomDataSchema } from "../../shared/types/custom-data";

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
	position: relative;
`;

const TopBar = styled.div`
	display: flex;
	justify-content: center;
	width: 1920px;

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

const InfoBox = styled(Container)`
	position: relative;
	box-sizing: border-box;
	width: 902px;
	height: 181px;
	padding: 0 20px;
	display: grid;
	grid-template-columns: 50% 50%;
	align-items: center;
	justify-items: center;
	// border-right: 1px solid var(--main);

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

const LeftBG = styled(Container)`
	position: absolute;
	left: 0;
	height: 1016px;
	width: 57px;
	overflow: hidden;
`;

const RightBG = styled(Container)`
	position: absolute;
	right: 0;
	height: 1016px;
	width: 57px;
`;

const FacecamBorder = styled(Container)`
	position: absolute;
	top: 0;
	width: 170px;
	height: 285px;
`;

const FacecamBorderLeft = styled(FacecamBorder)`
	left: 0;
`;

const FacecamBorderRight = styled(FacecamBorder)`
	right: 0;
`;

export const Widescreen3 = (props: OverlayProps) => {
	const teamData = getTeams(props.runData, props.timer, 3);

	const allRunnerIds = props.runData?.teams.flatMap((team) => team.players.map((player) => player.id)) ?? [];

	const customData = runCustomDataSchema.safeParse(props.runData?.customData);

	return (
		<Widescreen3Container>
			<WideAudioIndicator
				active={props.gameAudioIndicator === allRunnerIds[0]}
				side="top"
				style={{ left: 961 }}
			/>
			<WideAudioIndicator
				active={props.gameAudioIndicator === allRunnerIds[1]}
				side="top"
				style={{ left: 1262 }}
			/>
			<WideAudioIndicator
				active={props.gameAudioIndicator === allRunnerIds[2]}
				side="top"
				style={{ left: 1563 }}
			/>
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

					<FacecamBorderLeft />
					<FacecamBorderRight />

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
							<RunInfo.GameTitle game={customData.data?.gameDisplay ?? props.runData?.game ?? ""} />
							<GameInfoBox>
								<RunInfo.System system={props.runData?.system ?? ""} />
								<RunInfo.Year year={props.runData?.release ?? ""} />
								<RunInfo.Estimate estimate={props.runData?.estimate ?? ""} />
							</GameInfoBox>
						</InfoBoxColumn>
						<InfoBoxColumn id="runInfo">
							<RunInfo.Category category={props.runData?.category ?? ""} />
							<Timer milliseconds={props.timer?.milliseconds} />
						</InfoBoxColumn>
					</InfoBox>
				</Screen>
			</BottomBar>
			<CentralDivider />
		</Widescreen3Container>
	);
};
