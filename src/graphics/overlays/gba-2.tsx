import styled from "@emotion/styled";

import type { OverlayProps } from "../gameplay-overlay";

import { SmallInfo } from "../elements/info-box/small";
import { SponsorsBox } from "../elements/sponsors";
import { AudioIndicator } from "../elements/audio-indicator";
import { Facecam } from "../elements/facecam";
import { RaceFinish } from "../elements/race-finish";
import { Couch } from "../elements/couch";
import { getTeams } from "../elements/team-data";

import GBA2p from "./backgrounds/GBA2p.png";
import { Container } from "../elements/container";
import { GameplayCapture } from "../elements/gameplay-capture";

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
	align-items: stretch;
	flex: 1;
	border-bottom: 1px solid var(--sec);
	overflow: hidden;
`;

const LeftBox = styled(Container)`
	flex: 1;
	display: flex;
	position: relative;
	font-size: 35px;
`;

const RightBox = styled(Container)`
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	position: relative;
	box-sizing: border-box;
`;

const GameRow = styled.div`
	display: flex;
	flex: 0 1 auto;
	min-height: 0;
	flex-direction: row;
	align-items: stretch;
`;

const CentralDivider = styled.div`
	width: 2px;
	background: var(--sec);
`;

export const GBA2 = (props: OverlayProps) => {
	const teamData = getTeams(props.runData, props.timer, 2);
	const allRunnerIds = props.runData?.teams.flatMap((team) => team.players.map((player) => player.id)) ?? [];

	return (
		<Standard2Container>
			{/* <img src={GBA2p} style={{ position: "absolute", height: "100%", width: "100%" }} /> */}

			<Topbar>
				<LeftBox>
					<SmallInfo timer={props.timer} runData={props.runData} />
				</LeftBox>

				<AudioIndicator
					active={props.gameAudioIndicator === allRunnerIds[0]}
					side="right"
					style={{ position: "absolute", top: 295, left: 667 }}
				/>
				<AudioIndicator
					active={props.gameAudioIndicator === allRunnerIds[1]}
					side="left"
					style={{
						position: "absolute",
						top: 295,
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
					}}
					teams={props.runData?.teams}
					audioIndicator={props.microphoneAudioIndicator}
				/>

				<RaceFinish style={{ top: 301, left: 830 }} time={teamData[0]?.time} place={teamData[0]?.place} />
				<RaceFinish style={{ top: 301, left: 960 }} time={teamData[1]?.time} place={teamData[1]?.place} />

				<RightBox>
					<div
						style={{
							display: "flex",
							width: "100%",
							flexGrow: 1,
							alignItems: "center",
							justifyContent: "center",
							gap: 8,
							padding: "0 16px",
							boxSizing: "border-box",
						}}
					>
						<Couch
							commentators={props.commentators}
							style={{ width: "30%", zIndex: 3 }}
							audio={props.microphoneAudioIndicator}
						/>
						<SponsorsBox sponsors={props.sponsors} width={400} height={230} style={{ zIndex: 5 }} />
					</div>
				</RightBox>
			</Topbar>
			<GameRow>
				<GameplayCapture aspectRatio="3:2" grow />
				<CentralDivider />
				<GameplayCapture aspectRatio="3:2" grow />
			</GameRow>
		</Standard2Container>
	);
};
