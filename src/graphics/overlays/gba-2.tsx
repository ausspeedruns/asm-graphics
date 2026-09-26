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
import styles from "./gba-2.module.css";

export const GBA2 = (props: OverlayProps) => {
	const teamData = getTeams(props.runData, props.timer, 2);
	const allRunnerIds = props.runData?.teams.flatMap((team) => team.players.map((player) => player.id)) ?? [];

	return (
		<div className={styles.standard2Container}>
			{/* <img src={GBA2p} style={{ position: "absolute", height: "100%", width: "100%" }} /> */}

			<div className={styles.topbar}>
				<Container className={styles.leftBox}>
					<SmallInfo timer={props.timer} runData={props.runData} />
				</Container>

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

				<Container className={styles.rightBox}>
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
				</Container>
			</div>
			<div className={styles.gameRow}>
				<GameplayCapture aspectRatio="3:2" grow />
				<div className={styles.centralDivider} />
				<GameplayCapture aspectRatio="3:2" grow />
			</div>
		</div>
	);
};
