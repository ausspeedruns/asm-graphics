import type { OverlayProps } from "../gameplay-overlay";

import { VerticalInfo } from "../elements/info-box/vertical";
import { SponsorsBox } from "../elements/sponsors";
import { Couch } from "../elements/couch/couch";
import { AudioIndicator } from "../elements/audio-indicator";
import { RaceFinish } from "../elements/race-finish";
import { getTeams } from "../elements/team-data";
import { Nameplate } from "../elements/nameplate";

import { runnerCustomDataSchema } from "../../shared/types/custom-data";
import { Container } from "../elements/container";
import { GameplayCapture } from "../elements/gameplay-capture";
import styles from "./widescreen-4.module.css";

export function Widescreen4(props: OverlayProps) {
	const teamData = getTeams(props.runData, props.timer, 2);

	const allRunnerIds = props.runData?.teams.flatMap((team) => team.players.map((player) => player.id)) ?? [];

	const allCustomRunnerData =
		props.runData?.teams.flatMap((team) =>
			team.players.map((player) => runnerCustomDataSchema.safeParse(player.customData ?? {}).data),
		) ?? [];

	return (
		<div className={styles.widescreen4Container}>
			{/* <div
				style={
					{
						position: "absolute",
						background: "#000",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						zIndex: 1,
						clipPath:
							"path('M 1920 472 V 428 H 1161 V 278 H 760 V 428 H 0 V 472 H 760 V 901 H 0 V 1016 H 1920 V 901 H 1161 V 472 H 1920 Z')",
					}
				}
			/> */}
			<div style={{ display: "flex", flexDirection: "column", alignItems: "stretch", height: "100%", flex: 1 }}>
				<GameplayCapture aspectRatio="16:9" />
				<Nameplate
					player={props.runData?.teams[0]?.players[0]}
					speaking={props.microphoneAudioIndicator?.[allCustomRunnerData[0]?.microphone ?? ""]}
					style={{ zIndex: 4, height: 40 }}
				/>
				<Container className={styles.sideFiller} />
				<GameplayCapture aspectRatio="16:9" />
				<Nameplate
					player={props.runData?.teams[1]?.players[0]}
					speaking={props.microphoneAudioIndicator?.[allCustomRunnerData[1]?.microphone ?? ""]}
					style={{ zIndex: 4, height: 40 }}
				/>
				<Container className={styles.sideFiller} />
			</div>
			<div className={styles.middle}>
				<div style={{ height: 278 }} />

				<RaceFinish style={{ top: 276, left: 830 }} time={teamData[0]?.time} place={teamData[0]?.place ?? -1} />
				<RaceFinish style={{ top: 276, left: 960 }} time={teamData[1]?.time} place={teamData[1]?.place ?? -1} />
				<RaceFinish style={{ top: 276, left: 830 }} time={teamData[2]?.time} place={teamData[2]?.place ?? -1} />
				<RaceFinish style={{ top: 276, left: 960 }} time={teamData[3]?.time} place={teamData[3]?.place ?? -1} />

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

				<AudioIndicator
					active={props.gameAudioIndicator === allRunnerIds[2]}
					side="top"
					style={{ position: "absolute", top: 270, left: 678 }}
				/>
				<AudioIndicator
					active={props.gameAudioIndicator === allRunnerIds[3]}
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

					<SponsorsBox sponsors={props.sponsors} width="90%" height={200} />
				</Container>
			</div>
			<div style={{ display: "flex", flexDirection: "column", alignItems: "stretch", height: "100%", flex: 1 }}>
				<GameplayCapture aspectRatio="16:9" />
				<Nameplate
					player={props.runData?.teams[2]?.players[0]}
					speaking={props.microphoneAudioIndicator?.[allCustomRunnerData[2]?.microphone ?? ""]}
					style={{ zIndex: 4, height: 40 }}
				/>
				<Container className={styles.sideFiller} />
				<GameplayCapture aspectRatio="16:9" />
				<Nameplate
					player={props.runData?.teams[3]?.players[0]}
					speaking={props.microphoneAudioIndicator?.[allCustomRunnerData[3]?.microphone ?? ""]}
					style={{ zIndex: 4, height: 40 }}
				/>
				<Container className={styles.sideFiller} />
			</div>
		</div>
	);
}
