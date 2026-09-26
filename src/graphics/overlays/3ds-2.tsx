import styled from "@emotion/styled";

import type { OverlayProps } from "../gameplay-overlay";

import { Facecam } from "../elements/facecam";
import { AudioIndicator } from "../elements/audio-indicator";
import { RaceFinish } from "../elements/race-finish";
import { getTeams } from "../elements/team-data";
import * as RunInfo from "../elements/run-info";
import { Timer } from "../elements/timer";
import { Container } from "../elements/container";
import { runCustomDataSchema } from "../../shared/types/custom-data";
import { GameplayCapture } from "../elements/gameplay-capture";

const ThreeDS2Container = styled.div`
	height: 1016px;
	width: 1920px;
	display: flex;
	flex-direction: column;
	align-items: stretch;
	position: relative;
`;

const GameRow = styled.div`
	display: flex;
	align-items: stretch;
`;

const Middle = styled.div`
	position: relative;
	overflow: hidden;
	width: 745px;
	display: flex;
	flex-direction: column;
	align-items: stretch;
`;

const InfoBox = styled(Container)`
	display: flex;
	justify-content: space-between;
	padding: 16px;
	box-sizing: border-box;
	flex-grow: 1;

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
	width: 4px;
`;

export function ThreeDS2(props: OverlayProps) {
	const teamData = getTeams(props.runData, props.timer, 2);

	const allRunnerIds = props.runData?.teams.flatMap((team) => team.players.map((player) => player.id)) ?? [];
	const customData = runCustomDataSchema.safeParse(props.runData?.customData);

	return (
		<ThreeDS2Container>
			<GameRow style={{ flex: 1 }}>
				<GameplayCapture aspectRatio="5:3" grow />
				<CentralDivider />
				<GameplayCapture aspectRatio="5:3" grow />
			</GameRow>
			<GameRow>
				<GameplayCapture aspectRatio="4:3" grow />
				<Middle>
					<Facecam
						height={270}
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
						style={{ position: "absolute", top: 801, left: 1 }}
					/>
					<AudioIndicator
						active={props.gameAudioIndicator === allRunnerIds[1]}
						side="top"
						style={{
							position: "absolute",
							top: 801,
							right: 1,
							zIndex: 2,
						}}
					/>
					<InfoBox>
						<InfoBoxColumn id="gameInfo">
							<RunInfo.GameTitle game={customData.data?.gameDisplay ?? props.runData?.game ?? ""} />
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
				<GameplayCapture aspectRatio="4:3" grow />
			</GameRow>
		</ThreeDS2Container>
	);
}
