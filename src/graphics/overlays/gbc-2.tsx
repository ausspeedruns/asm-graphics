import styled from "@emotion/styled";

import type { OverlayProps } from "../gameplay-overlay";

import { SmallInfo } from "../elements/info-box/small";
import { SponsorsBox } from "../elements/sponsors";
import { AudioIndicator } from "../elements/audio-indicator";
import { Facecam } from "../elements/facecam";
import { RaceFinish } from "../elements/race-finish";
import { Couch } from "../elements/couch";
import { getTeams } from "../elements/team-data";
import { GameplayCapture } from "../elements/gameplay-capture";
import { Container } from "../elements/container";

// import Standard2p from "./backgrounds/Standard2p.png";

const Standard2Container = styled.div`
	height: 1016px;
	width: 1920px;
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: stretch;
`;

const Topbar = styled.div`
	display: flex;
	overflow: hidden;
`;

const LeftBox = styled(Container)`
	flex: 1;
	display: flex;
	position: relative;
	box-sizing: border-box;
	font-size: 30px;
`;

const RightBox = styled(Container)`
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	position: relative;
	z-index: 2;
	box-sizing: border-box;
`;

const GameRow = styled.div`
	display: flex;
	flex: 1;
	min-height: 0;
	align-items: stretch;
`;

const CentralDivider = styled.div`
	width: 2px;
	background: var(--sec);
`;

const FillerBox = styled(Container)`
	flex-grow: 1;
`;

const WholeGraphicClip = styled.div`
	position: absolute;
	width: 1920px;
	height: 1016px;
	clip-path: path("M 0 0 H 666 V 295 H 0 Z M 1920 0 H 1254 V 295 H 1921 Z ");
	// background: var(--main);
	z-index: 1;
`;

export function GBC2(props: OverlayProps) {
	const teamData = getTeams(props.runData, props.timer, 2);
	const allRunnerIds = props.runData?.teams.flatMap((team) => team.players.map((player) => player.id)) ?? [];

	return (
		<Standard2Container>
			<WholeGraphicClip>
				{/* <img
					style={{ position: "absolute", width: "100%" }}
					src={Standard2p}
				/> */}
			</WholeGraphicClip>
			<Topbar>
				<LeftBox>
					<SmallInfo timer={props.timer} runData={props.runData} />
				</LeftBox>

				<AudioIndicator
					active={props.gameAudioIndicator === allRunnerIds[0]}
					side="top"
					style={{
						position: "absolute",
						top: 214,
						left: 667,
						zIndex: 2,
					}}
				/>
				<AudioIndicator
					active={props.gameAudioIndicator === allRunnerIds[1]}
					side="top"
					style={{
						position: "absolute",
						top: 214,
						right: 667,
						zIndex: 2,
					}}
				/>

				<Facecam
					width={586}
					maxNameWidth={190}
					style={{
						borderRight: "1px solid var(--sec)",
						borderLeft: "1px solid var(--sec)",
						zIndex: 2,
					}}
					teams={props.runData?.teams}
					audioIndicator={props.microphoneAudioIndicator}
				/>

				<RaceFinish style={{ top: 219, left: 830 }} time={teamData[0]?.time} place={teamData[0]?.place} />
				<RaceFinish style={{ top: 219, left: 960 }} time={teamData[1]?.time} place={teamData[1]?.place} />

				<RightBox>
					<div
						style={{
							display: "flex",
							width: "100%",
							flexGrow: 1,
							alignItems: "center",
							zIndex: 2,
						}}
					>
						<Couch
							commentators={props.commentators}
							style={{ width: "30%", zIndex: 3, marginLeft: 12 }}
							audio={props.microphoneAudioIndicator}
							align="center"
						/>
						<SponsorsBox sponsors={props.sponsors} width={360} height={230} style={{ flexGrow: 1 }} />
					</div>
				</RightBox>
			</Topbar>
			<GameRow>
				<FillerBox />
				<GameplayCapture aspectRatio="10:9" />
				<CentralDivider />
				<GameplayCapture aspectRatio="10:9" />
				<FillerBox />
			</GameRow>
		</Standard2Container>
	);
}
