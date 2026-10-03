import type { OverlayProps } from "../gameplay-overlay.js";

import { SponsorsBox } from "../elements/sponsors.js";
import { AudioIndicator } from "../elements/audio-indicator.js";
import { Facecam } from "../elements/facecam.js";
import { RaceFinish } from "../elements/race-finish.js";
import { Couch } from "../elements/couch/couch.js";
import { getTeams } from "../elements/team-data.js";

import { VerticalTimerBottomInfo } from "../elements/info-box/vertical-timer-bottom.js";
import { Container } from "../elements/container.js";
import styles from "./standard-widescreen.module.css";

const SponsorSize = {
	height: 230,
	width: 360,
	// marginRight: -40,
};

export const StandardWidescreen = (props: OverlayProps) => {
	const teamData = getTeams(props.runData, props.timer, 2);
	const allRunnerIds = props.runData?.teams.flatMap((team) => team.players.map((player) => player.id)) ?? [];

	return (
		<div className={styles.standardWidescreenContainer}>
			<div className={styles.wholeGraphicClip}>
				{" "}
				{/* NOTE OUT OF DATE SINCE THIS IS FOR STANDARD 2 */}
				{/* <img
					style={{ position: "absolute", width: "100%" }}
					src={Standard2p}
				/> */}
			</div>
			<div className={styles.topbar}>
				<Container className={styles.leftBox}>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							width: "100%",
							flexGrow: 1,
							alignItems: "center",
							zIndex: 2,
						}}
					>
						<SponsorsBox
							sponsors={props.sponsors}
							width={SponsorSize.width}
							height={SponsorSize.height}
							style={{ flexGrow: 1 }}
						/>
						<Couch
							commentators={props.commentators}
							style={{ width: "100%", zIndex: 3, marginBottom: 16 }}
							audio={props.microphoneAudioIndicator}
							align="center"
						/>
					</div>
				</Container>

				<AudioIndicator
					active={props.gameAudioIndicator === allRunnerIds[0]}
					side="left"
					style={{
						position: "absolute",
						top: 407,
						left: 625,
						zIndex: 2,
					}}
				/>
				<AudioIndicator
					active={props.gameAudioIndicator === allRunnerIds[1]}
					side="right"
					style={{
						position: "absolute",
						top: 407,
						right: 625,
						zIndex: 2,
					}}
				/>

				<Facecam
					width={598}
					maxNameWidth={190}
					style={{
						borderRight: "1px solid var(--sec)",
						borderLeft: "1px solid var(--sec)",
						zIndex: 2,
					}}
					teams={props.runData?.teams}
					audioIndicator={props.microphoneAudioIndicator}
				/>

				<RaceFinish style={{ top: 407, left: 830 }} time={teamData[0]?.time} place={teamData[0]?.place ?? -1} />
				<RaceFinish style={{ top: 407, left: 960 }} time={teamData[1]?.time} place={teamData[1]?.place ?? -1} />

				<Container className={styles.rightBox}>
					<VerticalTimerBottomInfo timer={props.timer} runData={props.runData} />
				</Container>
			</div>
			<div className={styles.centralDivider} />
		</div>
	);
};
