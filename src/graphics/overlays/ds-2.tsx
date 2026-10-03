import type { OverlayProps } from "../gameplay-overlay.js";

import { VerticalInfo } from "../elements/info-box/vertical.js";
import { SponsorsBox } from "../elements/sponsors.js";
import { Facecam } from "../elements/facecam.js";
import { Couch } from "../elements/couch/couch.js";
import { AudioIndicator } from "../elements/audio-indicator.js";
import { RaceFinish } from "../elements/race-finish.js";
import { getTeams } from "../elements/team-data.js";
import { Container } from "../elements/container.js";
import { GameplayCapture } from "../elements/gameplay-capture.js";
import styles from "./ds-2.module.css";

export const DS2 = (props: OverlayProps) => {
	const teamData = getTeams(props.runData, props.timer, 2);

	const allRunnerIds = props.runData?.teams.flatMap((team) => team.players.map((player) => player.id)) ?? [];

	return (
		<div className={styles.ds2Container}>
			<div className={styles.gameColumn}>
				<GameplayCapture aspectRatio="4:3" />
				<GameplayCapture aspectRatio="4:3" />
			</div>
			<div className={styles.middle}>
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
				<Container className={styles.infoBox}>
					<Couch commentators={props.commentators} style={{ zIndex: 2 }} />
					<VerticalInfo timer={props.timer} runData={props.runData} />
					<SponsorsBox sponsors={props.sponsors} width={430} height={130} style={{ zIndex: 2 }} />
				</Container>
			</div>
			<div className={styles.gameColumn}>
				<GameplayCapture aspectRatio="4:3" />
				<GameplayCapture aspectRatio="4:3" />
			</div>
		</div>
	);
};
