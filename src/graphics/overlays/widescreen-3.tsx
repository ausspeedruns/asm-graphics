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

import ASM26FeltBg from "../media/asm26/asm26-sweater.png";
import { ASM26Bricks } from "../elements/asm26/asm26-bricks";

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
	// background: var(--main);
	/* background-image: url('../shared/design/contour-maps/widescreen-3-bottom.svg'); */
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

	position: relative;
	background: #ffffff;
	box-sizing: border-box;

	/* Repeating image at 60% opacity */
	&::before {
		content: "";
		position: absolute;
		inset: 0;
		z-index: 0;

		background-image: url(${ASM26FeltBg});
		background-repeat: repeat;
		background-size: 2000px;
		opacity: 0.6;
	}

	/* Top red layer on multiply */
	&::after {
		content: "";
		position: absolute;
		inset: 0;
		z-index: 1;

		background: #cc3622;
		mix-blend-mode: multiply;
		pointer-events: none;
	}

	& > * {
		z-index: 2;
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
	// background: var(--main);
	isolation: isolate;
	overflow: hidden;

	background: #ffffff;

	/* Repeating image at 60% opacity */
	&::before {
		content: "";
		position: absolute;
		inset: 0;
		z-index: 0;

		background-image: url(${ASM26FeltBg});
		background-repeat: repeat;
		background-size: 2000px;
		opacity: 0.6;
	}

	/* Top red layer on multiply */
	&::after {
		content: "";
		position: absolute;
		inset: 0;
		z-index: 1;

		background: #cc3622;
		mix-blend-mode: multiply;
		pointer-events: none;
	}

	& span {
		z-index: 2;
		position: relative;

		color: #ffa23e;
		font-family: var(--game-font);
		writing-mode: vertical-rl;
		text-orientation: mixed;
		font-size: 49px;
		filter: drop-shadow(4px 0px 0px #000000);
		letter-spacing: 38%;
	}
`;

const RightBG = styled.div`
	position: absolute;
	right: 0;
	height: 1016px;
	width: 57px;

	background: #ffffff;

	/* Repeating image at 60% opacity */
	&::before {
		content: "";
		position: absolute;
		inset: 0;
		z-index: 0;

		background-image: url(${ASM26FeltBg});
		background-repeat: repeat;
		background-size: 2000px;
		opacity: 0.6;
	}

	/* Top red layer on multiply */
	&::after {
		content: "";
		position: absolute;
		inset: 0;
		z-index: 1;

		background: #cc3622;
		mix-blend-mode: multiply;
		pointer-events: none;
	}

	& span {
		z-index: 2;
		position: relative;

		color: var(--sec);
		font-family: var(--game-font);
		writing-mode: vertical-rl;
		text-orientation: mixed;
		font-size: 49px;
		filter: drop-shadow(4px 0px 0px #000000);
		letter-spacing: 38%;
	}
`;

const FacecamBorderLeft = styled(ASM26Bricks)`
	position: absolute;
	top: 0;
	left: 0;
	width: 170px;
	height: 285px;

	&::before {
		background-size: 350%;
	}
`;

const FacecamBorderRight = styled(ASM26Bricks)`
	position: absolute;
	top: 0;
	right: 0;
	width: 170px;
	height: 285px;

	&::before {
		background-size: 350%;
	}
`;

const FacecamBorderTrim = styled(ASM26Bricks)`
	position: absolute;
	width: 44px;
	height: 100%;

	background: #FF6A59;

	z-index: 3;

	&::before {
		background-size: 2000%;
		mix-blend-mode: multiply;
		opacity: 1;
	}
`;

export const Widescreen3 = (props: OverlayProps) => {
	const teamData = getTeams(props.runData, props.timer, 3);

	const allRunnerIds = props.runData?.teams.flatMap((team) => team.players.map((player) => player.id)) ?? [];

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
			<LeftBG>
				<span>*********************</span>
			</LeftBG>
			<RightBG>
				<span>*********************</span>
			</RightBG>
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

					<FacecamBorderLeft particlesId="facecamBorderLeft">
						<FacecamBorderTrim style={{ right: 0 }} particlesId="facecamBorderTrimLeft" />
					</FacecamBorderLeft>
					<FacecamBorderRight particlesId="facecamBorderRight">
						<FacecamBorderTrim style={{ left: 0 }} particlesId="facecamBorderTrimRight" />
					</FacecamBorderRight>

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
							<Timer milliseconds={props.timer?.milliseconds} />
						</InfoBoxColumn>
					</InfoBox>
				</Screen>
			</BottomBar>
			<CentralDivider />
		</Widescreen3Container>
	);
};
