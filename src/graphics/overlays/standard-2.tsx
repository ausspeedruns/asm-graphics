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
import styles from "./standard-2.module.css";

export function Standard2(props: OverlayProps) {
	const teamData = getTeams(props.runData, props.timer, 2);
	const allRunnerIds = props.runData?.teams.flatMap((team) => team.players.map((player) => player.id)) ?? [];

	return (
		<div className={styles.standard2Container}>
			<div className={styles.wholeGraphicClip}>
				{/* <img style={{ position: "absolute", width: "100%" }} src={Standard2p} /> */}
			</div>
			<div className={styles.topbar}>
				<Container className={styles.leftBox}>
					<SmallInfo timer={props.timer} runData={props.runData} />
				</Container>

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

				<Container className={styles.rightBox}>
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
				</Container>
			</div>
			<div className={styles.gameplayRow}>
				<GameplayCapture aspectRatio="4:3" grow />
				<div className={styles.centralDivider} />
				<GameplayCapture aspectRatio="4:3" grow />
			</div>
		</div>
	);
}
