import styled from "@emotion/styled";

import type { OverlayProps } from "../gameplay-overlay";

import { VerticalInfo } from "../elements/info-box/vertical";
import { SponsorsBox } from "../elements/sponsors";
import { Facecam } from "../elements/facecam";
import { Couch } from "../elements/couch";
import { AudioIndicator } from "../elements/audio-indicator";
import { RaceFinish } from "../elements/race-finish";
import { getTeams } from "../elements/team-data";
import { Container } from "../elements/container";
import { GameplayCapture } from "../elements/gameplay-capture";

const DS2Container = styled.div`
	height: 1016px;
	width: 1920px;
	display: flex;
	justify-content: center;
	position: relative;
`;

const Middle = styled.div`
	position: relative;
	height: 1016px;
	width: 566px;
	border-right: 1px solid var(--sec);
	border-left: 1px solid var(--sec);
	overflow: hidden;
`;

const InfoBox = styled(Container)`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	height: 664px;
	padding: 16px;
	box-sizing: border-box;
	position: relative;
	font-size: 30px;
`;

const GameColumn = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
`;

export const DS2 = (props: OverlayProps) => {
	const teamData = getTeams(props.runData, props.timer, 2);

	const allRunnerIds = props.runData?.teams.flatMap((team) => team.players.map((player) => player.id)) ?? [];

	return (
		<DS2Container>
			<GameColumn>
				<GameplayCapture aspectRatio="4:3" />
				<GameplayCapture aspectRatio="4:3" />
			</GameColumn>
			<Middle>
				<Facecam height={352} teams={props.runData?.teams} audioIndicator={props.microphoneAudioIndicator} />

				<RaceFinish style={{ top: 276, left: 830 }} time={teamData[0]?.time} place={teamData[0]?.place ?? -1} />
				<RaceFinish style={{ top: 276, left: 960 }} time={teamData[1]?.time} place={teamData[1]?.place ?? -1} />

				<AudioIndicator
					active={props.gameAudioIndicator === allRunnerIds[0]}
					side="top"
					style={{ position: "absolute", top: 270, left: 678 }}
				/>
				<AudioIndicator
					active={props.gameAudioIndicator === allRunnerIds[1]}
					side="top"
					style={{
						position: "absolute",
						top: 270,
						right: 678,
						zIndex: 2,
					}}
				/>
				<InfoBox>
					<Couch commentators={props.commentators} style={{ zIndex: 2 }} />
					<VerticalInfo timer={props.timer} runData={props.runData} />
					<SponsorsBox sponsors={props.sponsors} width={430} height={130} style={{ zIndex: 2 }} />
				</InfoBox>
			</Middle>
			<GameColumn>
				<GameplayCapture aspectRatio="4:3" />
				<GameplayCapture aspectRatio="4:3" />
			</GameColumn>
		</DS2Container>
	);
};
