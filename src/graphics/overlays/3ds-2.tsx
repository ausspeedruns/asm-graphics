import styled from "@emotion/styled";

import type { OverlayProps } from "../gameplay-overlay";

import { Facecam } from "../elements/facecam";
import { AudioIndicator } from "../elements/audio-indicator";
import { RaceFinish } from "../elements/race-finish";
import { getTeams } from "../elements/team-data";
import * as RunInfo from "../elements/run-info";
import { Timer } from "../elements/timer";
import { ASM26Felt } from "../elements/asm26/asm26-felt";

const ThreeDS2Container = styled.div`
	height: 1016px;
	width: 1920px;
	display: flex;
	justify-content: center;
	position: relative;
`;

const Middle = styled.div`
	position: relative;
	height: 100%;
	width: 744px;
	/* border-right: 1px solid var(--pax-gold);
	border-left: 1px solid var(--pax-gold); */
	overflow: hidden;
	// margin-top: 576px;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	align-items: center;
`;

const InfoBox = styled(ASM26Felt)`
	// background-color: var(--main);
	display: flex;
	justify-content: space-between;
	height: 133px;
	width: 100%;
	padding: 16px;
	box-sizing: border-box;

	font-size: 22px;

	& #gameTitle {
		font-size: 180%;
	}

	& #timer {
		font-size: 220%;
	}

	& #category {
		max-width: 60%;
		font-size: 80%;
	}

	& > div {
		z-index: 5;
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

	& > div {
		flex-shrink: 0;
	}
`;

const CentralDivider = styled.div`
	background-color: var(--sec);
	width: 2px;
	flex-grow: 1;
`;

export const ThreeDS2 = (props: OverlayProps) => {
	const teamData = getTeams(props.runData, props.timer, 2);

	const allRunnerIds = props.runData?.teams.flatMap((team) => team.players.map((player) => player.id)) ?? [];

	return (
		<ThreeDS2Container>
			<Middle>
				<CentralDivider />
				<Facecam
					height={307}
					teams={props.runData?.teams}
					audioIndicator={props.microphoneAudioIndicator}
					style={{
						borderTop: "1px solid var(--sec)",
						borderRight: "1px solid var(--sec)",
						borderLeft: "1px solid var(--sec)",
						boxSizing: "border-box",
					}}
				/>

				<RaceFinish style={{ top: 801, left: 16 }} time={teamData[0]?.time} place={teamData[0]?.place} />
				<RaceFinish style={{ top: 801, right: 16 }} time={teamData[1]?.time} place={teamData[1]?.place} />

				<AudioIndicator
					active={props.gameAudioIndicator === allRunnerIds[0]}
					side="top"
					style={{ position: "absolute", top: 801, left: 0 }}
				/>
				<AudioIndicator
					active={props.gameAudioIndicator === allRunnerIds[1]}
					side="top"
					style={{
						position: "absolute",
						top: 801,
						right: 0,
						zIndex: 2,
					}}
				/>
				<InfoBox particlesId="infoBox">
					<InfoBoxColumn id="gameInfo">
						<RunInfo.GameTitle game={props.runData?.game ?? ""} />
						<GameInfoBox>
							<RunInfo.System system={props.runData?.system ?? ""} />
							<RunInfo.Year year={props.runData?.release ?? ""} />
						</GameInfoBox>
					</InfoBoxColumn>
					<InfoBoxColumn id="runInfo">
						<Timer milliseconds={props.timer?.milliseconds} />
						<GameInfoBox>
							<RunInfo.Category category={props.runData?.category ?? ""} />
							<RunInfo.Estimate estimate={props.runData?.estimate ?? ""} />
						</GameInfoBox>
					</InfoBoxColumn>
				</InfoBox>
			</Middle>
		</ThreeDS2Container>
	);
};
