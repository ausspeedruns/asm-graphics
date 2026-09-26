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
import styles from "./3ds-2.module.css";

export function ThreeDS2(props: OverlayProps) {
	const teamData = getTeams(props.runData, props.timer, 2);

	const allRunnerIds = props.runData?.teams.flatMap((team) => team.players.map((player) => player.id)) ?? [];
	const customData = runCustomDataSchema.safeParse(props.runData?.customData);

	return (
		<div className={styles.threeDS2Container}>
			<div className={styles.gameRow} style={{ flex: 1 }}>
				<GameplayCapture aspectRatio="5:3" grow />
				<div className={styles.centralDivider} />
				<GameplayCapture aspectRatio="5:3" grow />
			</div>
			<div className={styles.gameRow}>
				<GameplayCapture aspectRatio="4:3" grow />
				<div className={styles.middle}>
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
					<Container className={styles.infoBox}>
						<div className={styles.infoBoxColumn} id="gameInfo">
							<RunInfo.GameTitle game={customData.data?.gameDisplay ?? props.runData?.game ?? ""} />
							<div className={styles.gameInfoBox}>
								<RunInfo.System system={props.runData?.system ?? ""} />
								<RunInfo.Year year={props.runData?.release ?? ""} />
							</div>
						</div>
						<div className={styles.infoBoxColumn} id="runInfo">
							<Timer milliseconds={props.timer?.milliseconds} />
							<div className={styles.gameInfoBox}>
								<RunInfo.Category category={props.runData?.category ?? ""} />
								<RunInfo.Estimate estimate={props.runData?.estimate ?? ""} />
							</div>
						</div>
					</Container>
				</div>
				<GameplayCapture aspectRatio="4:3" grow />
			</div>
		</div>
	);
}
