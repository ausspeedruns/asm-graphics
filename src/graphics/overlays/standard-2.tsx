import styled from "@emotion/styled";

import type { OverlayProps } from "../gameplay-overlay";

import { SmallInfo } from "../elements/info-box/small";
import { SponsorsBox } from "../elements/sponsors";
import { AudioIndicator } from "../elements/audio-indicator";
import { Facecam } from "../elements/facecam";
import { RaceFinish } from "../elements/race-finish";
import { Couch } from "../elements/couch";
import { getTeams } from "../elements/team-data";
import { Container } from "../elements/container";

import Standard2p from "./backgrounds/Standard2p.png";
import { GameplayCapture } from "../elements/gameplay-capture";

const Standard2Container = styled.div`
	height: 1016px;
	width: 1920px;
	display: flex;
	flex-direction: column;
`;

const Topbar = styled.div`
	display: flex;
	width: 100%;
	flex: 1;
	overflow: hidden;
`;

const LeftBox = styled(Container)`
	position: relative;
	flex: 1;
	height: 100%;
	display: flex;
	font-size: 30px;
`;

const RightBox = styled(Container)`
	position: relative;
	flex: 1;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

const GameplayRow = styled.div`
	display: flex;
	flex-direction: row;
	align-items: stretch;
`;

const CentralDivider = styled.div`
	width: 2px;
	background: var(--sec);
`;

const WholeGraphicClip = styled.div`
	position: absolute;
	width: 1920px;
	height: 1016px;
	clip-path: path("M 0 0 H 666 V 297 H 0 Z M 1920 0 H 1254 V 297 H 1921 Z ");
	// background: var(--main);
	z-index: 1;
`;

export function Standard2(props: OverlayProps) {
	const teamData = getTeams(props.runData, props.timer, 2);
	const allRunnerIds = props.runData?.teams.flatMap((team) => team.players.map((player) => player.id)) ?? [];

	return (
		<Standard2Container>
			<WholeGraphicClip>
				{/* <img style={{ position: "absolute", width: "100%" }} src={Standard2p} /> */}
			</WholeGraphicClip>
			<Topbar>
				<LeftBox>
					<SmallInfo timer={props.timer} runData={props.runData} />
				</LeftBox>

				<AudioIndicator
					active={props.gameAudioIndicator === allRunnerIds[0]}
					side="left"
					style={{
						position: "absolute",
						top: 215,
						left: 666,
						zIndex: 2,
					}}
				/>
				<AudioIndicator
					active={props.gameAudioIndicator === allRunnerIds[1]}
					side="right"
					style={{
						position: "absolute",
						top: 215,
						right: 666,
						zIndex: 2,
					}}
				/>

				<Facecam
					maxNameWidth={190}
					style={{
						borderRight: "1px solid var(--sec)",
						borderLeft: "1px solid var(--sec)",
						flex: 1,
						zIndex: 2,
					}}
					teams={props.runData?.teams}
					audioIndicator={props.microphoneAudioIndicator}
				/>

				<RaceFinish style={{ top: 221, left: 830 }} time={teamData[0]?.time} place={teamData[0]?.place} />
				<RaceFinish style={{ top: 221, left: 960 }} time={teamData[1]?.time} place={teamData[1]?.place} />

				<RightBox>
					<div
						style={{
							display: "flex",
							width: "100%",
							height: "100%",
							justifyContent: "space-around",
							alignItems: "center",
							zIndex: 2,
						}}
					>
						<Couch
							commentators={props.commentators}
							style={{ width: "30%", zIndex: 3 }}
							audio={props.microphoneAudioIndicator}
							align="center"
						/>
						<SponsorsBox sponsors={props.sponsors} width={360} height={230} />
					</div>
				</RightBox>
			</Topbar>
			<GameplayRow>
				<GameplayCapture aspectRatio="4:3" grow />
				<CentralDivider />
				<GameplayCapture aspectRatio="4:3" grow />
			</GameplayRow>
		</Standard2Container>
	);
}
